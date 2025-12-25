# Full Stack TypeScript Starter

Modern full-stack monorepo with Bun, React, Elysia, and Drizzle ORM. Type-safe from database to frontend.

## Stack

- **Runtime:** Bun
- **Frontend:** React 19 + Vite + TanStack Router + Tailwind CSS 4
- **Backend:** Elysia + TypeScript
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (Google OAuth)
- **Type-safety:** Eden Treaty for end-to-end type safety

## Quick Start

1. **Install dependencies**
   ```bash
   bun install
   ```

2. **Setup environment variables**
   ```bash
   # Backend
   cp packages/backend/.env.example packages/backend/.env
   # Frontend
   cp packages/web/.env.example packages/web/.env
   ```

3. **Configure environment variables**
   - Get Google OAuth credentials at https://console.cloud.google.com
   - Generate auth secret: `openssl rand -base64 32`
   - Setup PostgreSQL database

4. **Start database** (using justfile)
   ```bash
   just postgres-up
   ```

5. **Run migrations**
   ```bash
   cd packages/backend
   bunx drizzle-kit push
   ```

6. **Start development servers**
   ```bash
   # From root
   just dev

   # Or manually
   cd packages/backend && bun run dev
   cd packages/web && bun run dev
   ```

## Project Structure

```
├── packages/
│   ├── backend/          # Elysia API
│   │   ├── src/
│   │   │   ├── controllers/   # Route handlers
│   │   │   ├── services/      # Business logic
│   │   │   ├── database/      # Schemas & models
│   │   │   ├── lib/           # Auth & DB setup
│   │   │   └── middleware/    # Auth middleware
│   │   └── drizzle/           # Migrations
│   └── web/              # React frontend
│       └── src/
│           ├── pages/         # Route components
│           └── lib/           # API client & auth
├── tsconfig.base.json    # Shared TypeScript config
└── justfile              # Task runner
```

## Database Setup

### Adding a New Table

1. Define schema in `packages/backend/src/database/schema.ts`
2. Export in the `table` object:
   ```ts
   export const table = {
     postsTable,
     user,
     session,
     account,
     verification,
     yourNewTable, // Add here
   } as const;
   ```

3. Add to models in `packages/backend/src/database/model.ts`:
   ```ts
   export const db = {
     insert: spreads({ yourNewTable: table.yourNewTable }, "insert"),
     select: spreads({ yourNewTable: table.yourNewTable }, "select"),
   };
   ```

4. Generate and apply migration:
   ```bash
   cd packages/backend
   bunx drizzle-kit generate
   bunx drizzle-kit migrate
   # Or for development
   bunx drizzle-kit push
   ```

### Drizzle Kit Commands

```bash
cd packages/backend

# Generate migration from schema changes
bunx drizzle-kit generate

# Apply migrations
bunx drizzle-kit migrate

# Push schema directly (dev only)
bunx drizzle-kit push

# Open Drizzle Studio
bunx drizzle-kit studio
```

## Google OAuth Setup

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google`
6. Copy Client ID and Secret to `packages/backend/.env`

## Environment Variables

### Backend (`packages/backend/.env`)

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3001
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Frontend (`packages/web/.env`)

```env
VITE_API_URL=http://localhost:3001
VITE_AUTH_URL=http://localhost:3001
```

## API Documentation

Swagger UI available at http://localhost:3001/swagger when backend is running.

## Features

- ✅ Type-safe API with Elysia + Eden Treaty
- ✅ Authentication with Better Auth
- ✅ Google OAuth integration
- ✅ Protected routes
- ✅ CRUD example (Posts)
- ✅ Database migrations with Drizzle
- ✅ Monorepo with workspace support
- ✅ Path aliases (`@frontend/*`, `@backend/*`)
- ✅ Hot reload on both frontend and backend

## License

MIT
