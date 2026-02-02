import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useModalStore, useRoomStore, useSocketStore } from "@/entities"

export const useCreateRoom = () => {
    const navigate = useNavigate()
    const { socket } = useSocketStore()
    
    const { setModalError } = useModalStore()
    const { setCheckedRoom, setRole, setRoomParamId } = useRoomStore()
    
    useEffect(() => {
        if (!socket) return
        
        const handleRoomCreated = ({ roomId }: { roomId: string }) => {
            setCheckedRoom(roomId)
            setRoomParamId(roomId)
            setRole('host')
            navigate(`/room`)
        }
        
        socket.on('roomcreated', handleRoomCreated)
        
        return () => {
            socket.off('roomcreated', handleRoomCreated)
        }
    }, [socket, navigate, setCheckedRoom, setRole])

    const handleCreate = () => {
        if (!socket) {
            setModalError('Socket not available')
            return
        }
        
        if (!socket.connected) {
            setModalError('Socket not connected yet')
            return
        }

        socket.emit('createroom')
    }
    
    return {
        handleCreate,
    }
}
