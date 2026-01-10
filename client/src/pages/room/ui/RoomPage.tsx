import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useModalStore, useRoomStore, checkRoomExists } from "@/entities"
import { Button } from "@/shared"
import { useWebRTC } from "../model/useWebRTC"
import styles from './RoomPage.module.scss'

export const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const { setModalError, modalError, openJoinModal } = useModalStore()
  const { userName, setRoomParamId, roomParamId, checkedRoom, setCheckedRoom, role } = useRoomStore()

  const [isRoomChecked, setIsRoomChecked] = useState(false)
  const [isCheckingRoom, setIsCheckingRoom] = useState(false)

  const {
    videoSelfRef,
    videoRemoteRef,
    // dataChannelRef,
    isVideoEnabled,
    isAudioEnabled,
    // isMediaReady,
    toggleVideo,
    toggleAudio,
    initMedia,
    joinRoom
  } = useWebRTC(roomId || '', setModalError)

  useEffect(() => {
    if (!roomId) {
      setModalError('Room ID is required')
      return
    }
    
    const checkRoom = async () => {
        if (isCheckingRoom || isRoomChecked) return
        if (checkedRoom) {
            setIsRoomChecked(true)
            return
        }
        
        setIsCheckingRoom(true)

        const roomSize = await checkRoomExists(roomId)

        setIsCheckingRoom(false)

        if (roomSize && roomSize.size < 2) {
            setIsRoomChecked(true)
            setCheckedRoom(roomId)
            return
        } else if (roomSize && roomSize.size > 1) {
            setModalError('Room is full')
            return
        } else {
            setModalError('Room does not exist')
            return
        }
    }

    checkRoom()
  }, [roomId, isRoomChecked, isCheckingRoom, checkedRoom])

  useEffect(() => {
    if (!isRoomChecked || modalError || !roomId) return

    if (!roomParamId) {
      setRoomParamId(roomId)
    }

    if (!userName) {
      openJoinModal()
      return
    }

    if (!role) {
      return
    }

    initMedia()
  }, [isRoomChecked, userName, roomParamId, roomId, role])

  useEffect(() => {
    if (userName && roomId && joinRoom) {
      joinRoom(userName)
    }
  }, [userName, roomId, joinRoom])

  if (modalError || !isRoomChecked || !userName || !role) return null

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <video 
          controls={false} 
          ref={videoSelfRef} 
          autoPlay 
          playsInline 
          muted 
          style={{transform: 'scale(-1,1)'}} 
        /> 
      </div>
      <div className={styles.right}>
        <video 
          controls={false}
          ref={videoRemoteRef} 
          autoPlay 
          playsInline
          muted={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            background: '#000'
          }}
        /> 
      </div>

      <div className={styles.controls}>
        <Button onClick={toggleVideo}>
          {isVideoEnabled ? 'cam off' : 'cam on'}
        </Button>
        
        <Button onClick={toggleAudio}>
          {isAudioEnabled ? 'mic off' : 'mic on'}
        </Button>
      </div>
    </div>
  )
}