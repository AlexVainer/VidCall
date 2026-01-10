import app from './api/api.ts'
import { wsHandler } from './api/ws.ts'
import { Server } from 'socket.io'
import * as http from 'http'
import { sessionMiddleware } from './lib/session/index.ts'
import { CLIENT_URL, NODE_ENV, PORT } from './config.ts'
import { Session } from 'express-session'
import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'
import { join, dirname } from 'path'

const server = http.createServer(app)
const io = new Server(server)

if (NODE_ENV === 'development') {
    const proxyMiddleware = createProxyMiddleware({
        target: CLIENT_URL,
        changeOrigin: true,
        ws: true
    })
    app.use('/', proxyMiddleware)
} else if (NODE_ENV === 'production') {
    app.use(['/', '/room/:roomId'], express.static(join(dirname('../client/dist/index.html'))))
}

io.engine.use(sessionMiddleware)

io.on('connection', (socket) => {
    wsHandler(socket, io)
})

app.set('io', io)

server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

declare module 'express-session' {
    interface SessionData {
        userId?: string;
    }
}

declare module 'http' {
    interface IncomingMessage {
        session: {
            userId?: string
        } & Session
    }
}