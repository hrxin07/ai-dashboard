# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/* \
  && npm ci --ignore-scripts

FROM dependencies AS builder
WORKDIR /app

COPY package.json package-lock.json prisma.config.ts tsconfig.json next.config.ts ./
COPY prisma ./prisma
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY proxy.ts eslint.config.mjs ./

ENV NODE_ENV=production
ENV DATABASE_URL=mysql://build:build@localhost:3306/ai_dashboard
ENV SHADOW_DATABASE_URL=mysql://build:build@localhost:3306/ai_dashboard_shadow
RUN npm run db:generate
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma/seed.ts ./prisma/seed.ts
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
USER nextjs
EXPOSE 3001

CMD ["npm", "run", "start"]

FROM builder AS migration

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed"]
