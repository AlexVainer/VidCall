import type { Request, Response } from 'express'
import { app } from '../lib/app/index.ts'

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome!')
})

export default app