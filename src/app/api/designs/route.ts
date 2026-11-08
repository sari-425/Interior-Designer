import "server-only";
import { readAiLimits } from "@/modules/ai/config";
import { handleDesignRequest } from "@/modules/ai/handle-design-request";
import { UsageLimiter } from "@/modules/ai/usage-limiter";

/**
 * POST /api/designs – Wohnzimmer-Design anfordern.
 * Erwartet multipart/form-data mit den Feldern `request` (JSON) und `photo` (Datei).
 *
 * Solange kein KI-Anbieter eingerichtet ist, antwortet die Route sofort mit 503,
 * ohne das Foto zu lesen. Der Browser schickt in diesem Zustand ohnehin kein Foto.
 */

const { limits, warnings } = readAiLimits(process.env);
if (warnings.length) console.warn("[ai] Konfiguration:", warnings.join(" "));
// Prozessweiter Zähler; für mehrere Instanzen siehe UsageStore in usage-limiter.ts
const limiter = new UsageLimiter(limits);

const MAX_BODY_BYTES = 11 * 1024 * 1024;

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unbekannt";
}

const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: Request) {
  const context = { clientKey: clientKey(request), env: process.env, limiter, limits };

  // Erst prüfen, ob die KI überhaupt verfügbar ist, bevor ein Foto gelesen wird
  const precheck = await handleDesignRequest({ requestJson: null, photo: null }, context);
  if (precheck.status === 503) return json(503, precheck.body);

  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return json(413, { ok: false, error: "invalid_input", message: "Das Foto ist zu groß. Erlaubt sind bis zu 10 MB." });
  }
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) {
    return json(400, { ok: false, error: "invalid_input", message: "Ungültiges Anfrageformat." });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false, error: "invalid_input", message: "Die Anfrage konnte nicht gelesen werden." });
  }
  const file = form.get("photo");
  const photo =
    file instanceof File ? { type: file.type, size: file.size, bytes: new Uint8Array(await file.arrayBuffer()) } : null;

  const response = await handleDesignRequest({ requestJson: form.get("request"), photo }, context);
  return json(response.status, response.body, "headers" in response ? response.headers : {});
}
