import { io, type Socket } from "socket.io-client";
import { create } from "zustand"

interface SocketStore {
    socket: Socket | null
    isConnected: boolean
    initSocket: () => void
    disconnectSocket: () => void
}

export const useSocketStore = create<SocketStore>(((set, get) => ({
    socket: null as Socket | null,
    isConnected: false,
    
    initSocket: () => {
        const socket: Socket = io()

        socket.on('connect', () => {
            set({ isConnected: true })
        });

        socket.on('disconnect', () => {
            set({ isConnected: false })
        })

        set({ socket })
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.close()
            set({ socket: null, isConnected: false });
        }
    }
})))
