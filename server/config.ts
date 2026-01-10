import 'dotenv/config'
import { fileURLToPath } from 'url'
import path from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
export const DIST_PATH = path.join(__dirname, process.env.STATIC_PATH || '../client/dist')

export const SESSION_SECRET = process.env.SESSION_SECRET
export const CLIENT_URL = process.env.CLIENT_URL

export const TURN_SECRET = process.env.TURN_SECRET
export const TURN_DOMAIN = process.env.TURN_DOMAIN
export const NODE_ENV = process.env.NODE_ENV
export const PORT = process.env.PORT