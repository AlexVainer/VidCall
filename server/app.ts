import app from './api/index.ts'

import { WebSocketServer } from 'ws';
import * as http from 'http';
import { wsHandler } from './api/ws.ts';

const port = 3000

const server = http.createServer(app)

const wss = new WebSocketServer({ server })

wss.on('connection', wsHandler)

server.listen(port, () => {
  console.log(`App listening on port ${port}`)
})