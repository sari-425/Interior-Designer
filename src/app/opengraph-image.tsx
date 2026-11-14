import { ImageResponse } from "next/og";
import { SITE_CLAIM } from "@/lib/site";

export const alt = "DesignBySari – Dein Zuhause. Dein Budget. Dein Design.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Vorschaubild beim Teilen von Links (ohne Fotos, nur Marke und Claim) */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "#f2ede5",
          color: "#35352f",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 88 }}>
          Design<span style={{ color: "#7d6850", fontStyle: "italic" }}>By</span>Sari
        </div>
        <div style={{ marginTop: 28, fontSize: 44, color: "#5a5a51" }}>{SITE_CLAIM}</div>
        <div style={{ marginTop: 56, height: 10, width: 320, background: "#a58d71", borderRadius: 5 }} />
      </div>
    ),
    size,
  );
}
