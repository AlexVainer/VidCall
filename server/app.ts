import app from './api/api.ts'
import { wsHandler } from './api/ws.ts'
import { WebSocketServer } from 'ws'
import * as http from 'http'

const port = 3000

const server = http.createServer(app)

const wss = new WebSocketServer({ server })

wss.on('connection', wsHandler)

server.listen(port, () => {
  console.log(`App listening on port ${port}`)
})