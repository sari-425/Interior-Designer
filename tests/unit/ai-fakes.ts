/**
 * Test-Doubles für die KI-Schnittstellen. Nur für automatische Tests,
 * nie in der App eingetragen: Sie liefern feste Werte, keine echten Ergebnisse.
 */
import type { DesignPlanningProvider, ImageGenerationProvider, RoomAnalysisProvider } from "@/modules/ai/types";

export function fakeAnalysis(overrides: Partial<RoomAnalysisProvider> = {}): RoomAnalysisProvider {
  return {
    id: "test-analysis",
    displayName: "Test-Analyse",
    estimatedCostUsdCents: 1,
    analyze: async () => ({ detectedItems: ["Sofa"], lighting: "hell", description: "Test", warnings: [], costUsdCents: 1 }),
    ...overrides,
  };
}

export function fakePlanning(overrides: Partial<DesignPlanningProvider> = {}): DesignPlanningProvider {
  return {
    id: "test-planning",
    displayName: "Test-Planung",
    estimatedCostUsdCents: 2,
    plan: async ({ request }) => ({
      variants: Array.from({ length: 4 }, (_, i) => ({
        title: `Variante ${i + 1}`,
        description: `Beschreibung ${i + 1}`,
        imagePrompt: `prompt ${request.style} ${i + 1}`,
        shoppingList: [{ category: "Sofa", budgetEur: 500 }],
      })),
      costUsdCents: 2,
    }),
    ...overrides,
  };
}

export function fakeGeneration(overrides: Partial<ImageGenerationProvider> = {}): ImageGenerationProvider {
  return {
    id: "test-generation",
    displayName: "Test-Bilder",
    estimatedCostUsdCents: 4,
    generate: async ({ variant }) => ({
      url: `https://example.test/${encodeURIComponent(variant.title)}.png`,
      width: 1024,
      height: 768,
      aiGenerated: true,
      costUsdCents: 4,
    }),
    ...overrides,
  };
}
