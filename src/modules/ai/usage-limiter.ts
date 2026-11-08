import type { AiLimits } from "./config";
import { AiBudgetExceededError, AiRateLimitError } from "./errors";

/**
 * Kostenkontrolle und Begrenzung der Anfragen.
 *
 * Diese Umsetzung hält die Zähler im Arbeitsspeicher eines Server-Prozesses.
 * Für den Livebetrieb mit mehreren Instanzen müssen die Zähler in einen
 * gemeinsamen Speicher (z. B. Datenbank-Tabelle oder Redis). Die Schnittstelle
 * `UsageStore` ist dafür vorbereitet.
 */
export interface UsageStore {
  /** Anzahl Anfragen eines Clients seit `since` */
  countRequests(clientKey: string, since: number): number;
  addRequest(clientKey: string, at: number): void;
  /** Summe aus Anfragen und Kosten des Tages (UTC) */
  dayTotals(day: string): { designs: number; costUsdCents: number };
  addDayUsage(day: string, designs: number, costUsdCents: number): void;
}

export class InMemoryUsageStore implements UsageStore {
  private requests = new Map<string, number[]>();
  private days = new Map<string, { designs: number; costUsdCents: number }>();

  countRequests(clientKey: string, since: number): number {
    const list = (this.requests.get(clientKey) ?? []).filter((t) => t >= since);
    this.requests.set(clientKey, list);
    return list.length;
  }

  addRequest(clientKey: string, at: number): void {
    this.requests.set(clientKey, [...(this.requests.get(clientKey) ?? []), at]);
  }

  dayTotals(day: string) {
    return this.days.get(day) ?? { designs: 0, costUsdCents: 0 };
  }

  addDayUsage(day: string, designs: number, costUsdCents: number): void {
    const t = this.dayTotals(day);
    this.days.set(day, { designs: t.designs + designs, costUsdCents: t.costUsdCents + costUsdCents });
  }
}

const HOUR_MS = 60 * 60 * 1000;
const dayKey = (now: number) => new Date(now).toISOString().slice(0, 10);

export class UsageLimiter {
  constructor(
    private readonly limits: AiLimits,
    private readonly store: UsageStore = new InMemoryUsageStore(),
    private readonly now: () => number = Date.now,
  ) {}

  /**
   * Prüft vor einem Aufruf, ob die Anfrage erlaubt ist, und reserviert sie.
   * Wirft AiRateLimitError oder AiBudgetExceededError.
   */
  reserve(clientKey: string, estimatedCostUsdCents: number): void {
    const now = this.now();
    if (estimatedCostUsdCents > this.limits.maxCostUsdCentsPerRequest) {
      throw new AiBudgetExceededError(
        `Geschätzte Kosten ${estimatedCostUsdCents} ct > Limit pro Anfrage ${this.limits.maxCostUsdCentsPerRequest} ct`,
      );
    }
    const used = this.store.countRequests(clientKey, now - HOUR_MS);
    if (used >= this.limits.maxRequestsPerHourPerClient) {
      throw new AiRateLimitError(60 * 60);
    }
    const day = this.store.dayTotals(dayKey(now));
    if (day.designs >= this.limits.maxDesignsPerDay) {
      throw new AiBudgetExceededError(`Tageslimit von ${this.limits.maxDesignsPerDay} Designs erreicht`);
    }
    if (day.costUsdCents + estimatedCostUsdCents > this.limits.maxCostUsdCentsPerDay) {
      throw new AiBudgetExceededError(
        `Tagesbudget ${this.limits.maxCostUsdCentsPerDay} ct würde überschritten (${day.costUsdCents} + ${estimatedCostUsdCents})`,
      );
    }
    this.store.addRequest(clientKey, now);
    // Kosten werden vorab mit der Schätzung reserviert und später nicht erstattet:
    // lieber zu vorsichtig als ein überzogenes Budget.
    this.store.addDayUsage(dayKey(now), 1, estimatedCostUsdCents);
  }

  /** Bucht Mehrkosten, falls ein Anbieter mehr meldet als geschätzt. */
  recordActualCost(estimatedCostUsdCents: number, actualCostUsdCents: number | null): void {
    if (actualCostUsdCents !== null && actualCostUsdCents > estimatedCostUsdCents) {
      this.store.addDayUsage(dayKey(this.now()), 0, actualCostUsdCents - estimatedCostUsdCents);
    }
  }
}
