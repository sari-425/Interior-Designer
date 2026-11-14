import type { LivingRoomRequest } from "@/modules/design-request/schema";
import { buildDesignBrief } from "./brief";
import type { AiLimits } from "./config";
import { AiError, AiProviderError, AiTimeoutError } from "./errors";
import { parseDesignPlan, parseGeneratedImage, parseRoomAnalysis, shoppingListTotalCents } from "./output-schema";
import type { UsageLimiter } from "./usage-limiter";
import type {
  DesignPlanningProvider,
  DesignResult,
  ImageGenerationProvider,
  RoomAnalysisProvider,
  SourcePhoto,
} from "./types";

export interface PipelineDeps {
  analysis: RoomAnalysisProvider;
  planning: DesignPlanningProvider;
  generation: ImageGenerationProvider;
  limiter: UsageLimiter;
  limits: AiLimits;
}

/** Geschätzte Gesamtkosten einer Anfrage in US-Cent, bevor etwas aufgerufen wird. */
export function estimateCostUsdCents(
  deps: Pick<PipelineDeps, "analysis" | "planning" | "generation">,
  variants: number,
): number {
  return deps.analysis.estimatedCostUsdCents + deps.planning.estimatedCostUsdCents + deps.generation.estimatedCostUsdCents * variants;
}

/** Führt einen Schritt mit Zeitlimit aus und wandelt unbekannte Fehler in AiProviderError um. */
async function step<T>(name: string, providerId: string, timeoutMs: number, run: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      // Erst den Zeitfehler melden, dann abbrechen: sonst gewinnt der Abbruchfehler des Anbieters das Rennen
      reject(new AiTimeoutError(name, timeoutMs));
      controller.abort();
    }, timeoutMs);
  });
  try {
    return await Promise.race([run(controller.signal), timeout]);
  } catch (error) {
    if (error instanceof AiError) throw error;
    throw new AiProviderError(providerId, `${name} fehlgeschlagen: ${error instanceof Error ? error.message : String(error)}`, true, error);
  } finally {
    clearTimeout(timer);
  }
}

const sumCosts = (costs: (number | null)[]) =>
  costs.some((c) => c === null) ? null : costs.reduce<number>((a, c) => a + (c ?? 0), 0);

/**
 * Wohnzimmer-Gestaltung in drei Schritten: Bildanalyse → Designplanung → Bildgenerierung.
 * Prüft vorher Limits und Kosten. Ruft nur die übergebenen Anbieter auf.
 * Jede Anbieter-Antwort wird gegen ein Schema geprüft; die Budgetaufteilung
 * jeder Variante muss innerhalb des Budgets der Anfrage liegen.
 */
export async function createLivingRoomDesign(
  input: { request: LivingRoomRequest; photo: SourcePhoto; clientKey: string },
  deps: PipelineDeps,
): Promise<DesignResult> {
  const { request, photo, clientKey } = input;
  const estimate = estimateCostUsdCents(deps, request.variants);
  await deps.limiter.reserve(clientKey, estimate);

  // Kosten auch bei Fehlern buchen, soweit Anbieter sie gemeldet haben
  const reported: (number | null)[] = [];
  try {
    const analysis = parseRoomAnalysis(
      await step("Bildanalyse", deps.analysis.id, deps.limits.timeoutMs, (signal) => deps.analysis.analyze({ photo, signal })),
      deps.analysis.id,
    );
    reported.push(analysis.costUsdCents);

    const rawPlan = await step("Designplanung", deps.planning.id, deps.limits.timeoutMs, (signal) =>
      deps.planning.plan({ request, analysis, brief: buildDesignBrief(request), signal }),
    );
    reported.push(rawPlan && typeof rawPlan === "object" && "costUsdCents" in rawPlan ? toCost(rawPlan.costUsdCents) : null);
    const plan = parseDesignPlan(rawPlan, request, deps.planning.id);
    const variants = plan.variants.slice(0, request.variants);

    const images = await Promise.all(
      variants.map(async (variant) => {
        const image = parseGeneratedImage(
          await step("Bildgenerierung", deps.generation.id, deps.limits.timeoutMs, (signal) =>
            deps.generation.generate({ photo, variant, request, signal }),
          ),
          deps.generation.id,
        );
        reported.push(image.costUsdCents);
        return image;
      }),
    );

    return {
      analysis: {
        detectedItems: analysis.detectedItems,
        lighting: analysis.lighting,
        description: analysis.description,
        warnings: analysis.warnings,
      },
      budgetEur: request.budgetEur,
      variants: variants.map((variant, i) => ({
        title: variant.title,
        description: variant.description,
        shoppingList: variant.shoppingList,
        shoppingListTotalEur: shoppingListTotalCents(variant.shoppingList) / 100,
        image: { url: images[i].url, width: images[i].width, height: images[i].height, aiGenerated: true },
      })),
      costUsdCents: sumCosts(reported),
      providers: { analysis: deps.analysis.id, planning: deps.planning.id, generation: deps.generation.id },
    };
  } finally {
    await deps.limiter.recordActualCost(estimate, sumCosts(reported.length ? reported : [null]));
  }
}

function toCost(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}
