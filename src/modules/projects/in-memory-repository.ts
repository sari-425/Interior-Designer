import { livingRoomRequestSchema, type LivingRoomRequest } from "@/modules/design-request/schema";
import {
  canTransition,
  PROJECT_TITLE_MAX,
  type LivingRoomProject,
  type ProjectRepository,
  type ProjectStatus,
} from "./types";

export class ProjectAccessError extends Error {
  constructor(message = "Projekt nicht gefunden.") {
    super(message);
    this.name = "ProjectAccessError";
  }
}

/**
 * Referenz-Umsetzung von ProjectRepository im Arbeitsspeicher.
 * Dient als ausführbare Spezifikation (Tests) für die spätere Supabase-Umsetzung:
 * gleiche Regeln für Besitz, Prüfung, Statuswechsel und Löschen.
 * Nicht für den Livebetrieb gedacht (Daten gehen beim Neustart verloren).
 */
export class InMemoryProjectRepository implements ProjectRepository {
  /**
   * @param ownerId angemeldete Person
   * @param projects gemeinsamer Speicher (mehrere Instanzen simulieren mehrere Konten)
   */
  constructor(
    private readonly ownerId: string,
    private readonly projects = new Map<string, LivingRoomProject>(),
    private readonly now: () => Date = () => new Date(),
    private readonly newId: () => string = () => crypto.randomUUID(),
  ) {}

  private own(projectId: string): LivingRoomProject {
    const p = this.projects.get(projectId);
    // Fremde Projekte verhalten sich wie nicht vorhandene (kein Hinweis auf Existenz)
    if (!p || p.ownerId !== this.ownerId) throw new ProjectAccessError();
    return p;
  }

  private save(p: LivingRoomProject, patch: Partial<LivingRoomProject>): LivingRoomProject {
    const next = { ...p, ...patch, updatedAt: this.now().toISOString() };
    this.projects.set(p.id, next);
    return next;
  }

  private static title(title: string): string {
    const t = title.trim().replace(/\s+/g, " ");
    if (!t || t.length > PROJECT_TITLE_MAX) throw new RangeError(`Titel muss 1 bis ${PROJECT_TITLE_MAX} Zeichen haben.`);
    return t;
  }

  async create(request: LivingRoomRequest, title = "Mein Wohnzimmer"): Promise<LivingRoomProject> {
    const valid = livingRoomRequestSchema.parse(request);
    const at = this.now().toISOString();
    const project: LivingRoomProject = {
      id: this.newId(),
      ownerId: this.ownerId,
      title: InMemoryProjectRepository.title(title),
      status: "draft",
      request: valid,
      photo: null,
      createdAt: at,
      updatedAt: at,
    };
    this.projects.set(project.id, project);
    return project;
  }

  async attachPhoto(projectId: string, photo: NonNullable<LivingRoomProject["photo"]>) {
    const p = this.own(projectId);
    if (!photo.storagePath.startsWith(`${this.ownerId}/`)) throw new ProjectAccessError("Foto gehört nicht zu diesem Konto.");
    return this.save(p, { photo });
  }

  async get(projectId: string) {
    try {
      return this.own(projectId);
    } catch {
      return null;
    }
  }

  async listOwn() {
    return [...this.projects.values()]
      .filter((p) => p.ownerId === this.ownerId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async rename(projectId: string, title: string) {
    return this.save(this.own(projectId), { title: InMemoryProjectRepository.title(title) });
  }

  async updateRequest(projectId: string, request: LivingRoomRequest) {
    const p = this.own(projectId);
    if (p.status === "generating") throw new RangeError("Während der Gestaltung kann das Projekt nicht geändert werden.");
    return this.save(p, { request: livingRoomRequestSchema.parse(request), status: "draft" });
  }

  async setStatus(projectId: string, status: ProjectStatus) {
    const p = this.own(projectId);
    if (!canTransition(p.status, status)) throw new RangeError(`Statuswechsel ${p.status} → ${status} ist nicht erlaubt.`);
    return this.save(p, { status });
  }

  async delete(projectId: string) {
    this.own(projectId);
    this.projects.delete(projectId);
  }
}
