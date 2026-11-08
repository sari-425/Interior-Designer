import { describe, expect, it } from "vitest";
import { loginSchema, profileSchema, registrationSchema } from "@/modules/accounts/schema";
import { isAccountsEnabled } from "@/modules/accounts/types";
import type { LivingRoomRequest } from "@/modules/design-request/schema";
import { InMemoryProjectRepository, ProjectAccessError } from "@/modules/projects/in-memory-repository";
import { canTransition, type LivingRoomProject } from "@/modules/projects/types";

const request: LivingRoomRequest = {
  roomType: "wohnzimmer",
  roomSizeSqm: null,
  roomFeatures: [],
  style: "modern",
  colorWorld: "kuehl-hell",
  atmosphere: "ruhig",
  budgetEur: 800,
  keep: [],
  replace: [],
  keepSurfaces: [],
  changeSurfaces: [],
  requirements: [],
  notes: "",
  variants: 1,
};

describe("Konten: Prüfregeln", () => {
  const valid = { email: " Test@Example.de ", password: "sicher12345", passwordConfirm: "sicher12345", acceptTerms: true };

  it("akzeptiert eine gültige Registrierung und normalisiert die E-Mail", () => {
    const r = registrationSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("test@example.de");
  });

  it("lehnt schwache Passwörter, falsche Wiederholung und fehlende Zustimmung ab", () => {
    expect(registrationSchema.safeParse({ ...valid, password: "kurz1", passwordConfirm: "kurz1" }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...valid, password: "nurbuchstaben", passwordConfirm: "nurbuchstaben" }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...valid, passwordConfirm: "anders12345" }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...valid, acceptTerms: false }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...valid, email: "keine-mail" }).success).toBe(false);
  });

  it("prüft Anmeldung und Profil", () => {
    expect(loginSchema.safeParse({ email: "a@b.de", password: "" }).success).toBe(false);
    expect(profileSchema.safeParse({ displayName: "Sari", marketingOptIn: false }).success).toBe(true);
    expect(profileSchema.safeParse({ displayName: "S", marketingOptIn: false }).success).toBe(false);
  });

  it("ist ohne Supabase-Konfiguration deaktiviert", () => {
    expect(isAccountsEnabled({})).toBe(false);
    expect(isAccountsEnabled({ NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "k" })).toBe(true);
  });
});

describe("Projekte: Regeln der Projektverwaltung", () => {
  const store = new Map<string, LivingRoomProject>();
  let n = 0;
  const repo = (owner: string) => new InMemoryProjectRepository(owner, store, () => new Date(Date.UTC(2026, 10, 8, 10, n)), () => `p${++n}`);

  it("legt Projekte an, listet nur eigene und schützt fremde", async () => {
    const anna = repo("anna");
    const ben = repo("ben");
    const p = await anna.create(request, "  Unser   Wohnzimmer ");
    expect(p.title).toBe("Unser Wohnzimmer");
    expect(p.status).toBe("draft");
    expect(await anna.listOwn()).toHaveLength(1);
    expect(await ben.listOwn()).toHaveLength(0);
    expect(await ben.get(p.id)).toBeNull();
    await expect(ben.delete(p.id)).rejects.toBeInstanceOf(ProjectAccessError);
    await expect(ben.rename(p.id, "Fremd")).rejects.toBeInstanceOf(ProjectAccessError);
  });

  it("prüft Anfrage, Titel, Foto-Pfad und Statuswechsel", async () => {
    const anna = repo("anna");
    await expect(anna.create({ ...request, budgetEur: 1 })).rejects.toThrow();
    const p = await anna.create(request);
    await expect(anna.rename(p.id, "x".repeat(81))).rejects.toBeInstanceOf(RangeError);
    await expect(anna.attachPhoto(p.id, { kind: "stored", storagePath: "ben/p/original.jpg", mimeType: "image/jpeg", width: 800, height: 600 })).rejects.toBeInstanceOf(ProjectAccessError);
    expect((await anna.attachPhoto(p.id, { kind: "stored", storagePath: `anna/${p.id}/original.jpg`, mimeType: "image/jpeg", width: 800, height: 600 })).photo?.storagePath).toContain("anna/");
    await expect(anna.setStatus(p.id, "completed")).rejects.toBeInstanceOf(RangeError);
    await anna.setStatus(p.id, "submitted");
    await anna.setStatus(p.id, "generating");
    await expect(anna.updateRequest(p.id, request)).rejects.toThrow(/Während der Gestaltung/);
    expect(canTransition("generating", "completed")).toBe(true);
    expect(canTransition("draft", "completed")).toBe(false);
  });

  it("löscht eigene Projekte endgültig", async () => {
    const anna = repo("anna");
    const p = await anna.create(request);
    await anna.delete(p.id);
    expect(await anna.get(p.id)).toBeNull();
  });
});
