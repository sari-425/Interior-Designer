import { configuredProviderId, providerIdFor, type AiCapability, type Env } from "./config";
import { AiNotConfiguredError } from "./errors";
import type { DesignPlanningProvider, ImageGenerationProvider, RoomAnalysisProvider } from "./types";

export { configuredProviderId };

type Factory<T> = (env: Env) => T;

export interface ProviderRegistry {
  analysis: Readonly<Record<string, Factory<RoomAnalysisProvider>>>;
  planning: Readonly<Record<string, Factory<DesignPlanningProvider>>>;
  generation: Readonly<Record<string, Factory<ImageGenerationProvider>>>;
}

/**
 * Verzeichnis der verfügbaren KI-Anbieter.
 *
 * Absichtlich leer: Es ist noch kein Anbieter ausgewählt und freigegeben.
 * Es gibt bewusst auch keinen "Schein-Anbieter", der Ergebnisse vortäuscht.
 * Ein neuer Anbieter wird als eigene Datei in `providers/` umgesetzt und hier
 * eingetragen. Er liest seinen API-Schlüssel selbst aus `env`, z. B.:
 *   generation: { example: (env) => createExampleImageProvider({ apiKey: requireEnv(env, "EXAMPLE_API_KEY") }) }
 */
export const PROVIDERS: ProviderRegistry = {
  analysis: {},
  planning: {},
  generation: {},
};

function resolve<T>(capability: AiCapability, env: Env, factories: Readonly<Record<string, Factory<T>>>): T {
  const id = providerIdFor(capability, env);
  if (!id) throw new AiNotConfiguredError();
  const factory = factories[id];
  if (!factory) throw new AiNotConfiguredError(`Unbekannter KI-Anbieter „${id}“ für ${capability}.`);
  return factory(env);
}

/** true, wenn für alle drei Schritte ein eingetragener Anbieter konfiguriert ist */
export function isAiEnabled(env: Env = process.env, registry: ProviderRegistry = PROVIDERS): boolean {
  return (["analysis", "planning", "generation"] as const).every((capability) => {
    const id = providerIdFor(capability, env);
    return id !== null && id in registry[capability];
  });
}

/** Bildgenerierung (rückwärtskompatibel zu Phase 1b) */
export function getImageProvider(
  env: Env = process.env,
  providers: ProviderRegistry["generation"] = PROVIDERS.generation,
): ImageGenerationProvider {
  return resolve("generation", env, providers);
}

/** Alle drei Anbieter. Wirft AiNotConfiguredError, wenn einer fehlt. */
export function getAiProviders(env: Env = process.env, registry: ProviderRegistry = PROVIDERS) {
  return {
    analysis: resolve("analysis", env, registry.analysis),
    planning: resolve("planning", env, registry.planning),
    generation: resolve("generation", env, registry.generation),
  };
}

/** Liest einen Pflichtwert (z. B. API-Schlüssel) und meldet fehlende Werte klar. */
export function requireEnv(env: Env, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new AiNotConfiguredError(`Die Umgebungsvariable ${name} fehlt.`);
  return value;
}
