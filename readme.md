# Open HR Solution

A full-stack HR application built with Next.js App Router. UI and server-side business logic live in one deployable app.

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
- NextAuth v5 (Credentials + Google OAuth)
- Tailwind CSS v4 + shadcn/ui
- AWS S3-compatible storage (DigitalOcean Spaces)

## Architecture

```text
src/
  app/                    # Next.js routes, layouts, pages
    api/                  # REST API route handlers
      [module]/           # Generic CRUD for 15 domain modules
      employee/           # Employee-specific routes
      authentication/     # Auth routes (OTP, password reset)
      setting/            # App settings routes
      bucket/             # File upload/download routes
  components/             # Shared UI and layout components
    ui/                   # shadcn/ui primitives
    common/               # App-specific shared components
  features/               # Client-side feature modules
    [feature]/
      api.ts              # React query hooks
      types.ts            # Feature-specific types (if any)
  server/                 # Server-only code (never import from client)
    auth/                 # API auth helpers (withApiAuth, JWT)
    db/                   # Database connection (Mongoose)
    models/               # Mongoose schemas and models
    services/             # Business logic and use-cases
    mail/                 # Email utilities (Nodemailer)
    storage/              # S3 client
    utils/                # Server utilities (api-response)
  lib/                    # Shared client utilities
    api-client.ts         # Axios-based React hooks factory
    axios.ts              # Axios instance with auth interceptor
    client-api.ts         # fetch-based API client
  hooks/                  # Reusable React hooks
  types/                  # Shared TypeScript types
  config/                 # App configuration and env variables
  constants/, enums/      # Shared static values
  proxy.ts                # Route protection (Next.js 16)
  auth.ts                 # NextAuth configuration
```

### Layering Rules

- `app/` can depend on `features/`, `components/`, `hooks/`, `server/`, `lib/`.
- `server/services/` can depend on `server/models/`, `lib/`, `types/`.
- `server/models/` defines schemas only.
- `lib/` and `types/` must not import from `features/` or `server/`.
- Never import `server/` code from client components or feature modules.

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 11+
- MongoDB (local or Atlas)

### Install

```bash
pnpm install
```

### Environment

```bash
cp .env.example .env
```

Required variables:

- `NEXTAUTH_URL` — full app URL (e.g. `http://localhost:3000/`)
- `NEXTAUTH_SECRET` — random secret for NextAuth
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — random secret for JWT tokens
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Google OAuth credentials

Optional integrations:

- DigitalOcean Spaces (`DOS_*`, `NEXT_PUBLIC_BUCKET_URL`) — file uploads
- Email (`SENDER_EMAIL`, `EMAIL_PASSWORD`) — password reset emails
- Discord webhook (`DISCORD_WEBHOOK_URL`) — notifications

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

## Database Setup

For local development use either:

1. MongoDB configured as a replica set (required for transactions).
2. MongoDB Atlas connection string.

If you hit transaction errors, confirm your MongoDB deployment supports transactions.

## Seed / Example Data

Example JSON files are in `example-data/`:

- `example-data/employee.json`
- `example-data/settings.json`

Import into your MongoDB collections to bootstrap local testing.

## Migration Note (From Split FE/BE)

This repository was previously split into separate frontend and backend projects. It is now a single full-stack application:

- API route handlers live in `src/app/api/`.
- Business logic lives in `src/server/services/`.
- Data models live in `src/server/models/`.

## Deployment

Deploy as a single Next.js application (Vercel recommended) with all required environment variables configured.

For production:

- Use managed MongoDB (Atlas recommended)
- Use strong random secrets for `NEXTAUTH_SECRET` and `JWT_SECRET`
- Restrict OAuth callback URLs to your production domain
- Configure storage/email/webhook credentials only when needed

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
