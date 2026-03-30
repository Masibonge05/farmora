# Farmora

Farmora is now structured as a Next.js 16 application with a layered architecture so the same codebase can serve the UI, route handlers, and backend-facing application logic.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript in strict mode
- Recharts for dashboard visualisation
- Zod for request validation
- ESLint with Next core web vitals

## Architecture

The app is intentionally split by responsibility:

- `src/app`
  Next.js routes, layouts, metadata, and API handlers.
- `src/core/domain`
  Stable business types and domain contracts.
- `src/core/application`
  Use cases that coordinate work through interfaces.
- `src/core/ports`
  Repository abstractions used by the application layer.
- `src/core/infrastructure`
  Concrete adapters and the composition root.
- `src/features`
  Presentation modules grouped by product area such as `auth` and `dashboard`.
- `src/shared`
  Reusable UI primitives, config, and small helpers.
- `legacy/vite-src`
  Archived pre-migration Vite files kept for reference during the transition.

## Route Design

- `/`
  Login screen
- `/onboarding`
  Guided onboarding flow
- `/dashboard/[section]`
  Route-driven dashboard sections
- `/api/dashboard`
  Full dashboard snapshot
- `/api/dashboard/[section]`
  Section-scoped backend payload

## How Data Flows

1. App routes or API handlers call the application layer.
2. Use cases depend on repository interfaces, not concrete data sources.
3. Infrastructure provides the current in-memory repository implementation.
4. Feature components receive typed data and stay focused on rendering and interaction.

That means the in-memory adapter can later be replaced by a database, external API, or real service layer without rewriting the UI.

## Development

```bash
npm install
npm run dev
```

Useful scripts:

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run start`

## Environment

Create a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=<your supabase project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your supabase anon key>
GOOGLE_PLACES_API_KEY=<optional, for address autocomplete>
```

## Notes

- The current backend is intentionally modelled as an in-memory adapter to prove the architecture before wiring real persistence.
- The legacy Vite source was moved out of Next route conventions so it no longer appears as active pages.
