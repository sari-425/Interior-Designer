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
    notes: z.string().trim().max(NOTES_MAX, `Bitte fasse deine Wünsche in höchstens ${NOTES_MAX} Zeichen zusammen.`),
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
    if (new Set(value.keep).size !== value.keep.length || new Set(value.replace).size !== value.replace.length) {
      ctx.addIssue({ code: "custom", path: ["keep"], message: "Jedes Möbelstück darf nur einmal vorkommen." });
    }
  });

export type LivingRoomRequest = z.infer<typeof livingRoomRequestSchema>;
