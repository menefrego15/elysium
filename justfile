# Install dependencies
install:
    bun install

# Start backend dev server
dev-backend:
    cd packages/backend && bun run dev

# Start frontend dev server
dev-web:
    cd packages/web && bun run dev

# Start both backend and frontend
dev:
    bun run dev-backend & bun run dev-web

# Build frontend for production
build:
    cd packages/web && bun run build
