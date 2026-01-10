import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useModalStore, useRoomStore, useSocketStore } from "@/entities"

export const useCreateRoomModal = () => {
    const navigate = useNavigate()
    const { socket } = useSocketStore()
    
    const { closeCreateModal } = useModalStore()
    const { setUserName, checkedRoom, setCheckedRoom } = useRoomStore()
    
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    
    useEffect(() => {
        if (!socket) return
        
        const handleRoomCreated = ({ roomId }: { roomId: string }) => {
            setCheckedRoom(roomId)
            navigate(`/room/${roomId}`)
            closeCreateModal()
        }
        
        socket.on('roomcreated', handleRoomCreated)
        
        return () => {
            socket.off('roomcreated', handleRoomCreated)
        }
    }, [socket, navigate, closeCreateModal, checkedRoom])
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        setError('')
    }
    
    const handleCreate = () => {
        if (!name) {
            setError('Please enter a name')
            return
        }
        
        if (!socket) {
            setError('Socket not available')
            return
        }
        
        if (!socket.connected) {
            setError('Socket not connected yet')
            return
        }
        
        setUserName(name)
        socket.emit('createroom', { name })
    }
    
    return {
        name,
        error,
        handleInputChange,
        handleCreate,
        closeModal: closeCreateModal
    }
}