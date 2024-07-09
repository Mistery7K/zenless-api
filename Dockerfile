ARG NODE_VERSION=18.14.2

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3001

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base as build

COPY package.json package-lock.json .
RUN npm install --production=false

COPY . .

RUN npm run build
RUN npm prune

# Vérification des fichiers de données
RUN ls -l /src/server/data/characters

# Run
FROM base

ENV PORT=$PORT

COPY --from=build /src/.output /src/.output
COPY --from=build /src/server/data /src/server/data
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]