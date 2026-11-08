import type { SourcePhoto } from "@/modules/ai/image-provider";
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
  status: ProjectStatus;
  request: LivingRoomRequest;
  photo: SourcePhoto | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Speicherzugriff auf Projekte. Die Supabase-Umsetzung folgt, sobald ein
 * Supabase-Projekt eingerichtet und freigegeben ist. Jede Methode arbeitet
 * ausschließlich mit Projekten der angemeldeten Person (Row Level Security).
 */
export interface ProjectRepository {
  create(request: LivingRoomRequest): Promise<LivingRoomProject>;
  attachPhoto(projectId: string, photo: SourcePhoto): Promise<LivingRoomProject>;
  get(projectId: string): Promise<LivingRoomProject | null>;
  listOwn(): Promise<LivingRoomProject[]>;
  /** Löscht Projekt und zugehörige Fotos endgültig (DSGVO: Recht auf Löschung) */
  delete(projectId: string): Promise<void>;
}
