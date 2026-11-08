"use client";

import { useId, useState } from "react";
import { RoomIllustration } from "@/components/illustrations/RoomIllustration";
import { DemoBadge } from "@/components/ui/Badge";
import { getDesignStyle, type DesignStyleId } from "@/modules/styles/styles";

interface BeforeAfterProps {
  styleId: DesignStyleId;
  className?: string;
  /** Text der Kennzeichnung oben links */
  badgeLabel?: string;
}

/**
 * Vorher/Nachher-Vergleich mit Schieberegler.
 * Bedienbar per Maus, Touch und Tastatur (Pfeiltasten).
 */
export function BeforeAfter({ styleId, className = "", badgeLabel = "Beispiel · Illustration" }: BeforeAfterProps) {
  const [position, setPosition] = useState(50);
  const id = useId();
  const style = getDesignStyle(styleId);

  return (
    <figure className={`relative overflow-hidden rounded-[var(--radius-card)] bg-sand ${className}`}>
      <div className="relative aspect-[4/3] w-full">
        <div className="absolute inset-0">
          <RoomIllustration palette={style.palette} label={`Nachher: Raum im Stil ${style.name}`} className="h-full" />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} aria-hidden="true">
          <RoomIllustration label="Vorher: Raum im Ausgangszustand" className="h-full" />
        </div>

        {/* Trennlinie mit Griff */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${position}%` }} aria-hidden="true">
          <div className="absolute inset-y-0 -ml-px w-0.5 bg-cream" />
          <div className="absolute top-1/2 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#35352f" strokeWidth="1.8">
              <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <label htmlFor={id} className="sr-only">
          Vorher-Nachher-Vergleich verschieben
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-valuetext={`${position} Prozent Vorher-Ansicht`}
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
        />

        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold">
          Vorher
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold">
          Nachher · {style.name}
        </span>
        <DemoBadge label={badgeLabel} className="pointer-events-none absolute left-3 top-3" />
      </div>
    </figure>
  );
}
