import app from './api/api.js'
import { wsHandler } from './api/ws.js'
import { Server } from 'socket.io'
import * as http from 'http'
import { sessionMiddleware } from './lib/session/index.js'
import { CLIENT_URL, NODE_ENV, PORT, DIST_PATH } from './config.js'
import { Session } from 'express-session'
import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'
import path from 'path'

const server = http.createServer(app)
const io = new Server(server)

if (process.env.NODE_ENV === 'development') {
    const proxyMiddleware = createProxyMiddleware({
        target: CLIENT_URL,
        changeOrigin: true,
        ws: true
    })
    app.use('/', (req, res, next) => {
        proxyMiddleware(req, res, next)
    })
} else if (NODE_ENV === 'production') {
    app.use(['/', '/room/:roomId'], (req, res) => {
        res.sendFile(DIST_PATH + '/index.html')
    })
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