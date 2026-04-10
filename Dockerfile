FROM node:24-alpine AS base
RUN npm install -g pnpm@10.33.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.base.json biome.json .npmrc ./
COPY apps/api-node/package.json apps/api-node/package.json
COPY apps/api-worker/package.json apps/api-worker/package.json
COPY packages/api-core/package.json packages/api-core/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm build

FROM node:24-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api-node/package.json ./apps/api-node/package.json
COPY --from=build /app/apps/api-node/dist ./apps/api-node/dist
COPY --from=build /app/apps/api-node/node_modules ./apps/api-node/node_modules
USER app
EXPOSE 3000
CMD ["node", "apps/api-node/dist/server.js"]
