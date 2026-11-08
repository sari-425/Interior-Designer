import { z } from "zod";
import { DESIGN_STYLE_IDS } from "@/modules/styles/styles";
import {
  ATMOSPHERE_IDS,
  BUDGET_MAX,
  BUDGET_MIN,
  COLOR_WORLD_IDS,
  LIVING_ROOM_ITEMS,
  NOTES_MAX,
  ROOM_SIZE_MAX,
  ROOM_SIZE_MIN,
  ROOM_FEATURES,
  ROOM_SURFACES,
  SPECIAL_REQUIREMENTS,
  VARIANT_COUNTS,
} from "./options";

const euro = (n: number) => `${n.toLocaleString("de-DE")} €`;

/**
 * Eine vollständige Wohnzimmer-Anfrage. Wird im Browser für die Benutzerführung
 * und später identisch auf dem Server geprüft, bevor etwas gespeichert oder an
 * einen KI-Anbieter übergeben wird.
 */
export const livingRoomRequestSchema = z
  .object({
    roomType: z.literal("wohnzimmer"),
    roomSizeSqm: z
      .number({ error: "Bitte gib die Raumgröße als Zahl an." })
      .min(ROOM_SIZE_MIN, `Die Raumgröße muss mindestens ${ROOM_SIZE_MIN} m² betragen.`)
      .max(ROOM_SIZE_MAX, `Die Raumgröße darf höchstens ${ROOM_SIZE_MAX} m² betragen.`)
      .nullable(),
    roomFeatures: z.array(z.enum(ROOM_FEATURES, { error: "Unbekanntes Raummerkmal." })),
    style: z.enum(DESIGN_STYLE_IDS, { error: "Bitte wähle einen Einrichtungsstil." }),
    colorWorld: z.enum(COLOR_WORLD_IDS, { error: "Bitte wähle deine Farben." }),
    atmosphere: z.enum(ATMOSPHERE_IDS, { error: "Bitte wähle eine Atmosphäre." }),
    budgetEur: z
      .number({ error: "Bitte gib dein maximales Budget an." })
      .int("Bitte gib das Budget in ganzen Euro an.")
      .min(BUDGET_MIN, `Das Budget muss mindestens ${euro(BUDGET_MIN)} betragen.`)
      .max(BUDGET_MAX, `Das Budget darf höchstens ${euro(BUDGET_MAX)} betragen.`),
    keep: z.array(z.enum(LIVING_ROOM_ITEMS)),
    replace: z.array(z.enum(LIVING_ROOM_ITEMS)),
    keepSurfaces: z.array(z.enum(ROOM_SURFACES)),
    changeSurfaces: z.array(z.enum(ROOM_SURFACES)),
    requirements: z.array(z.enum(SPECIAL_REQUIREMENTS, { error: "Unbekannte Anforderung." })),
    notes: z.string().trim().max(NOTES_MAX, `Bitte fasse deine Wünsche in höchstens ${NOTES_MAX} Zeichen zusammen.`),
    variants: z
      .number()
      .refine((n) => (VARIANT_COUNTS as readonly number[]).includes(n), "Bitte wähle 1 bis 4 Designvarianten."),
  })
  .superRefine((value, ctx) => {
    const overlap = value.keep.find((item) => value.replace.includes(item));
    if (overlap) {
      ctx.addIssue({
        code: "custom",
        path: ["replace"],
        message: `„${overlap}“ kann nicht gleichzeitig behalten und ersetzt werden.`,
      });
    }
    const surfaceOverlap = value.keepSurfaces.find((s) => value.changeSurfaces.includes(s));
    if (surfaceOverlap) {
      ctx.addIssue({
        code: "custom",
        path: ["changeSurfaces"],
        message: `„${surfaceOverlap}“ kann nicht gleichzeitig behalten und verändert werden.`,
      });
    }
    if (new Set(value.keep).size !== value.keep.length || new Set(value.replace).size !== value.replace.length) {
      ctx.addIssue({ code: "custom", path: ["keep"], message: "Jedes Möbelstück darf nur einmal vorkommen." });
    }
    for (const key of ["roomFeatures", "requirements", "keepSurfaces", "changeSurfaces"] as const) {
      if (new Set(value[key]).size !== value[key].length) {
        ctx.addIssue({ code: "custom", path: [key], message: "Jede Angabe darf nur einmal vorkommen." });
      }
    }
    if (value.roomFeatures.includes("Niedrige Decke") && value.roomFeatures.includes("Hohe Decke")) {
      ctx.addIssue({ code: "custom", path: ["roomFeatures"], message: "Bitte wähle entweder „Niedrige Decke“ oder „Hohe Decke“." });
    }
    if (value.roomFeatures.includes("Viel Tageslicht") && value.roomFeatures.includes("Wenig Tageslicht")) {
      ctx.addIssue({ code: "custom", path: ["roomFeatures"], message: "Bitte wähle entweder „Viel Tageslicht“ oder „Wenig Tageslicht“." });
    }
  });

export type LivingRoomRequest = z.infer<typeof livingRoomRequestSchema>;
