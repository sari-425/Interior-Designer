import { RoomIllustration } from "@/components/illustrations/RoomIllustration";
import { DESIGN_STYLES, type DesignStyleId } from "@/modules/styles/styles";
import { ChoiceCard } from "./ChoiceCard";

export function StyleStep({ value, onChange }: { value: DesignStyleId | null; onChange: (v: DesignStyleId) => void }) {
  return (
    <fieldset>
      <legend className="font-display text-3xl">Welcher Einrichtungsstil gefällt dir?</legend>
      <p className="mt-3 text-muted">Die Bilder sind Illustrationen und zeigen die Stimmung des Stils.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {DESIGN_STYLES.map((style) => (
          <ChoiceCard
            key={style.id}
            name="style"
            value={style.id}
            selected={value === style.id}
            onSelect={() => onChange(style.id)}
            className="overflow-hidden"
          >
            <div className="aspect-[4/3] bg-sand">
              <RoomIllustration palette={style.palette} label={`Illustration: Wohnzimmer im Stil ${style.name}`} className="h-full" />
            </div>
            <span className="block px-4 pb-4 pt-3">
              <span className="block text-lg">{style.name}</span>
              <span className="mt-0.5 block text-sm leading-snug text-muted">{style.description}</span>
            </span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  );
}
