import type { AiLimits } from "./config";
import { AiBudgetExceededError, AiRateLimitError } from "./errors";

/**
 * Kostenkontrolle und Begrenzung der Anfragen.
 *
 * Die Zähler liegen in einem `UsageStore`. Für den Livebetrieb muss das ein
 * gemeinsamer, dauerhafter Speicher sein (z. B. eine Datenbank-Tabelle mit
 * atomarer Funktion, siehe supabase/migrations/…_ai_usage.sql), damit alle
 * Server-Instanzen dieselben Zähler sehen und ein Neustart die Zähler nicht
 * zurücksetzt. Ohne einen solchen Speicher bleibt die KI abgeschaltet
 * (siehe usage-store.ts und isAiEnabled()).
 */

export type ReserveRejection = "client_hourly_limit" | "daily_design_limit" | "daily_budget";

export interface ReserveInput {
  clientKey: string;
  /** Zeitpunkt der Anfrage (ms seit 1970) */
  now: number;
  /** Beginn des Stundenfensters für die Begrenzung pro Person */
  windowStart: number;
  /** Kalendertag (UTC) im Format JJJJ-MM-TT */
  day: string;
  estimatedCostUsdCents: number;
  limits: Pick<AiLimits, "maxRequestsPerHourPerClient" | "maxDesignsPerDay" | "maxCostUsdCentsPerDay">;
}

export interface UsageStore {
  /** Kennung, z. B. "memory" oder "supabase" */
  readonly id: string;
  /**
   * true nur, wenn alle Server-Instanzen dieselben Zähler sehen und die
   * Zähler einen Neustart überstehen. Nur dann darf die KI live laufen.
   */
  readonly shared: boolean;
  /**
   * Prüft alle Limits und bucht die Anfrage samt geschätzter Kosten in einem
   * Schritt (atomar). Zwei gleichzeitige Anfragen dürfen ein Limit nicht
   * gemeinsam überschreiten.
   */
  tryReserve(input: ReserveInput): Promise<{ ok: true } | { ok: false; reason: ReserveRejection }>;
  /** Bucht zusätzliche Kosten auf einen Tag (z. B. wenn ein Anbieter mehr meldet als geschätzt). */
  addCost(day: string, costUsdCents: number): Promise<void>;
}

/**
 * Zähler im Arbeitsspeicher eines einzelnen Server-Prozesses.
 * Nur für automatische Tests und ausdrücklich freigegebene lokale Versuche:
 * Mehrere Instanzen hätten getrennte Zähler, ein Neustart setzt alles zurück.
 */
export class InMemoryUsageStore implements UsageStore {
  readonly id = "memory";
  readonly shared = false;
  private requests = new Map<string, number[]>();
  private days = new Map<string, { designs: number; costUsdCents: number }>();

  async tryReserve(input: ReserveInput): Promise<{ ok: true } | { ok: false; reason: ReserveRejection }> {
    // Ohne await zwischen Prüfen und Buchen: in einem Prozess atomar
    const recent = (this.requests.get(input.clientKey) ?? []).filter((t) => t >= input.windowStart);
    if (recent.length >= input.limits.maxRequestsPerHourPerClient) {
      this.requests.set(input.clientKey, recent);
      return { ok: false, reason: "client_hourly_limit" };
    }
    const day = this.days.get(input.day) ?? { designs: 0, costUsdCents: 0 };
    if (day.designs >= input.limits.maxDesignsPerDay) return { ok: false, reason: "daily_design_limit" };
    if (day.costUsdCents + input.estimatedCostUsdCents > input.limits.maxCostUsdCentsPerDay) {
      return { ok: false, reason: "daily_budget" };
    }
    this.requests.set(input.clientKey, [...recent, input.now]);
    this.days.set(input.day, { designs: day.designs + 1, costUsdCents: day.costUsdCents + input.estimatedCostUsdCents });
    return { ok: true };
  }

  async addCost(day: string, costUsdCents: number): Promise<void> {
    const t = this.days.get(day) ?? { designs: 0, costUsdCents: 0 };
    this.days.set(day, { designs: t.designs, costUsdCents: t.costUsdCents + costUsdCents });
  }

  /** Nur für Tests */
  dayTotals(day: string) {
    return this.days.get(day) ?? { designs: 0, costUsdCents: 0 };
  }
}

const HOUR_MS = 60 * 60 * 1000;
export const dayKey = (now: number) => new Date(now).toISOString().slice(0, 10);

export class UsageLimiter {
  constructor(
    private readonly limits: AiLimits,
    private readonly store: UsageStore,
    private readonly now: () => number = Date.now,
  ) {}

  get storeInfo() {
    return { id: this.store.id, shared: this.store.shared };
  }

  /**
   * Prüft vor einem Aufruf, ob die Anfrage erlaubt ist, und reserviert sie.
   * Wirft AiRateLimitError oder AiBudgetExceededError.
   * Die Kosten werden vorab mit der Schätzung gebucht und später nicht
   * erstattet: lieber zu vorsichtig als ein überzogenes Budget.
   */
  async reserve(clientKey: string, estimatedCostUsdCents: number): Promise<void> {
    if (estimatedCostUsdCents > this.limits.maxCostUsdCentsPerRequest) {
      throw new AiBudgetExceededError(
        `Geschätzte Kosten ${estimatedCostUsdCents} ct > Limit pro Anfrage ${this.limits.maxCostUsdCentsPerRequest} ct`,
      );
    }
    const now = this.now();
    const result = await this.store.tryReserve({
      clientKey,
      now,
      windowStart: now - HOUR_MS,
      day: dayKey(now),
      estimatedCostUsdCents,
      limits: this.limits,
    });
    if (result.ok) return;
    switch (result.reason) {
      case "client_hourly_limit":
        throw new AiRateLimitError(60 * 60);
      case "daily_design_limit":
        throw new AiBudgetExceededError(`Tageslimit von ${this.limits.maxDesignsPerDay} Designs erreicht`);
      case "daily_budget":
        throw new AiBudgetExceededError(
          `Tagesbudget ${this.limits.maxCostUsdCentsPerDay} ct würde überschritten (+${estimatedCostUsdCents} ct)`,
        );
    }
  }

  /** Bucht Mehrkosten, falls ein Anbieter mehr meldet als geschätzt. */
  async recordActualCost(estimatedCostUsdCents: number, actualCostUsdCents: number | null): Promise<void> {
    if (actualCostUsdCents !== null && actualCostUsdCents > estimatedCostUsdCents) {
      await this.store.addCost(dayKey(this.now()), actualCostUsdCents - estimatedCostUsdCents);
    }
  }
}
