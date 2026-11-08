import { AiNotConfiguredError, type ImageGenerationProvider } from "./image-provider";

/**
 * Verzeichnis der verfügbaren KI-Anbieter.
 *
 * Absichtlich leer: Es ist noch kein Anbieter ausgewählt und freigegeben.
 * Es gibt bewusst auch keinen "Schein-Anbieter", der Ergebnisse vortäuscht.
 * Ein neuer Anbieter wird hier mit seiner ID eingetragen, z. B.:
 *   example: () => createExampleProvider({ apiKey: requireEnv("AI_PROVIDER_API_KEY") })
 */
const PROVIDERS: Readonly<Record<string, () => ImageGenerationProvider>> = {};

type Env = Readonly<Record<string, string | undefined>>;

/** Liefert die ID des konfigurierten Anbieters oder null, wenn die KI deaktiviert ist. */
export function configuredProviderId(env: Env = process.env): string | null {
  const id = env.AI_PROVIDER?.trim().toLowerCase();
  return id && id !== "disabled" ? id : null;
}

export function isAiEnabled(env: Env = process.env): boolean {
  const id = configuredProviderId(env);
  return id !== null && id in PROVIDERS;
}

/**
 * Gibt den konfigurierten Anbieter zurück.
 * Wirft AiNotConfiguredError, wenn keiner eingerichtet ist.
 */
export function getImageProvider(
  env: Env = process.env,
  providers: Readonly<Record<string, () => ImageGenerationProvider>> = PROVIDERS,
): ImageGenerationProvider {
  const id = configuredProviderId(env);
  if (!id) throw new AiNotConfiguredError();
  const factory = providers[id];
  if (!factory) throw new AiNotConfiguredError(`Unbekannter KI-Anbieter „${id}“.`);
  return factory();
}
