import type { SourcePhoto } from "@/modules/ai/types";
import type { LivingRoomRequest } from "@/modules/design-request/schema";

/**
 * Datenmodell eines gespeicherten Wohnzimmer-Projekts.
 * Entspricht der Tabelle `living_room_projects` in
 * supabase/migrations/20261108000000_living_room_projects.sql (noch nicht aktiv).
 */
export type ProjectStatus = "draft" | "submitted" | "generating" | "completed" | "failed";

export interface LivingRoomProject {
  id: string;
  ownerId: string;
  title: string;
  status: ProjectStatus;
  request: LivingRoomRequest;
  /** Nur gespeicherte Fotos (privater Bucket), nie Bilddaten im Datensatz */
  photo: Extract<SourcePhoto, { kind: "stored" }> | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Speicherzugriff auf Projekte. Die Supabase-Umsetzung folgt, sobald ein
 * Supabase-Projekt eingerichtet und freigegeben ist. Jede Methode arbeitet
 * ausschließlich mit Projekten der angemeldeten Person (Row Level Security).
 */
export interface ProjectRepository {
  create(request: LivingRoomRequest, title?: string): Promise<LivingRoomProject>;
  attachPhoto(projectId: string, photo: Extract<SourcePhoto, { kind: "stored" }>): Promise<LivingRoomProject>;
  get(projectId: string): Promise<LivingRoomProject | null>;
  listOwn(): Promise<LivingRoomProject[]>;
  rename(projectId: string, title: string): Promise<LivingRoomProject>;
  updateRequest(projectId: string, request: LivingRoomRequest): Promise<LivingRoomProject>;
  setStatus(projectId: string, status: ProjectStatus): Promise<LivingRoomProject>;
  /** Löscht Projekt und zugehörige Fotos endgültig (DSGVO: Recht auf Löschung) */
  delete(projectId: string): Promise<void>;
}

export const PROJECT_TITLE_MAX = 80;

/** Erlaubte Statuswechsel; alles andere ist ein Programmfehler */
export const STATUS_TRANSITIONS: Readonly<Record<ProjectStatus, readonly ProjectStatus[]>> = {
  draft: ["submitted"],
  submitted: ["generating", "failed"],
  generating: ["completed", "failed"],
  completed: ["submitted"],
  failed: ["submitted"],
};

export function canTransition(from: ProjectStatus, to: ProjectStatus): boolean {
  return STATUS_TRANSITIONS[from].includes(to);
}
