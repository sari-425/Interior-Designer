import { describe, expect, it } from "vitest";
import { DEFAULT_AI_LIMITS } from "@/modules/ai/config";
import { AiBudgetExceededError, AiNotConfiguredError, AiRateLimitError } from "@/modules/ai/errors";
import { InMemoryUsageStore, UsageLimiter, type UsageStore } from "@/modules/ai/usage-limiter";
import { createUsageStore, usageStoreStatus, type UsageStoreFactory } from "@/modules/ai/usage-store";

const LOCAL = { NODE_ENV: "test", AI_USAGE_STORE: "memory", AI_ALLOW_IN_MEMORY_LIMITS: "true" };

/** Test-Double für einen gemeinsamen Zähler (keine echte Datenbank) */
function fakeSharedStore(shared = true): UsageStore {
  const memory = new InMemoryUsageStore();
  return { id: "shared-test", shared, tryReserve: (i) => memory.tryReserve(i), addCost: (d, c) => memory.addCost(d, c) };
}

describe("Auswahl des Nutzungszählers", () => {
  it("ist ohne Einstellung nicht verfügbar", () => {
    expect(usageStoreStatus({})).toMatchObject({ available: false });
    expect(() => createUsageStore({})).toThrow(AiNotConfiguredError);
  });

  it("erlaubt In-Memory nur mit ausdrücklicher Freigabe und nur lokal", () => {
    expect(usageStoreStatus({ ...LOCAL, AI_ALLOW_IN_MEMORY_LIMITS: undefined })).toMatchObject({ available: false });
    expect(usageStoreStatus({ ...LOCAL, AI_ALLOW_IN_MEMORY_LIMITS: "yes" })).toMatchObject({ available: false });
    expect(usageStoreStatus({ ...LOCAL, NODE_ENV: "production" })).toMatchObject({ available: false, reason: expect.stringContaining("Produktionsmodus") });
    expect(usageStoreStatus({ ...LOCAL, NODE_ENV: undefined })).toMatchObject({ available: false });
    expect(usageStoreStatus(LOCAL)).toEqual({ available: true, id: "memory", shared: false });
    expect(usageStoreStatus({ ...LOCAL, NODE_ENV: "development" })).toMatchObject({ available: true });
  });

  it("verwendet im selben Prozess immer denselben In-Memory-Zähler", () => {
    expect(createUsageStore(LOCAL)).toBe(createUsageStore(LOCAL));
  });

  it("enthält derzeit keinen gemeinsamen Zähler", () => {
    expect(usageStoreStatus({ AI_USAGE_STORE: "supabase" })).toMatchObject({ available: false });
  });

  it("nimmt eingetragene gemeinsame Zähler an, auch im Produktionsmodus", () => {
    const stores: Record<string, UsageStoreFactory> = { "shared-test": () => fakeSharedStore() };
    const env = { NODE_ENV: "production", AI_USAGE_STORE: "shared-test" };
    expect(usageStoreStatus(env, stores)).toEqual({ available: true, id: "shared-test", shared: true });
    expect(createUsageStore(env, stores).shared).toBe(true);
  });

  it("lehnt einen eingetragenen Zähler ab, der nicht gemeinsam ist", () => {
    const stores: Record<string, UsageStoreFactory> = { bad: () => fakeSharedStore(false) };
    expect(() => createUsageStore({ AI_USAGE_STORE: "bad" }, stores)).toThrow(/nicht gemeinsam/);
  });
});

describe("Nutzungslimiter", () => {
  const now = () => Date.UTC(2026, 10, 8, 12);

  it("bucht Anfragen und Kosten atomar und lässt gleichzeitige Anfragen das Limit nicht überschreiten", async () => {
    const store = new InMemoryUsageStore();
    const limiter = new UsageLimiter({ ...DEFAULT_AI_LIMITS, maxDesignsPerDay: 3 }, store, now);
    const results = await Promise.allSettled(Array.from({ length: 6 }, (_, i) => limiter.reserve(`c${i}`, 10)));
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(3);
    expect(store.dayTotals("2026-11-08")).toEqual({ designs: 3, costUsdCents: 30 });
  });

  it("meldet Limits als verständliche Fehler", async () => {
    const limiter = new UsageLimiter({ ...DEFAULT_AI_LIMITS, maxRequestsPerHourPerClient: 1 }, new InMemoryUsageStore(), now);
    await limiter.reserve("a", 1);
    await expect(limiter.reserve("a", 1)).rejects.toBeInstanceOf(AiRateLimitError);
    await expect(limiter.reserve("b", 500)).rejects.toBeInstanceOf(AiBudgetExceededError);
  });

  it("bucht Mehrkosten nach, aber nie weniger als die Schätzung", async () => {
    const store = new InMemoryUsageStore();
    const limiter = new UsageLimiter(DEFAULT_AI_LIMITS, store, now);
    await limiter.reserve("a", 10);
    await limiter.recordActualCost(10, 4);
    await limiter.recordActualCost(10, null);
    expect(store.dayTotals("2026-11-08").costUsdCents).toBe(10);
    await limiter.recordActualCost(10, 25);
    expect(store.dayTotals("2026-11-08").costUsdCents).toBe(25);
  });
});
