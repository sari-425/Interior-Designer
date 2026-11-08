import { livingRoomRequestSchema } from "@/modules/design-request/schema";
import {
  MAX_IMAGE_BYTES,
  readImageDimensions,
  validateImageDimensions,
  validateImageFile,
} from "@/lib/validation/image-upload";
import type { Env } from "./config";
import { AiError, AiNotConfiguredError, AiRateLimitError } from "./errors";
import { createLivingRoomDesign } from "./pipeline";
import { getAiProviders, isAiEnabled, PROVIDERS, type ProviderRegistry } from "./registry";
import type { UsageLimiter } from "./usage-limiter";
import type { AiLimits } from "./config";
import type { AcceptedImageMime, DesignResult } from "./types";

export interface DesignSubmission {
  /** JSON-Text der Wohnzimmer-Anfrage */
  requestJson: unknown;
  photo: { type: string; size: number; bytes: Uint8Array } | null;
}

export type DesignResponse =
  | { status: 200; body: { ok: true; result: DesignResult } }
  | {
      status: 400 | 413 | 429 | 502 | 503 | 504;
      body: { ok: false; error: string; message: string };
      headers?: Record<string, string>;
    };

const fail = (
  status: Exclude<DesignResponse["status"], 200>,
  error: string,
  message: string,
  headers?: Record<string, string>,
): DesignResponse => ({ status, body: { ok: false, error, message }, headers });

/**
 * Serverseitige Verarbeitung einer Design-Anfrage, unabhängig von Next.js
 * und dadurch testbar. Reihenfolge: KI verfügbar? → Eingaben prüfen →
 * Foto prüfen → Limits/Kosten → Anbieter aufrufen.
 */
export async function handleDesignRequest(
  submission: DesignSubmission,
  context: { clientKey: string; env: Env; limiter: UsageLimiter; limits: AiLimits; registry?: ProviderRegistry },
): Promise<DesignResponse> {
  const registry = context.registry ?? PROVIDERS;
  if (!isAiEnabled(context.env, registry)) {
    const e = new AiNotConfiguredError();
    return fail(503, e.code, e.userMessage);
  }

  let parsedJson: unknown = submission.requestJson;
  if (typeof parsedJson === "string") {
    try {
      parsedJson = JSON.parse(parsedJson);
    } catch {
      return fail(400, "invalid_input", "Die Angaben konnten nicht gelesen werden.");
    }
  }
  const request = livingRoomRequestSchema.safeParse(parsedJson);
  if (!request.success) {
    return fail(400, "invalid_input", request.error.issues[0]?.message ?? "Die Angaben sind unvollständig.");
  }

  const photo = submission.photo;
  if (!photo) return fail(400, "invalid_input", "Bitte lade ein Foto deines Wohnzimmers hoch.");
  if (photo.size > MAX_IMAGE_BYTES || photo.bytes.length > MAX_IMAGE_BYTES) {
    return fail(413, "invalid_input", "Das Foto ist zu groß. Erlaubt sind bis zu 10 MB.");
  }
  const fileCheck = validateImageFile({ type: photo.type, size: photo.bytes.length }, photo.bytes.slice(0, 12));
  if (!fileCheck.ok) return fail(400, "invalid_input", fileCheck.error);
  const dims = readImageDimensions(photo.bytes);
  if (!dims) return fail(400, "invalid_input", "Die Bildmaße konnten nicht gelesen werden. Bitte versuche ein anderes Foto.");
  const dimCheck = validateImageDimensions(dims.width, dims.height);
  if (!dimCheck.ok) return fail(400, "invalid_input", dimCheck.error);

  try {
    const providers = getAiProviders(context.env, registry);
    const result = await createLivingRoomDesign(
      {
        request: request.data,
        clientKey: context.clientKey,
        photo: { kind: "inline", bytes: photo.bytes, mimeType: photo.type as AcceptedImageMime, ...dims },
      },
      { ...providers, limiter: context.limiter, limits: context.limits },
    );
    return { status: 200, body: { ok: true, result } };
  } catch (error) {
    if (error instanceof AiRateLimitError) {
      return fail(429, error.code, error.userMessage, { "Retry-After": String(error.retryAfterSeconds) });
    }
    if (error instanceof AiError) {
      const status = error.code === "budget_exceeded" ? 429 : error.code === "timeout" ? 504 : error.code === "ai_not_configured" ? 503 : 502;
      // Technische Details nur ins Server-Log, nie an den Browser
      console.error("[ai]", error.code, error.message);
      return fail(status, error.code, error.userMessage);
    }
    console.error("[ai] unerwarteter Fehler", error);
    return fail(502, "provider_error", "Bei der Gestaltung ist ein Fehler aufgetreten. Bitte versuche es erneut.");
  }
}
