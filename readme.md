# Open HR Solution

A full-stack HR application built with Next.js App Router. This repository now contains both UI and server-side business logic in one deployable app.

## What This App Handles

- Employee lifecycle and onboarding
- Role-aware dashboards
- Leave and leave-request workflows
- Payroll and asset management
- Course and tool management
- Settings and module configuration

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- MongoDB + Mongoose
- NextAuth (Google OAuth)
- Tailwind CSS + shadcn/ui

## Architecture (Unified Full-Stack)

The project is organized by responsibility and runtime boundary:

```text
src/
  app/                    # Next.js routes, layouts, pages, route handlers
  components/             # Shared UI and layout components
  features/               # Domain-oriented UI/feature modules
  hooks/                  # Reusable React hooks
  server/                 # Server domain layer
    models/               # Mongoose models (data contracts)
    services/             # Business logic and use-cases
  platform/               # Runtime adapters (auth, db, network)
  lib/                    # Shared utilities and cross-cutting helpers
  types/                  # Shared TypeScript types
  constants/, enums/      # Shared static values
```

### Layering Rules

- `app` can depend on `features`, `components`, `hooks`, `server`, `platform`, `lib`.
- `server/services` can depend on `server/models`, `platform`, `lib`, `types`.
- `server/models` should only define schemas/models and minimal model-level utilities.
- Keep React UI concerns out of `server/*`.
- Keep database mutation logic out of UI components.

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- MongoDB (local or Atlas)

### Install

```bash
pnpm install
```

### Environment

Create your local env file:

```bash
cp .env.example .env
```

Fill required values:

- `NEXTAUTH_URL`
- `NEXT_AUTH_SECRET`
- `APP_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Optional integrations:

- DigitalOcean Spaces (`DOS_*`, `NEXT_PUBLIC_BUCKET_URL`)
- Email (`SENDER_EMAIL`, `EMAIL_PASSWORD`)
- Discord webhook (`DISCORD_WEBHOOK_URL`)

## Run The App

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

## Build And Start

```bash
pnpm build
pnpm start
```

## Lint

```bash
pnpm lint
```

## Database Setup Notes

This app performs transactional operations for some workflows. For local development, use either:

1. MongoDB configured as a replica set.
2. MongoDB Atlas connection string.

If you hit transaction errors, confirm your MongoDB deployment supports transactions.

## Seed / Example Data

Example JSON files are available in `example-data/`:

- `example-data/employee.json`
- `example-data/settings.json`

Import these into your MongoDB database collections to bootstrap local testing.

## Migration Note (From Split FE/BE)

This repository used to be documented as separate frontend and backend projects. It is now a single full-stack application where:

- Route handlers live in `src/app/api/*`.
- Domain logic lives in `src/server/services/*`.
- Data models live in `src/server/models/*`.

When adding new backend logic, place it under `src/server/*` and call it from route handlers or server actions.

## Deployment

Deploy as a single Next.js application (for example on Vercel) with all required environment variables configured.

For production:

- Use managed MongoDB (Atlas recommended)
- Use strong secrets for auth/JWT
- Restrict OAuth callback URLs to your production domain
- Configure storage/email/webhook credentials only when needed

## License

MIT
