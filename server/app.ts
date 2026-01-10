import app from './api/api.ts'
import { wsHandler } from './api/ws.ts'
import { Server } from 'socket.io'
import * as http from 'http'
import { sessionMiddleware } from './lib/session/index.ts'
import { CLIENT_URL, NODE_ENV, PORT, DIST_PATH } from './config.ts'
import { Session } from 'express-session'
import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'
import path from 'path'

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
    app.use(['/', '/room/:roomId'], (req, res) => res.sendFile(DIST_PATH + '/index.html'))
    app.use(
        '/assets',
        express.static(path.join(DIST_PATH, 'assets'))
    )
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