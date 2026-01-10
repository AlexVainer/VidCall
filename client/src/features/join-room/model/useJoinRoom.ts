import { useState } from 'react'
import { useNavigate } from "react-router"
import { useModalStore, useRoomStore, checkRoomExists } from "@/entities"

export const useJoinRoom = () => {
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  
  const { closeJoinModal, setModalError } = useModalStore()
  const { setUserName, roomParamId, checkedRoom } = useRoomStore()

  const isFromPage = !!roomParamId

  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) {
      setError('Name is required')
      return
    }
    setName(e.target.value)
    setError('')
  }

  const handleJoin = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (isFromPage) {
      setUserName(name)
      closeJoinModal()
      return
    }

    if (!roomId.trim()) {
      setError('Room ID is required')
      return
    }
    
    setError('')

    if (checkedRoom) {
      navigate(`/room/${roomParamId || roomId}`)
      closeJoinModal()
      return
    }

    const isExist = await checkRoomExists(roomId)

    if (isExist && (isExist.size < 2)) {
        navigate(`/room/${roomParamId || roomId}`)
        closeJoinModal()
    } else if (isExist && isExist.size > 1) {
        setModalError('Room is full')
        closeJoinModal()
    } else {
        setError('Room does not exist')
    }
  }

  return {
    roomId,
    name,
    error,
    isFromPage,
    handleRoomIdChange,
    handleNameChange,
    handleJoin,
    closeModal: closeJoinModal
  }
}