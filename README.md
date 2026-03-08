<div align="center">
  <img src="https://starter-elysium.vercel.app/logo512.png" alt="Elysium Logo" width="200"/>

# Full Stack TypeScript Starter

  Minimal full-stack monorepo with Bun, React, and Elysia. Add features on demand via CLI.
</div>

## Tech Stack (Minimal)

- **Runtime:** Bun
- **Frontend:** React 19 + TanStack Router/Query + Tailwind CSS 4
- **Backend:** Elysia + TypeScript
- **Type-safety:** Eden Treaty (end-to-end)

## Features

Add features via CLI (coming soon):
- `drizzle` - PostgreSQL + Drizzle ORM
- `auth` - Better Auth (Google OAuth)
- `drizzle + auth` - Full stack with database and auth

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

3. **Start backend**

   ```bash
   just dev-backend
   # or: cd packages/backend && bun run dev
   ```

4. **Start web dev server** (in a separate terminal)

   ```bash
   just dev-web
   # or: cd packages/web && bun run dev
   ```

## Project Structure

```
packages/
├── backend/              # Elysia API
│   └── src/
│       ├── modules/      # Feature modules (health)
│       ├── lib/          # Errors, models
│       └── routes/       # Route aggregation
└── web/                  # React frontend
    └── src/
        ├── pages/        # Page components
        ├── components/   # UI components
        └── lib/          # Client, utils
```

## Architecture

### Backend - Feature Modules

Each module follows the same pattern:

- `index.ts` - Routes (Elysia controller)
- `service.ts` - Business logic
- `model.ts` - TypeBox schemas + types

**Error Handling:**

- Custom error classes (`BadRequestError`, `NotFoundError`, etc.)
- Auto re-throw in `ServerError` constructor
- Global error handler in `index.ts`

### Frontend - TanStack Router + Query

- **Router:** Code-based with `createRoute()`
- **Query:** Custom hooks pattern, consistent error handling

## Available Commands (justfile)

- `just install` - Install dependencies
- `just dev-backend` - Start backend dev server
- `just dev-web` - Start frontend dev server
- `just dev` - Start both backend and frontend
- `just build` - Build frontend for production

## Environment Variables

**Backend** (`packages/backend/.env`):

```env
PORT=3001
APP_URL=http://localhost:3000
```

**Frontend** (`packages/web/.env`):

```env
VITE_API_URL=http://localhost:3001
```

## Documentation

- **API Docs:** <http://localhost:3001/swagger>

## Adding Features

Run the CLI to add features:

```bash
# Coming soon
npx create-elysium --features drizzle,auth
```

## License

MIT
