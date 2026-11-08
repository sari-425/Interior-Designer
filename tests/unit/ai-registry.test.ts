import { describe, expect, it } from "vitest";
import { AiNotConfiguredError } from "@/modules/ai/errors";
import { configuredProviderId, getAiProviders, getImageProvider, isAiEnabled, requireEnv, type ProviderRegistry } from "@/modules/ai/registry";
import { providerIdFor, readAiLimits, DEFAULT_AI_LIMITS } from "@/modules/ai/config";
import { fakeAnalysis, fakeGeneration, fakePlanning } from "./ai-fakes";

const registry: ProviderRegistry = {
  analysis: { test: () => fakeAnalysis() },
  planning: { test: () => fakePlanning(), llm: () => fakePlanning() },
  generation: { test: () => fakeGeneration() },
};

describe("KI-Anbieter-Verzeichnis", () => {
  it("ist ohne Konfiguration deaktiviert", () => {
    expect(configuredProviderId({})).toBeNull();
    expect(configuredProviderId({ AI_PROVIDER: "disabled" })).toBeNull();
    expect(isAiEnabled({})).toBe(false);
    expect(() => getImageProvider({})).toThrow(AiNotConfiguredError);
  });

  it("enthält derzeit keinen aktiven Anbieter", () => {
    expect(isAiEnabled({ AI_PROVIDER: "irgendwas" })).toBe(false);
    expect(() => getImageProvider({ AI_PROVIDER: "irgendwas" })).toThrow(/Unbekannter KI-Anbieter/);
    expect(() => getAiProviders({ AI_PROVIDER: "test" })).toThrow(AiNotConfiguredError);
  });

  it("wählt eingetragene Anbieter über Umgebungsvariablen", () => {
    expect(getImageProvider({ AI_PROVIDER: " Test " }, registry.generation).id).toBe("test-generation");
    expect(isAiEnabled({ AI_PROVIDER: "test" }, registry)).toBe(true);
    const providers = getAiProviders({ AI_PROVIDER: "test" }, registry);
    expect(providers.planning.id).toBe("test-planning");
  });

  it("erlaubt einen eigenen Anbieter je Schritt", () => {
    expect(providerIdFor("planning", { AI_PROVIDER: "test", AI_PLANNING_PROVIDER: "LLM" })).toBe("llm");
    expect(providerIdFor("analysis", { AI_PROVIDER: "test", AI_PLANNING_PROVIDER: "llm" })).toBe("test");
    expect(providerIdFor("generation", { AI_PROVIDER: "test", AI_IMAGE_PROVIDER: "disabled" })).toBeNull();
    expect(isAiEnabled({ AI_PROVIDER: "test", AI_IMAGE_PROVIDER: "disabled" }, registry)).toBe(false);
  });

  it("meldet fehlende Schlüssel verständlich", () => {
    expect(() => requireEnv({}, "EXAMPLE_API_KEY")).toThrow(/EXAMPLE_API_KEY fehlt/);
    expect(requireEnv({ EXAMPLE_API_KEY: " abc " }, "EXAMPLE_API_KEY")).toBe("abc");
  });
});

describe("KI-Limits", () => {
  it("nutzt sichere Standardwerte", () => {
    expect(readAiLimits({})).toEqual({ limits: DEFAULT_AI_LIMITS, warnings: [] });
  });

  it("übernimmt gültige Werte und verwirft ungültige", () => {
    const { limits, warnings } = readAiLimits({
      AI_MAX_DESIGNS_PER_DAY: "10",
      AI_MAX_COST_USD_CENTS_PER_DAY: "-5",
      AI_TIMEOUT_MS: "abc",
    });
    expect(limits.maxDesignsPerDay).toBe(10);
    expect(limits.maxCostUsdCentsPerDay).toBe(DEFAULT_AI_LIMITS.maxCostUsdCentsPerDay);
    expect(limits.timeoutMs).toBe(DEFAULT_AI_LIMITS.timeoutMs);
    expect(warnings).toHaveLength(2);
  });
});
