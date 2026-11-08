import { RoomIllustration } from "@/components/illustrations/RoomIllustration";
import type { DesignStyle } from "@/modules/styles/styles";

export function StyleCard({ style, showTraits = false }: { style: DesignStyle; showTraits?: boolean }) {
  return (
    <article className="group">
      <div className="overflow-hidden rounded-[var(--radius-card)] bg-sand">
        <div className="aspect-[4/3] transition-transform duration-500 group-hover:scale-[1.02]">
          <RoomIllustration palette={style.palette} label={`Illustration: Wohnzimmer im Stil ${style.name}`} className="h-full" />
        </div>
      </div>
      <h3 className="mt-4 text-xl">{style.name}</h3>
      <p className="mt-1.5 leading-relaxed text-muted">{style.description}</p>
      {showTraits && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {style.traits.map((t) => (
            <li key={t} className="rounded-full border border-line bg-paper px-3 py-1 text-sm">
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
