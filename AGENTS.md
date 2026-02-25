# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a **pnpm monorepo** for `gen-query-key` — Vite plugins and React components for auto-generating type-safe `queryKey` definitions for TanStack React Query. No backend, database, or Docker required.

### Workspaces

| Path                                | Package                           | Description                   |
| ----------------------------------- | --------------------------------- | ----------------------------- |
| `packages/common`                   | `@query-key-gen/generator-common` | Shared utilities (private)    |
| `packages/query-key-generator`      | `@query-key-gen/generator`        | Core Vite plugin              |
| `packages/query-key-used-generator` | `@query-key-gen/used-generator`   | Usage tracking Vite plugin    |
| `packages/query-key-used-viewer`    | `@query-key-gen/used-viewer`      | React UI viewer component     |
| `explorer`                          | `explorer`                        | Demo/playground app (private) |

### Key commands

- **Install deps:** `pnpm install` (root)
- **Build all packages:** `pnpm packages:build` — must run before explorer dev server since `explorer/vite.config.ts` imports from `packages/query-key-generator/lib/`
- **Lint:** `pnpm lint` (runs ESLint across monorepo)
- **Format:** `pnpm format` (Prettier)
- **Test:** `pnpm generator test -- --run` (vitest, only `query-key-generator` has tests)
- **Explorer dev server:** `pnpm explorer dev` (Vite dev server at `localhost:5173`)

### Gotchas

- The `pnpm.onlyBuiltDependencies` field in root `package.json` must include `esbuild` to avoid the interactive `pnpm approve-builds` prompt.
- `eslint`, `@eslint/js`, and `typescript-eslint` must be installed as root devDependencies for `pnpm lint` to work (the flat config in `eslint.config.js` imports them).
- Pre-existing lint error in `packages/query-key-used-viewer/vite.config.ts` (`globbySync` unused import) — this is in the existing codebase, not introduced by setup.
- The explorer app imports built artifacts from `../packages/query-key-generator/lib/index`, so `pnpm packages:build` must succeed before running `pnpm explorer dev`.
