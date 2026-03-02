# Stage 1: Build
FROM oven/bun:latest AS build

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/web/package.json ./packages/web/
COPY packages/backend/package.json ./packages/backend/
RUN bun install --ignore-scripts

COPY . .

ARG VITE_API_URL
ARG VITE_AUTH_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV NODE_ENV=production

RUN bun run --cwd packages/web build

# Stage 2: Serve
FROM nginx:alpine

COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
