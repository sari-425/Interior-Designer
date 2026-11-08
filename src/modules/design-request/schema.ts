import { z } from "zod";
import { DESIGN_STYLE_IDS } from "@/modules/styles/styles";
import { ROOM_TYPE_IDS } from "@/modules/rooms/room-types";
import {
  BUDGET_MAX,
  BUDGET_MIN,
  COLOR_WORLD_IDS,
  FURNITURE_OPTIONS,
  ROOM_ELEMENTS,
  VARIANT_COUNTS,
} from "./options";

/**
 * Eine vollständige Design-Anfrage. Wird im Browser für die Benutzerführung
 * und ab Phase 2 identisch auf dem Server geprüft.
 */
export const designRequestSchema = z
  .object({
    roomType: z.enum(ROOM_TYPE_IDS, { error: "Bitte wähle einen Raumtyp." }),
    style: z.enum(DESIGN_STYLE_IDS, { error: "Bitte wähle einen Designstil." }),
    colorWorld: z.enum(COLOR_WORLD_IDS, { error: "Bitte wähle eine Farbwelt." }),
    budget: z
      .number({ error: "Bitte gib ein Budget an." })
      .int("Bitte gib das Budget in ganzen Euro an.")
      .min(BUDGET_MIN, `Das Budget muss mindestens ${BUDGET_MIN} € betragen.`)
      .max(BUDGET_MAX, `Das Budget darf höchstens ${BUDGET_MAX.toLocaleString("de-DE")} € betragen.`),
    furniture: z.array(z.enum(FURNITURE_OPTIONS)).max(FURNITURE_OPTIONS.length),
    keep: z.array(z.enum(ROOM_ELEMENTS)),
    change: z.array(z.enum(ROOM_ELEMENTS)),
    notes: z.string().trim().max(500, "Bitte fasse deine Wünsche in höchstens 500 Zeichen zusammen."),
    variants: z
      .number()
      .refine((n) => (VARIANT_COUNTS as readonly number[]).includes(n), "Bitte wähle 1 bis 4 Varianten."),
  })
  .superRefine((value, ctx) => {
    const overlap = value.keep.filter((item) => value.change.includes(item));
    if (overlap.length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["change"],
        message: `„${overlap[0]}“ kann nicht gleichzeitig erhalten und verändert werden.`,
      });
    }
  });

export type DesignRequest = z.infer<typeof designRequestSchema>;
