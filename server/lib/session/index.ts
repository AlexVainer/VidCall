import session from "express-session"
import { SECRET } from "../../config.ts"

export const sessionMiddleware = session({
    secret: SECRET,
    cookie: { maxAge: 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: false,
})