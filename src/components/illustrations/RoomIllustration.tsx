import type { DesignStyle } from "@/modules/styles/styles";

interface RoomIllustrationProps {
  /** Farben des Stils; ohne Angabe wird der unrenovierte Ausgangsraum gezeigt */
  palette?: DesignStyle["palette"];
  label: string;
  className?: string;
}

const BEFORE = {
  wall: "#dcd8d1",
  floor: "#a9a39a",
  sofa: "#8f8b84",
  accent: "#77736c",
  rug: "#c7c2b9",
};

/**
 * Gezeichnete Raum-Illustration in Zentralperspektive.
 * Dient als ehrlich gekennzeichneter Platzhalter, bis lizenzierte
 * Fotos bzw. echte KI-Ergebnisse vorliegen.
 */
export function RoomIllustration({ palette, label, className = "" }: RoomIllustrationProps) {
  const styled = Boolean(palette);
  const c = palette ?? BEFORE;

  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label={label}
      className={`block h-auto w-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Raumschale */}
      <polygon points="0,0 400,0 330,32 70,32" fill={c.wall} style={{ filter: "brightness(1.04)" }} />
      <polygon points="0,0 70,32 70,192 0,300" fill={c.wall} style={{ filter: "brightness(0.93)" }} />
      <polygon points="400,0 330,32 330,192 400,300" fill={c.wall} style={{ filter: "brightness(0.96)" }} />
      <rect x="70" y="32" width="260" height="160" fill={c.wall} />
      <polygon points="70,192 330,192 400,300 0,300" fill={c.floor} />
      {/* Dielen andeuten */}
      <g stroke="#000" strokeOpacity="0.06" strokeWidth="1">
        <line x1="135" y1="192" x2="100" y2="300" />
        <line x1="200" y1="192" x2="200" y2="300" />
        <line x1="265" y1="192" x2="300" y2="300" />
      </g>

      {/* Fenster (bleibt in beiden Ansichten unverändert) */}
      <rect x="214" y="54" width="82" height="92" rx="2" fill="#f7f5f0" stroke={c.accent} strokeOpacity="0.35" strokeWidth="3" />
      <line x1="255" y1="54" x2="255" y2="146" stroke={c.accent} strokeOpacity="0.35" strokeWidth="2" />
      <line x1="214" y1="100" x2="296" y2="100" stroke={c.accent} strokeOpacity="0.35" strokeWidth="2" />
      <rect x="214" y="54" width="82" height="92" fill="#fffdf8" opacity="0.35" />

      {styled && (
        <>
          {/* Vorhang */}
          <rect x="300" y="48" width="14" height="112" rx="3" fill={c.rug} opacity="0.95" />
          {/* Bild an der Wand */}
          <rect x="104" y="62" width="62" height="44" rx="1" fill="#fbf9f5" stroke={c.accent} strokeWidth="2.5" />
          <path d="M110 100 L128 82 L140 94 L150 86 L160 100 Z" fill={c.rug} />
          <circle cx="150" cy="76" r="5" fill={c.sofa} opacity="0.7" />
          {/* Teppich */}
          <ellipse cx="180" cy="246" rx="122" ry="26" fill={c.rug} />
        </>
      )}

      {/* Sofa */}
      <rect x="92" y="138" width="150" height="34" rx="10" fill={c.sofa} />
      <rect x="86" y="160" width="162" height="40" rx="10" fill={c.sofa} style={{ filter: "brightness(1.07)" }} />
      <rect x="84" y="150" width="18" height="52" rx="8" fill={c.sofa} style={{ filter: "brightness(0.92)" }} />
      <rect x="232" y="150" width="18" height="52" rx="8" fill={c.sofa} style={{ filter: "brightness(0.92)" }} />
      <rect x="96" y="200" width="4" height="10" fill={c.accent} />
      <rect x="234" y="200" width="4" height="10" fill={c.accent} />
      {styled && (
        <>
          <rect x="108" y="146" width="30" height="22" rx="6" fill={c.rug} transform="rotate(-6 123 157)" />
          <rect x="196" y="146" width="30" height="22" rx="6" fill={c.accent} opacity="0.85" transform="rotate(5 211 157)" />
        </>
      )}

      {/* Couchtisch */}
      {styled ? (
        <>
          <ellipse cx="180" cy="232" rx="44" ry="9" fill={c.accent} />
          <rect x="176" y="232" width="8" height="16" fill={c.accent} />
          <rect x="164" y="222" width="10" height="8" rx="2" fill="#fbf9f5" />
        </>
      ) : (
        <>
          <rect x="146" y="222" width="70" height="8" fill={c.accent} />
          <rect x="150" y="230" width="4" height="16" fill={c.accent} />
          <rect x="208" y="230" width="4" height="16" fill={c.accent} />
        </>
      )}

      {/* Stehleuchte */}
      {styled && (
        <g>
          <line x1="300" y1="118" x2="300" y2="232" stroke={c.accent} strokeWidth="3" />
          <ellipse cx="300" cy="234" rx="12" ry="3" fill={c.accent} />
          <path d="M284 118 L316 118 L308 98 L292 98 Z" fill={c.rug} />
        </g>
      )}

      {/* Pflanze */}
      {styled && (
        <g>
          <path d="M340 252 L366 252 L362 284 L344 284 Z" fill={c.accent} />
          <g fill="#6f7a5f">
            <ellipse cx="346" cy="232" rx="9" ry="20" transform="rotate(-24 346 232)" />
            <ellipse cx="362" cy="228" rx="9" ry="22" transform="rotate(20 362 228)" />
            <ellipse cx="354" cy="222" rx="8" ry="24" />
          </g>
        </g>
      )}

      {/* Leichter Lichteinfall */}
      <polygon points="214,146 296,146 330,250 180,250" fill="#fffdf6" opacity={styled ? 0.16 : 0.08} />
    </svg>
  );
}
