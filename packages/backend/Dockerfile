# Backend Elysia - Dockerfile
# Build: docker build -t elysium-backend -f packages/backend/Dockerfile .

FROM oven/bun:1 AS build

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/web/package.json ./packages/web/
RUN bun install

COPY . .

ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun-linux-x64 \
    --outfile server \
    packages/backend/src/index.ts

FROM gcr.io/distroless/base-debian12

WORKDIR /app

COPY --from=build /app/server /server

ENV NODE_ENV=production

EXPOSE 3001

CMD ["/server"]
