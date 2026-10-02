# Set Relations Lab

An interactive Discrete Mathematical Structures lesson on relations between distinct sets and their connection to relational databases.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/set-relations-lab/` — student-facing lesson and interactive relation builder.
- `artifacts/set-relations-lab/src/App.tsx` — lesson content and local interaction state.
- `artifacts/set-relations-lab/src/index.css` — app theme and responsive presentation.

## Architecture decisions

- Pair selection is local state; this lesson does not require accounts, a database, or API calls.
- The relation builder models a subset of `A × B` for distinct sets and tests whether it is a function; it does not apply endorelation-only properties to cross-set relations.
- The SQL example is instructional: a composite key on the junction-table pair preserves the unique-pair semantics of a mathematical relation.

## Product

Students learn Cartesian products, ordered pairs, relations, domain and range through definitions, a worked example, a live pair-building activity, a relational SQL example, and checkable exercises.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
