# syntax=docker/dockerfile:1
FROM oven/bun:1.2.1 as base
ENV NODE_ENV=production
WORKDIR /app

FROM base as build
COPY --link bun.lockb package.json ./
RUN bun install --ci
COPY --link . .
RUN bun run tw

FROM base
COPY --from=build /app /app
EXPOSE 3000
CMD [ "bun", "src/index.tsx" ]