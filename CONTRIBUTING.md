# Contributing to Open HR

## Setup

```bash
# Clone the repo
git clone https://github.com/your-org/open-hr.git
cd open-hr-app

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Fill in your values in .env

# Start development server
pnpm dev
```

## Environment Variables

See `.env.example` for all required variables. You need at minimum:
- `MONGO_URI` — MongoDB connection string
- `NEXT_AUTH_SECRET` — random secret for NextAuth
- `JWT_SECRET` — random secret for JWT tokens

## Project Structure

```
src/
├── app/                  # Next.js App Router pages and API routes
│   ├── (auth)/           # Login, forgot-password pages
│   ├── (protected)/      # All authenticated pages
│   └── api/              # API route handlers
├── components/           # Shared UI components
│   ├── ui/               # shadcn/ui primitives
│   └── common/           # App-specific shared components
├── features/             # Feature modules (client-side)
│   └── [feature]/
│       ├── api.ts        # React query hooks
│       └── types.ts      # Feature-specific types (if any)
├── server/               # Server-only code (never imported by client)
│   ├── auth/             # API auth helpers
│   ├── db/               # Database connection
│   ├── models/           # Mongoose models
│   ├── services/         # Business logic
│   ├── mail/             # Email utilities
│   └── storage/          # S3/file storage
├── lib/                  # Shared client utilities
├── hooks/                # Shared React hooks
├── types/                # Shared TypeScript types
└── config/               # App configuration
```

## Conventions

- **API routes**: Each endpoint lives in its own `route.ts` file under `src/app/api/`
- **Server code**: Anything in `src/server/` is server-only — never import from client components
- **Feature modules**: Client-side hooks and types only — no server imports
- **Types**: Shared domain types live in `src/types/`. Feature-specific types live next to the feature
- **Path aliases**: Use `@/server/*` for server code, `@/lib/*` for client utilities, `@/features/*` for feature modules

## Pull Request Guidelines

1. Keep PRs focused — one feature or fix per PR
2. Run `pnpm lint` before submitting
3. Run `pnpm build` to verify no build errors
4. Update `.env.example` if you add new environment variables
5. Keep server and client code strictly separated

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
pnpm format   # Run Prettier
```
