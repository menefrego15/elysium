# ---- Build ----
FROM oven/bun:latest AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/web/package.json ./packages/web/
COPY packages/backend/package.json ./packages/backend/
RUN bun install --ignore-scripts

COPY . .

RUN bun run --cwd packages/web build

# ---- Serve ----
FROM oven/bun:latest
WORKDIR /app
COPY --from=build /app/packages/web/dist ./dist
RUN bun install -g serve
EXPOSE 3000
CMD ["sh", "-c", "serve -s dist -l ${PORT:-3000}"]
