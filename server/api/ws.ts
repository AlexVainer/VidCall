import { WebSocket } from "ws";

export const wsHandler = (ws: WebSocket) => {
  console.log('New client connected')

  ws.on('message', (message: string) => {
    console.log(`Received message => ${message}`)
    ws.send(`Server received: ${message}`)
  })
}