import session from "express-session"
import { SESSION_SECRET } from "../../config.js"

if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not defined")
}

export const sessionMiddleware = session({
    secret: SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 100 },
    resave: false,
    saveUninitialized: false,
})