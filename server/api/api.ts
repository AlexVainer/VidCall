import type { Request, Response } from 'express'
import { app } from '../lib/app/index.ts'
import { sessionMiddleware } from '../lib/session/index.ts'
import { v4 as uuidv4 } from 'uuid'

app.use(sessionMiddleware)

app.get('/login', (req: Request, res: Response) => {
    if (!req.session) {
        return res.status(500).send('Session not initialized')
    }
    const sessionId = uuidv4()
    req.session.sessionId = sessionId
    res.send('Login successful.')
})

app.get('/logout', (req: Request, res: Response) => {
    if (req.session?.sessionId) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Logout failed.')
            }
            res.send('Logout successful.')
        })
    } else {
        res.send('Who are you?')
    }
})
app.get('/*api', (req: Request, res: Response, next) => {
    if (!req.session || !req.session.sessionId) {
        return res.status(401).send('Who are you?')
    }
    next()
})

app.get('/api', (req: Request, res: Response) => {
    res.send('Welcome!')
})

export default app

declare module 'express-session' {
    interface SessionData {
        sessionId?: string;
    }
}