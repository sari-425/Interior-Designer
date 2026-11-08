/**
 * Fehlerarten der KI-Schicht. Jede Fehlerart hat einen stabilen `code` für
 * Programme und eine verständliche deutsche Meldung für Nutzerinnen und Nutzer.
 * Technische Details eines Anbieters werden nie an den Browser weitergegeben.
 */
export type AiErrorCode =
  | "ai_not_configured"
  | "rate_limited"
  | "budget_exceeded"
  | "provider_error"
  | "timeout"
  | "invalid_input";

export class AiError extends Error {
  readonly code: AiErrorCode;
  readonly userMessage: string;
  readonly retryable: boolean;

  constructor(code: AiErrorCode, userMessage: string, options: { retryable?: boolean; cause?: unknown; detail?: string } = {}) {
    super(options.detail ?? userMessage, { cause: options.cause });
    this.name = "AiError";
    this.code = code;
    this.userMessage = userMessage;
    this.retryable = options.retryable ?? false;
  }
}

/** Wird geworfen, solange kein KI-Anbieter eingerichtet und freigegeben ist. */
export class AiNotConfiguredError extends AiError {
  constructor(detail = "Die KI-Bildgenerierung ist noch nicht eingerichtet.") {
    super("ai_not_configured", "Die KI-Gestaltung ist noch in Vorbereitung und derzeit nicht verfügbar.", { detail });
    this.name = "AiNotConfiguredError";
  }
}

export class AiRateLimitError extends AiError {
  readonly retryAfterSeconds: number;
  constructor(retryAfterSeconds: number) {
    super("rate_limited", "Du hast gerade sehr viele Designs angefordert. Bitte versuche es später noch einmal.", {
      retryable: true,
    });
    this.name = "AiRateLimitError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class AiBudgetExceededError extends AiError {
  constructor(detail: string) {
    super("budget_exceeded", "Die KI-Gestaltung ist für heute ausgelastet. Bitte versuche es morgen erneut.", {
      detail,
    });
    this.name = "AiBudgetExceededError";
  }
}

export class AiProviderError extends AiError {
  constructor(providerId: string, detail: string, retryable: boolean, cause?: unknown) {
    super("provider_error", "Bei der Gestaltung ist ein Fehler aufgetreten. Bitte versuche es erneut.", {
      retryable,
      cause,
      detail: `[${providerId}] ${detail}`,
    });
    this.name = "AiProviderError";
  }
}

export class AiTimeoutError extends AiError {
  constructor(step: string, timeoutMs: number) {
    super("timeout", "Die Gestaltung hat zu lange gedauert. Bitte versuche es erneut.", {
      retryable: true,
      detail: `${step} hat ${timeoutMs} ms überschritten`,
    });
    this.name = "AiTimeoutError";
  }
}
