import { z } from "zod";

/**
 * Prüfregeln für Konten. Werden später im Browser (Formulare) und auf dem
 * Server identisch verwendet. Die eigentliche Anmeldung übernimmt Supabase Auth.
 */

export const PASSWORD_MIN = 10;
/** Viele Hash-Verfahren werten nur die ersten 72 Bytes aus */
export const PASSWORD_MAX = 72;

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Die E-Mail-Adresse ist zu lang.")
  .pipe(z.email("Bitte gib eine gültige E-Mail-Adresse ein."));

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `Das Passwort muss mindestens ${PASSWORD_MIN} Zeichen lang sein.`)
  .max(PASSWORD_MAX, `Das Passwort darf höchstens ${PASSWORD_MAX} Zeichen lang sein.`)
  .refine((p) => /[A-Za-zÄÖÜäöüß]/.test(p) && /\d/.test(p), "Das Passwort braucht mindestens einen Buchstaben und eine Zahl.");

export const registrationSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    acceptTerms: z.literal(true, { error: "Bitte stimme den Nutzungsbedingungen zu." }),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Die Passwörter stimmen nicht überein.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Bitte gib dein Passwort ein.").max(PASSWORD_MAX),
});

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Bitte gib mindestens 2 Zeichen ein.")
    .max(50, "Bitte höchstens 50 Zeichen.")
    .nullable(),
  /** Werbe-E-Mails nur nach ausdrücklicher Einwilligung (Standard: aus) */
  marketingOptIn: z.boolean(),
});

export type Registration = z.infer<typeof registrationSchema>;
export type Login = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
