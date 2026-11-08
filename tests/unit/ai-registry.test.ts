import { describe, expect, it } from "vitest";
import { AiNotConfiguredError, type ImageGenerationProvider } from "@/modules/ai/image-provider";
import { configuredProviderId, getImageProvider, isAiEnabled } from "@/modules/ai/registry";

const fakeProvider: ImageGenerationProvider = {
  id: "test",
  displayName: "Test",
  generate: async () => ({ status: "failed", providerId: "test", error: "nur Test", retryable: false }),
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
  });

  it("wählt einen eingetragenen Anbieter über die Umgebungsvariable", () => {
    const provider = getImageProvider({ AI_PROVIDER: " Test " }, { test: () => fakeProvider });
    expect(provider.id).toBe("test");
  });
});
