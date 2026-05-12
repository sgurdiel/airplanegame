ARG BASE_OCI_IMAGE=node:24.15.0-alpine

FROM ${BASE_OCI_IMAGE} AS base
WORKDIR /srv/app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /srv/app/node_modules ./node_modules
COPY package*.json tsconfig*.json webpack.config.cjs ./
COPY src ./src
COPY templates ./templates
COPY public ./public
ARG APP_VERSION=0
ENV APP_VERSION=$APP_VERSION
RUN npm run pro:build

FROM ${BASE_OCI_IMAGE} AS runtime
USER node
ENV NODE_ENV=production
COPY --chown=node:node --from=build /srv/app/public ./public

ENTRYPOINT ["tini", "--"]
CMD ["node", "dist/Server.js"]
