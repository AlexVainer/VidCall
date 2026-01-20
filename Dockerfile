FROM node:lts-alpine AS client-build

WORKDIR /client

COPY client/package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY client .
RUN npm run build


FROM node:lts-alpine AS server-build

WORKDIR /server

COPY server/package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY server .
RUN npm run build


FROM node:lts-alpine AS runner

WORKDIR /

COPY server/package*.json ./server/

COPY --from=client-build /client/dist ./client/dist
COPY --from=server-build /server/dist ./server/dist

COPY server/.env ./server/.env
COPY client/public ./client/public

WORKDIR /server

RUN --mount=type=cache,target=/root/.npm npm ci

ENV NODE_ENV=production

CMD node ./dist/app.js
