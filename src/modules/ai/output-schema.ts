import { z } from "zod";
import type { LivingRoomRequest } from "@/modules/design-request/schema";
import { AiInvalidOutputError } from "./errors";
import type { DesignPlan, GeneratedImage, RoomAnalysis } from "./types";

/**
 * Prüfung aller KI-Ausgaben auf dem Server.
 *
 * Ein KI-Anbieter kann unvollständige, falsch formatierte oder schlicht
 * unpassende Antworten liefern. Nichts davon darf ungeprüft an Nutzerinnen
 * und Nutzer gehen. Jede Antwort wird deshalb gegen ein festes Schema geprüft;
 * die Budgetaufteilung der Planung muss zusätzlich zum Budget der Anfrage passen.
 */

/** Kosten in US-Cent: ganze, nicht negative Zahl oder null (unbekannt) */
const costSchema = z.number().int().nonnegative().max(100_000).nullable();

const text = (max: number) => z.string().trim().min(1).max(max);

export const roomAnalysisSchema = z
  .object({
    detectedItems: z.array(text(80)).max(40),
    lighting: z.enum(["hell", "mittel", "dunkel", "unbekannt"]),
    description: z.string().trim().max(1000),
    warnings: z.array(text(200)).max(10),
    costUsdCents: costSchema,
  })
  .strict();

/** Ein Eintrag der Budgetaufteilung: Kategorie mit Betrag in Euro (höchstens zwei Nachkommastellen) */
export const budgetLineSchema = z
  .object({
    category: text(80),
    budgetEur: z
      .number()
      .positive()
      .max(1_000_000)
      .refine((n) => Math.abs(Math.round(n * 100) - n * 100) < 1e-6, "höchstens zwei Nachkommastellen"),
  })
  .strict();

export const designPlanVariantSchema = z
  .object({
    title: text(80),
    description: text(1500),
    imagePrompt: text(4000),
    shoppingList: z
      .array(budgetLineSchema)
      .min(1)
      .max(30)
      .superRefine((lines, ctx) => {
        const seen = new Set<string>();
        for (const line of lines) {
          const key = line.category.toLowerCase();
          if (seen.has(key)) ctx.addIssue({ code: "custom", message: `Kategorie „${line.category}“ doppelt` });
          seen.add(key);
        }
      }),
  })
  .strict();

export const designPlanSchema = z
  .object({
    variants: z.array(designPlanVariantSchema).min(1).max(8),
    costUsdCents: costSchema,
  })
  .strict();

export const generatedImageSchema = z
  .object({
    url: z
      .string()
      .min(1)
      .max(2048)
      .refine(
        (u) => u.startsWith("https://") || /^[a-z0-9-]+\/[A-Za-z0-9/_.-]+$/.test(u),
        "nur https-Adressen oder Pfade im privaten Speicher",
      ),
    width: z.number().int().min(256).max(8192),
    height: z.number().int().min(256).max(8192),
    aiGenerated: z.literal(true),
    costUsdCents: costSchema,
  })
  .strict();

const toCents = (eur: number) => Math.round(eur * 100);

/** Summe einer Budgetaufteilung in Cent (ganzzahlig, ohne Rundungsfehler) */
export function shoppingListTotalCents(lines: { budgetEur: number }[]): number {
  return lines.reduce((sum, line) => sum + toCents(line.budgetEur), 0);
}

export interface BudgetCheck {
  ok: boolean;
  budgetCents: number;
  totalCents: number;
}

/** Prüft, ob die geplante Aufteilung einer Variante innerhalb des Budgets der Anfrage bleibt. */
export function checkVariantBudget(lines: { budgetEur: number }[], budgetEur: number): BudgetCheck {
  const budgetCents = toCents(budgetEur);
  const totalCents = shoppingListTotalCents(lines);
  return { ok: totalCents <= budgetCents, budgetCents, totalCents };
}

function describeIssues(error: z.ZodError): string {
  return error.issues
    .slice(0, 5)
    .map((i) => `${i.path.join(".") || "(wurzel)"}: ${i.message}`)
    .join("; ");
}

function parse<T>(schema: z.ZodType<T>, value: unknown, providerId: string, what: string): T {
  const result = schema.safeParse(value);
  if (!result.success) throw new AiInvalidOutputError(providerId, `${what}: ${describeIssues(result.error)}`);
  return result.data;
}

export function parseRoomAnalysis(value: unknown, providerId: string): RoomAnalysis & { costUsdCents: number | null } {
  return parse(roomAnalysisSchema, value, providerId, "Bildanalyse ungültig");
}

export function parseGeneratedImage(value: unknown, providerId: string): GeneratedImage & { costUsdCents: number | null } {
  return parse(generatedImageSchema, value, providerId, "Bild ungültig");
}

/**
 * Prüft die Designplanung: Schema, genug Varianten für die Anfrage und
 * Budgetaufteilung je Variante innerhalb des Budgets. Überschreitet eine
 * Variante das Budget, wird die ganze Planung abgelehnt, statt still eine
 * zu teure Einkaufsliste anzuzeigen.
 */
export function parseDesignPlan(
  value: unknown,
  request: Pick<LivingRoomRequest, "budgetEur" | "variants">,
  providerId: string,
): DesignPlan & { costUsdCents: number | null } {
  const plan = parse(designPlanSchema, value, providerId, "Designplanung ungültig");
  if (plan.variants.length < request.variants) {
    throw new AiInvalidOutputError(
      providerId,
      `Designplanung lieferte ${plan.variants.length} statt ${request.variants} Varianten`,
    );
  }
  plan.variants.forEach((variant, index) => {
    const check = checkVariantBudget(variant.shoppingList, request.budgetEur);
    if (!check.ok) {
      throw new AiInvalidOutputError(
        providerId,
        `Variante ${index + 1} überschreitet das Budget: ${check.totalCents / 100} € > ${check.budgetCents / 100} €`,
      );
    }
  });
  return plan;
}
