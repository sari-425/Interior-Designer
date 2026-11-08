# 0001 – Technischer Stack für Phase 1

Datum: 2026-11-08 · Status: angenommen

## Entscheidung

- Next.js 16.4.5 mit App Router, `cacheComponents` und `partialPrefetching` (Standard von `create-next-app` 16.4.5)
- React 19.3, Tailwind CSS 4, Zod 4
- TypeScript **6.0.3**
- Vitest 5 und Playwright 1.65
- Node.js ≥ 24

## Begründung TypeScript 6 statt 7

TypeScript 7.0.2 ist die neueste Version (Juli 2026). Test am 2026-11-08 in einer Kopie des Projekts:

- `next build` läuft erfolgreich.
- `npm run lint` bricht ab, weil `eslint-config-next` über `typescript-eslint` die alte Compiler-Schnittstelle lädt.

Wir bleiben bei TypeScript 6.0 und prüfen erneut, sobald `typescript-eslint` TypeScript 7 unterstützt.

## Bekannte Hinweise

- `npm audit` meldet 8 Schwachstellen mit mittlerem Schweregrad in `minimatch`, eingebunden über `typescript-eslint`/`eslint-config-next`. Betroffen sind nur Entwicklungswerkzeuge, nicht die ausgelieferte App. `npm audit fix --force` würde `eslint-config-next` auf Version 15 zurückstufen und wird deshalb nicht ausgeführt.
  - Details (geprüft 2026-11-08): Hinweis GHSA-g3hv-75wg-m249, Denial of Service durch sehr aufwendige Glob-Muster (CWE-405), betroffen `minimatch` 7.0.0 bis unter 11.0.1. Kette: `eslint-config-next@16.4.5` → `typescript-eslint@8.72.1` → `@typescript-eslint/typescript-estree@8.72.1` → `minimatch@10.2.6`. Die Muster stammen ausschließlich aus unserer eigenen Konfiguration, `npm ls minimatch --omit=dev` ist leer und der Produktions-Build enthält kein `minimatch`.
  - Bewertung: Für Nutzerinnen, Nutzer und den Betrieb praktisch kein Risiko. Vorgehen: auf ein Update von `typescript-eslint` warten; ein `overrides`-Eintrag in `package.json` wäre möglich, aber nur nach Freigabe.
- Schriften (Manrope, Fraunces) werden über `next/font` beim Build lokal eingebunden. Besucher laden nichts von Google-Servern.
