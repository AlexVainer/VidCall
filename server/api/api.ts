import crypto from 'crypto'
import type { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { app } from '../lib/app/index.ts'
import { sessionMiddleware } from '../lib/session/index.ts'
import { TURN_SECRET, TURN_DOMAIN } from '../config.ts'

app.use(sessionMiddleware)

app.use('/api', (req: Request, res: Response, next: NextFunction ) => {
    if (!req.session) {
        return res.status(500).json('Session not initialized')
    }
    if (!req.session.userId) {
        const userId = uuidv4()
        req.session.userId = userId
    }
    next()
})

app.post('/api/room', (req, res) => {
    const { roomId } = req.body

    if (!roomId) {
        res.status(400).json('room is required')
        return
    } if (!req.app.get('io').sockets.adapter.rooms.has(roomId)) {
        res.status(404).json('room not found')
        return
    }

    res.cookie("x-room-id", roomId, {
        httpOnly: true,
        secure: true,   
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    });

    res.json({ roomId });
})

app.post('/api/turn', (req, res) => {
    const roomId = req.cookies["x-room-id"];

    if (!roomId) {
        return res.status(403).json({ error: "no room" });
    }
    const ttl = 3600;
    const username = `${Math.floor(Date.now() / 1000) + ttl}`;
    if (!TURN_SECRET) {
        throw new Error("TURN_SECRET is not defined")
    }
    const credential = crypto
        .createHmac("sha1", TURN_SECRET)
        .update(username)
        .digest("base64");
    
    res.json({
        iceServers: [
            { urls: `stun:${TURN_DOMAIN}:3478` },
            {
                urls: [
                    `turn:${TURN_DOMAIN}:3478?transport=udp`,
                    `turn:${TURN_DOMAIN}:3478?transport=tcp`,
                    `turns:${TURN_DOMAIN}:5349`
                ],
                username,
                credential
            }
        ]
    })
})

app.post('/api/room-check', (req: Request, res: Response) => {
    const { roomId } = req.body
    const room = req.app.get('io').sockets.adapter.rooms.get(roomId)
    if (!room) return res.status(404).json({ error: 'room not found' })
    res.json({ size: room.size })
})

export default app
