import type { ProfileInput } from "./schema";

/**
 * Konten und Profile. Umsetzung folgt mit Supabase Auth, sobald ein
 * Supabase-Projekt (Region Frankfurt) eingerichtet und freigegeben ist.
 */

export interface SessionUser {
  id: string;
  email: string | null;
  /** Gastkonto über anonyme Anmeldung, kann später in ein volles Konto umgewandelt werden */
  isAnonymous: boolean;
}

export interface Profile extends ProfileInput {
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type AuthResult = { ok: true; user: SessionUser } | { ok: false; message: string };

export interface AuthService {
  signUp(email: string, password: string): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
  getUser(): Promise<SessionUser | null>;
  /** Passwort-Zurücksetzen per E-Mail-Link */
  requestPasswordReset(email: string): Promise<void>;
  /** Löscht Konto, Profil, alle Projekte und Fotos endgültig (DSGVO Art. 17) */
  deleteAccount(): Promise<void>;
}

export interface ProfileRepository {
  getOwn(): Promise<Profile | null>;
  updateOwn(input: ProfileInput): Promise<Profile>;
}

type Env = Readonly<Record<string, string | undefined>>;

/** Konten sind erst aktiv, wenn Supabase konfiguriert ist (und das SDK installiert wurde). */
export function isAccountsEnabled(env: Env = process.env): boolean {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL?.trim() && env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
}
