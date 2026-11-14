/**
 * Einstellungen der KI-Schicht aus Umgebungsvariablen.
 * Nur serverseitig verwenden. Kein Wert beginnt mit NEXT_PUBLIC_, damit
 * nichts davon im Browser landet.
 */
export type Env = Readonly<Record<string, string | undefined>>;

export interface AiLimits {
  /** Anfragen pro Person (IP bzw. Konto) und Stunde */
  maxRequestsPerHourPerClient: number;
  /** Erzeugte Designs (Anfragen) pro Tag insgesamt */
  maxDesignsPerDay: number;
  /** Höchstkosten einer einzelnen Anfrage in US-Cent (Schätzung vor dem Aufruf) */
  maxCostUsdCentsPerRequest: number;
  /** Tagesbudget in US-Cent für alle Anfragen zusammen */
  maxCostUsdCentsPerDay: number;
  /** Zeitlimit je Schritt in Millisekunden */
  timeoutMs: number;
}

export const DEFAULT_AI_LIMITS: AiLimits = {
  maxRequestsPerHourPerClient: 5,
  maxDesignsPerDay: 50,
  maxCostUsdCentsPerRequest: 100,
  maxCostUsdCentsPerDay: 1000,
  timeoutMs: 90_000,
};

const LIMIT_ENV: Record<keyof AiLimits, string> = {
  maxRequestsPerHourPerClient: "AI_MAX_REQUESTS_PER_HOUR_PER_CLIENT",
  maxDesignsPerDay: "AI_MAX_DESIGNS_PER_DAY",
  maxCostUsdCentsPerRequest: "AI_MAX_COST_USD_CENTS_PER_REQUEST",
  maxCostUsdCentsPerDay: "AI_MAX_COST_USD_CENTS_PER_DAY",
  timeoutMs: "AI_TIMEOUT_MS",
};

/**
 * Liest die Limits. Ungültige Werte (keine positive ganze Zahl) werden durch
 * den sicheren Standardwert ersetzt und als Warnung gemeldet, damit ein
 * Tippfehler nie zu „unbegrenzt“ führt.
 */
export function readAiLimits(env: Env): { limits: AiLimits; warnings: string[] } {
  const limits = { ...DEFAULT_AI_LIMITS };
  const warnings: string[] = [];
  for (const key of Object.keys(LIMIT_ENV) as (keyof AiLimits)[]) {
    const name = LIMIT_ENV[key];
    const raw = env[name]?.trim();
    if (!raw) continue;
    const value = Number(raw);
    if (Number.isSafeInteger(value) && value > 0) {
      limits[key] = value;
    } else {
      warnings.push(`${name}="${raw}" ist ungültig, verwende ${DEFAULT_AI_LIMITS[key]}.`);
    }
  }
  return { limits, warnings };
}

export type AiCapability = "analysis" | "planning" | "generation";

const CAPABILITY_ENV: Record<AiCapability, string> = {
  analysis: "AI_ANALYSIS_PROVIDER",
  planning: "AI_PLANNING_PROVIDER",
  generation: "AI_IMAGE_PROVIDER",
};

function normalizeId(value: string | undefined): string | null {
  const id = value?.trim().toLowerCase();
  return id && id !== "disabled" ? id : null;
}

/** Gemeinsamer Anbieter für alle Schritte (AI_PROVIDER) oder null */
export function configuredProviderId(env: Env): string | null {
  return normalizeId(env.AI_PROVIDER);
}

/**
 * Anbieter je Schritt. Eine eigene Variable je Schritt überschreibt AI_PROVIDER,
 * z. B. Bildanalyse und Planung mit einem Sprachmodell, Bilder mit einer Bild-KI.
 */
export function providerIdFor(capability: AiCapability, env: Env): string | null {
  const specific = env[CAPABILITY_ENV[capability]];
  if (specific !== undefined && specific.trim() !== "") return normalizeId(specific);
  return configuredProviderId(env);
}
