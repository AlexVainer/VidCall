import cookieParser from 'cookie-parser'
import express from 'express'
import type { Express } from 'express'
const app: Express = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
export { app }