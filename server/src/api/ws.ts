import { Server, Socket } from "socket.io"
import { v4 as uuidv4 } from 'uuid'

interface User {
    socketId: string
    role: 'host' | 'guest'
}
interface Room {
    roomId: string
    users: User[]
}

const rooms: Room[] = []

const findRoom = (roomId: string | null) => {
    if (!roomId) return null
    return rooms.find((room) => room.roomId === roomId)
}

const saveRoom = (room: { roomId: string, users: User[] }) => {
    const index = rooms.findIndex((r) => r.roomId === room.roomId)
    if (index !== -1) {
        rooms[index] = room
    } else {
        rooms.push(room)
    }
}

const deleteRoom = (roomId: string) => {
    const index = rooms.findIndex((r) => r.roomId === roomId)
    if (index !== -1) {
        rooms.splice(index, 1)
    }
}

export const wsHandler = (socket: Socket, io: Server) => {
    const req = socket.request
    let userId = socket.request.session.userId

    if (!userId) {
        const newUid = uuidv4()
        userId = newUid
    }

    if (!socket.request.session) {
        socket.disconnect()
        return
    }
    socket.on('error', console.error)

    socket.on('joinroom', ({roomId }: {roomId: string}) => {
        if (!io.sockets.adapter.rooms.get(roomId)) {
            socket.emit('joinerror', 'Room does not exist')
            return
        }
        
        const roomSize = io.sockets.adapter.rooms.get(roomId)?.size

        if (roomSize && roomSize > 1) {
            socket.emit('joinerror', 'Room is full')
            return
        }

        const user = findRoom(roomId)?.users.find(u => u.socketId === socket.id)

        if (!user) {
            socket.join(roomId)

            const role =  roomSize ? 'guest' : 'host'
            const room = findRoom(roomId)

            if (!room) {
                saveRoom({ roomId, users: [ { socketId: socket.id, role } ] })
            } else if (!room.users.some(user => user.socketId === socket.id)) {
                room.users.push({ socketId: socket.id, role })
                saveRoom(room)
            }

        
            socket.emit('joinroom', { role })
            
            socket.to(roomId).emit('userjoined')
        } else if (user.role === 'host') {
            socket.emit('joinedashost')
        }
    })

    socket.on('createroom', () => {
        if (!userId) {
            return
        }

        socket.join(userId)
        
        if (!findRoom(userId)) {
            saveRoom({ roomId: userId, users: [ { socketId: socket.id, role: 'host' } ] })
        }
        const room = findRoom(userId)
        socket.emit('roomcreated', { roomId: userId, users: room?.users })
    })

    socket.on('offer', (offer: RTCSessionDescriptionInit) => {
        const room = findRoom(getRoomBySocketId(socket.id))
        if (room) {
            socket.to(room.roomId).emit('offer', offer)
        } else {
            socket.emit('offererror')
        }
    })

    socket.on('answer', (answer: RTCSessionDescriptionInit) => {
        const room = findRoom(getRoomBySocketId(socket.id))
        if (room) {
            socket.to(room.roomId).emit('answer', answer)
        } else {
            socket.emit('answererror')
        }
    })

    socket.on('sendCandidate', (candidate: RTCIceCandidate) => {
        const room = findRoom(getRoomBySocketId(socket.id))
        if (room) {
            socket.to(room.roomId).emit('icecandidate', candidate)
        } else {
            socket.emit('candidateerror')
        }
    })

    socket.on('disconnect', () => {
        const room = findRoom(getRoomBySocketId(socket.id))
        if (room) {
            if (room.users.length < 2) {
                deleteRoom(room.roomId)
            } else {
                saveRoom({ ...room, users: room.users.filter(user => user.socketId !== socket.id) })
                socket.to(room.roomId).emit('user-left', socket.id)
            }
        }
    })

    function getRoomBySocketId(socketId: string): string | null {
        for (let room of rooms) {
            if (room.users.find(user => user.socketId === socketId)) {
                return room.roomId
            }
        }
        return null
    }
}