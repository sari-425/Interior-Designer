/**
 * Alle persönlichen und geschäftlichen Angaben für Impressum, Datenschutzerklärung,
 * AGB und Widerrufsbelehrung an EINER Stelle.
 *
 * So füllst du sie aus (siehe auch docs/rechtstexte-ausfuellen.md):
 * - Ersetze jeden Text in eckigen Klammern durch deine echte Angabe, OHNE die Klammern.
 * - Solange ein Wert noch mit „[“ beginnt, wird er auf der Website farbig markiert,
 *   damit nichts Unfertiges übersehen wird.
 * - Angaben, die es bei dir nicht gibt (z. B. Telefax), setzt du auf "" (leer). Leere Zeilen werden ausgeblendet.
 *
 * Diese Texte sind Entwürfe und keine Rechtsberatung. Vor dem Start bitte anwaltlich prüfen lassen.
 */

export const LEGAL_STAND = "[Datum der letzten Prüfung, z. B. 1. Dezember 2026]";

/** Wer betreibt DesignBySari? (Impressum, Verantwortlicher im Datenschutz, Vertragspartner in den AGB) */
export const BETREIBER = {
  /** Bei Einzelunternehmen: Vor- und Nachname (ggf. mit Zusatz „DesignBySari“). Bei GmbH/UG: Firma mit Rechtsform. */
  name: "[Vor- und Nachname bzw. Firma mit Rechtsform]",
  /** Nur bei GmbH/UG o. Ä.: vertretungsberechtigte Person(en), sonst "" */
  vertretenDurch: "[Nur bei GmbH/UG: Geschäftsführer/in, sonst leer lassen]",
  strasse: "[Straße und Hausnummer, keine Postfachadresse]",
  plzOrt: "[PLZ und Ort]",
  land: "Deutschland",
  email: "[E-Mail-Adresse, z. B. kontakt@deine-domain.de]",
  /** Pflicht ist ein zweiter schneller Kontaktweg, meist eine Telefonnummer */
  telefon: "[Telefonnummer]",
  /** Nur bei Eintrag im Handelsregister, sonst "" */
  register: "[Nur falls eingetragen: Registergericht und Registernummer, sonst leer lassen]",
  /** Umsatzsteuer-ID oder Wirtschafts-Identifikationsnummer, falls vorhanden, sonst "" */
  ustId: "[USt-IdNr. oder Wirtschafts-IdNr., falls vorhanden, sonst leer lassen]",
  /** true, falls du die Kleinunternehmerregelung (§ 19 UStG) nutzt. Dann wird keine Umsatzsteuer ausgewiesen. */
  kleinunternehmer: false,
  /** Person, die für redaktionelle Inhalte (z. B. Ratgeber-Artikel) verantwortlich ist, mit Anschrift */
  inhaltlichVerantwortlich: "[Vor- und Nachname, Anschrift wie oben]",
} as const;

/** Zuständige Datenschutz-Aufsichtsbehörde (richtet sich nach deinem Bundesland) */
export const AUFSICHTSBEHOERDE = "[Name und Anschrift der Datenschutz-Aufsichtsbehörde deines Bundeslandes]";

/** Dienste, die DesignBySari nutzt oder nutzen wird */
export const DIENSTE = {
  hosting: {
    name: "Vercel Inc.",
    anschrift: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
    datenschutz: "https://vercel.com/legal/privacy-policy",
    /** Grundlage für die Übermittlung in die USA */
    drittlandGrundlage:
      "[EU-US Data Privacy Framework – bitte prüfen, ob Vercel auf dataprivacyframework.gov gelistet ist, sonst EU-Standardvertragsklauseln]",
  },
  /** Noch nicht gewählt. Eintragen, sobald der Anbieter feststeht. */
  ki: {
    name: "[Name des KI-Anbieters]",
    anschrift: "[Anschrift des KI-Anbieters]",
    serverstandort: "[Serverstandort, z. B. EU oder USA]",
    /** Grundlage bei Übermittlung in ein Land außerhalb der EU, sonst "" */
    drittlandGrundlage: "[z. B. EU-US Data Privacy Framework oder EU-Standardvertragsklauseln, bei EU-Anbieter leer lassen]",
    datenschutz: "[Link zur Datenschutzerklärung des KI-Anbieters]",
  },
  /** Für Kundenkonten und Fotospeicher geplant (Supabase, Region Frankfurt) */
  datenbank: {
    name: "[Name des Anbieters für Konten und Fotospeicher, z. B. Supabase Inc.]",
    serverstandort: "[Serverstandort, z. B. Frankfurt am Main]",
  },
  /** Noch nicht gewählt. Eintragen, sobald der Zahlungsdienst feststeht. */
  zahlung: {
    name: "[Name des Zahlungsdienstes, z. B. Stripe Payments Europe, Ltd.]",
    anschrift: "[Anschrift des Zahlungsdienstes]",
    datenschutz: "[Link zur Datenschutzerklärung des Zahlungsdienstes]",
    zahlungsarten: "[angebotene Zahlungsarten, z. B. Kreditkarte, PayPal, Apple Pay]",
  },
} as const;

/** Wie lange werden Fotos und Ergebnisse gespeichert? */
export const SPEICHERFRISTEN = {
  /** Hochgeladene Originalfotos ohne Kundenkonto */
  fotosOhneKonto: "[z. B. 7 Tage]",
  /** Fotos und Designergebnisse in einem Kundenkonto, solange das Projekt besteht, längstens … */
  projekteMitKonto: "[z. B. 12 Monate nach der letzten Anmeldung]",
  /** Server-Logdateien beim Hosting-Anbieter */
  logdateien: "[Speicherdauer laut Vercel, z. B. 30 Tage – bitte prüfen]",
} as const;

/** Liegt ein Wert noch als Platzhalter vor? */
export function isPlaceholder(value: string): boolean {
  return value.trim().startsWith("[");
}

/**
 * Listet alle noch nicht ausgefüllten Angaben auf (z. B. „BETREIBER.name“).
 * Vor dem Start muss diese Liste leer sein.
 */
export function offenePlatzhalter(): string[] {
  const offen: string[] = [];
  const pruefe = (pfad: string, wert: unknown) => {
    if (typeof wert === "string") {
      if (isPlaceholder(wert)) offen.push(pfad);
    } else if (wert && typeof wert === "object") {
      for (const [key, inner] of Object.entries(wert)) pruefe(`${pfad}.${key}`, inner);
    }
  };
  pruefe("LEGAL_STAND", LEGAL_STAND);
  pruefe("BETREIBER", BETREIBER);
  pruefe("AUFSICHTSBEHOERDE", AUFSICHTSBEHOERDE);
  pruefe("DIENSTE", DIENSTE);
  pruefe("SPEICHERFRISTEN", SPEICHERFRISTEN);
  return offen;
}
