# EduPulse

EduPulse helps faculty track students, attendance, and academic performance in one responsive workspace.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — managed PostgreSQL connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (the managed database available in this workspace)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/edupulse/src/pages` — login, dashboard, students, attendance, and performance pages
- `artifacts/edupulse/src/components/edupulse.tsx` — shared shell, modals, forms, and reusable display components
- `artifacts/api-server/src/routes/edupulse.ts` — REST CRUD and dashboard endpoints
- `lib/db/src/schema/index.ts` — source-of-truth database tables
- `lib/api-spec/openapi.yaml` — source-of-truth API contract

## Architecture decisions

- The product intentionally has one faculty user flow and exactly five main pages to keep the PBL demo easy to explain.
- Dashboard values are derived from attendance and performance rows rather than stored summary values.
- Attendance and performance reference students with database cascade deletes, preventing broken detail views.

## Product

- Faculty can manage students, attendance, and performance records, then review calculated academic summaries.

## User preferences

- Keep the scope student-friendly and viva-ready; do not add enterprise modules or extra roles.

## Gotchas

- After editing the OpenAPI contract, run `pnpm --filter @workspace/api-spec run codegen`.
- After schema changes, run `pnpm --filter @workspace/db run push`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
