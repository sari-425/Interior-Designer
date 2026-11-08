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
- Schriften (Manrope, Fraunces) werden über `next/font` beim Build lokal eingebunden. Besucher laden nichts von Google-Servern.
