FROM node:lts-slim AS client-build

WORKDIR /client

COPY client/package*.json ./
RUN npm install

COPY client .
RUN npm run build


FROM node:lts-slim AS server-build

WORKDIR /server

COPY server/package*.json ./
RUN npm install

COPY server .
RUN npm run build


FROM node:lts-slim AS runner

RUN npm install -g pm2

WORKDIR /

COPY server/package*.json ./server/
RUN cd server && npm install

COPY --from=client-build /client/dist ./client/dist
COPY --from=server-build /server/dist ./server/dist

COPY --from=server-build /server/ecosystem.config.cjs ./server/ecosystem.config.cjs
COPY server/.env ./server/.env
COPY client/public ./client/public


WORKDIR /server

ENV NODE_ENV=production

CMD pm2-runtime ecosystem.config.cjs --env production
