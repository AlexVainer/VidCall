FROM node:lts-slim AS client-build

WORKDIR /client

COPY client/package*.json ./
RUN npm ci

COPY client .
RUN npm run build


FROM node:lts-slim AS server-build

WORKDIR /server

COPY server/package*.json ./
RUN npm ci

COPY server .
RUN npm run build


FROM node:lts-slim AS runner

WORKDIR /

COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY --from=client-build /client/dist ./client/dist
COPY --from=server-build /server/dist ./server/dist

COPY server/.env ./server/.env
COPY client/public ./client/public

WORKDIR /server

ENV NODE_ENV=production

CMD node ./dist/app.js
