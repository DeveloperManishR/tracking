FROM node:22-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build

COPY tsconfig.json drizzle.config.js ./
COPY public ./public
COPY src ./src
COPY drizzle ./drizzle

RUN pnpm build

FROM base AS runtime

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/src/app/common/firebase/serviceAccountKey.json ./src/app/common/firebase/serviceAccountKey.json

EXPOSE 9000

CMD ["node", "dist/index.js"]