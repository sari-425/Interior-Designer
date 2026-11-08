"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { Button } from "@/components/ui/Button";
import {
  ACCEPT_ATTRIBUTE,
  formatBytes,
  MAX_IMAGE_BYTES,
  SIGNATURE_BYTES,
  validateImageDimensions,
  validateImageFile,
} from "@/lib/validation/image-upload";
import { preparedFileName, prepareRoomPhoto } from "@/lib/image/prepare-upload";
import type { RoomPhoto } from "./types";

interface PhotoStepProps {
  photo: RoomPhoto | null;
  onChange: (photo: RoomPhoto | null) => void;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Bild konnte nicht gelesen werden"));
    img.src = url;
  });
}

export function PhotoStep({ photo, onChange }: PhotoStepProps) {
  const inputId = useId();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const signature = new Uint8Array(await file.slice(0, SIGNATURE_BYTES).arrayBuffer());
      const fileCheck = validateImageFile(file, signature);
      if (!fileCheck.ok) {
        setError(fileCheck.error);
        return;
      }
      // Das Original wird nur kurz zum Lesen geöffnet und danach wieder freigegeben
      const originalUrl = URL.createObjectURL(file);
      let image: HTMLImageElement;
      try {
        image = await loadImage(originalUrl);
      } catch {
        URL.revokeObjectURL(originalUrl);
        setError("Das Bild konnte nicht gelesen werden. Bitte versuche ein anderes Foto.");
        return;
      }
      const original = { name: file.name, size: file.size, width: image.naturalWidth, height: image.naturalHeight };
      const dimCheck = validateImageDimensions(original.width, original.height);
      if (!dimCheck.ok) {
        URL.revokeObjectURL(originalUrl);
        setError(dimCheck.error);
        return;
      }
      let prepared: Awaited<ReturnType<typeof prepareRoomPhoto>>;
      try {
        // Verkleinern und Metadaten (EXIF, Standort) entfernen, alles lokal im Browser
        prepared = await prepareRoomPhoto(image);
      } catch {
        setError("Das Foto konnte nicht vorbereitet werden. Bitte versuche ein anderes Foto.");
        return;
      } finally {
        URL.revokeObjectURL(originalUrl);
      }
      const preparedCheck = validateImageDimensions(prepared.width, prepared.height);
      if (!preparedCheck.ok) {
        setError("Das Foto hat ein ungewöhnliches Seitenverhältnis. Bitte nutze ein normales Raumfoto im Quer- oder Hochformat.");
        return;
      }
      if (photo) URL.revokeObjectURL(photo.url);
      onChange({
        url: URL.createObjectURL(prepared.blob),
        name: preparedFileName(file.name),
        size: prepared.blob.size,
        width: prepared.width,
        height: prepared.height,
        original,
      });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    void handleFile(e.dataTransfer.files?.[0]);
  }

  function removePhoto() {
    if (photo) URL.revokeObjectURL(photo.url);
    onChange(null);
    setError(null);
  }

  return (
    <div>
      <h2 className="text-3xl">Lade ein Foto deines Wohnzimmers hoch</h2>
      <p className="mt-3 max-w-2xl text-muted">
        Am besten bei Tageslicht, aus einer Ecke fotografiert, sodass möglichst viel vom Wohnzimmer zu sehen ist.
      </p>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        aria-describedby={hintId}
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {photo ? (
        <div className="mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-sand">
            {/* Lokale Vorschau aus dem Browser-Speicher, daher kein next/image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt="Vorschau deines Wohnzimmerfotos" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="font-medium break-all">{photo.original.name}</p>
            <p className="mt-1 text-sm text-muted">
              {photo.width} × {photo.height} Pixel · {formatBytes(photo.size)}
            </p>
            <p className="mt-2 text-sm text-muted" data-testid="photo-prepared">
              {photo.width !== photo.original.width || photo.height !== photo.original.height
                ? `Verkleinert von ${photo.original.width} × ${photo.original.height}. `
                : ""}
              Metadaten wie Standort und Aufnahmegerät wurden entfernt. Es bleibt auf deinem Gerät und wird erst übertragen, wenn du ein Design anforderst.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <label htmlFor={inputId} className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-charcoal/25 px-5 hover:border-charcoal">
                Anderes Foto wählen
              </label>
              <Button variant="ghost" onClick={removePhoto}>
                Entfernen
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`mt-8 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-card)] border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragging ? "border-charcoal bg-sand/50" : "border-taupe/60 bg-paper hover:border-charcoal"
          }`}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7d6850" strokeWidth="1.4" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.6" />
            <path d="M21 16l-5-5-8 8" strokeLinejoin="round" />
          </svg>
          <span className="mt-4 text-lg font-medium">{busy ? "Foto wird geprüft …" : "Foto auswählen oder hierher ziehen"}</span>
          <span id={hintId} className="mt-2 text-sm text-muted">
            JPG, PNG oder WebP · bis {formatBytes(MAX_IMAGE_BYTES)} · mindestens 640 × 480 Pixel
          </span>
        </label>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-error/10 px-4 py-3 text-error">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-sand/40 p-5 text-[0.95rem] leading-relaxed">
          <p className="font-semibold">Dein Foto bleibt bei dir</p>
          <p className="mt-1 text-muted">
            In dieser Vorschauversion wird dein Foto nur in deinem Browser angezeigt. Es wird nicht hochgeladen und
            nicht gespeichert.
          </p>
        </div>
        <div className="rounded-2xl bg-sand/40 p-5 text-[0.95rem] leading-relaxed">
          <p className="font-semibold">So wird die KI arbeiten</p>
          <p className="mt-1 text-muted">
            Sobald die KI-Gestaltung bereit ist, entwirft sie eine neue Einrichtung auf Basis deines Fotos. Achte
            schon jetzt darauf, dass keine Personen oder privaten Dokumente zu sehen sind.
          </p>
        </div>
      </div>
    </div>
  );
}
