import type { Env } from "./config";
import { AiNotConfiguredError } from "./errors";
import { InMemoryUsageStore, type UsageStore } from "./usage-limiter";

/**
 * Auswahl des Zählers für die Kostenkontrolle.
 *
 * Regel: Die KI darf nur laufen, wenn ein verlässlicher Zähler aktiv ist.
 *   - AI_USAGE_STORE=<id> wählt einen gemeinsamen, dauerhaften Zähler aus
 *     SHARED_USAGE_STORES (z. B. Datenbank). Noch ist keiner eingetragen.
 *   - AI_USAGE_STORE=memory ist nur für lokale Tests gedacht und wird nur
 *     angenommen, wenn zusätzlich AI_ALLOW_IN_MEMORY_LIMITS=true gesetzt ist
 *     und die App nicht im Produktionsmodus läuft (NODE_ENV development/test).
 *   - Alles andere: kein Zähler, KI bleibt abgeschaltet.
 */

export type UsageStoreFactory = (env: Env) => UsageStore;

/**
 * Gemeinsame, dauerhafte Zähler. Absichtlich leer: Es ist noch keine
 * Datenbank eingerichtet. Ein Eintrag wird ergänzt, sobald z. B. Supabase
 * freigegeben ist (Tabelle und atomare Funktion liegen als Entwurf in
 * supabase/migrations/20261108020000_ai_usage.sql).
 */
export const SHARED_USAGE_STORES: Readonly<Record<string, UsageStoreFactory>> = {};

export const IN_MEMORY_STORE_ID = "memory";

export type UsageStoreStatus =
  | { available: true; id: string; shared: boolean }
  | { available: false; reason: string };

function isLocalMode(env: Env): boolean {
  return env.NODE_ENV === "development" || env.NODE_ENV === "test";
}

/** Sagt, ob ein verlässlicher Zähler eingerichtet ist, ohne ihn zu erzeugen. */
export function usageStoreStatus(env: Env, stores: Readonly<Record<string, UsageStoreFactory>> = SHARED_USAGE_STORES): UsageStoreStatus {
  const id = env.AI_USAGE_STORE?.trim().toLowerCase();
  if (!id) return { available: false, reason: "AI_USAGE_STORE ist nicht gesetzt." };
  if (id === IN_MEMORY_STORE_ID) {
    if (env.AI_ALLOW_IN_MEMORY_LIMITS?.trim() !== "true") {
      return { available: false, reason: "In-Memory-Zähler nur mit AI_ALLOW_IN_MEMORY_LIMITS=true (lokale Tests)." };
    }
    if (!isLocalMode(env)) {
      return { available: false, reason: "In-Memory-Zähler sind im Produktionsmodus nicht erlaubt." };
    }
    return { available: true, id, shared: false };
  }
  if (!(id in stores)) return { available: false, reason: `Unbekannter Zähler „${id}“.` };
  return { available: true, id, shared: true };
}

let memoryStore: InMemoryUsageStore | null = null;

/**
 * Erzeugt den eingerichteten Zähler. Wirft AiNotConfiguredError, wenn keiner
 * verfügbar ist oder ein gemeinsamer Zähler sich nicht als gemeinsam ausweist.
 */
export function createUsageStore(env: Env, stores: Readonly<Record<string, UsageStoreFactory>> = SHARED_USAGE_STORES): UsageStore {
  const status = usageStoreStatus(env, stores);
  if (!status.available) throw new AiNotConfiguredError(`Kein verlässlicher Nutzungszähler: ${status.reason}`);
  if (status.id === IN_MEMORY_STORE_ID) {
    memoryStore ??= new InMemoryUsageStore();
    return memoryStore;
  }
  const store = stores[status.id](env);
  if (!store.shared) throw new AiNotConfiguredError(`Der Zähler „${status.id}“ ist nicht gemeinsam und dauerhaft.`);
  return store;
}
