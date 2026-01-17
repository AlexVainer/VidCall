import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useModalStore, useRoomStore, checkRoomExists } from "@/entities"
import { useWebRTC } from "../model/useWebRTC"
import styles from './RoomPage.module.scss'
import { Chat, LocalVideo, RemoteVideo } from "@/entities"
import { JoinRoomModal } from "@/features"
import { IconButton } from "@/shared"


export const RoomPage = () => {
    const { roomId } = useParams<{ roomId: string }>()
    const { setModalError, modalError, openJoinModal, isJoinModalOpen } = useModalStore()
    const { setRoomParamId, roomParamId, checkedRoom, setCheckedRoom, joinedRoom } = useRoomStore()
    
    const [isRoomChecked, setIsRoomChecked] = useState(false)
    const [isCheckingRoom, setIsCheckingRoom] = useState(false)
    const [isMediaPending, setIsMediaPending] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    
    const {
        videoSelfRef,
        videoRemoteRef,
        isVideoEnabled,
        isAudioEnabled,
        isMediaReady,
        toggleVideo,
        toggleAudio,
        initMedia,
        joinRoom,
        clearRefs,
        emitMessage,
        RTCDataChannelState
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
        if (!isRoomChecked || modalError || !roomId || joinedRoom) return
        
        if (!roomParamId) {
            setRoomParamId(roomId)
        }
        if (!joinedRoom && !isJoinModalOpen) {
            openJoinModal()
        }
        if(!isMediaReady && !isMediaPending) {
            initMedia()
            setIsMediaPending(true)
        }
    }, [roomId, isRoomChecked, modalError, roomParamId, isMediaReady, joinedRoom, isJoinModalOpen, isMediaPending])
    
    useEffect(() => {
        return () => {
            clearRefs()
        }
    }, [])

    if (modalError || !isRoomChecked) return null

    return (
        <div className={styles.page}>
            <JoinRoomModal join={joinRoom} />

            <div className={styles.container}>
                <div className={styles.videoContainer}>
                    <LocalVideo videoRef={videoSelfRef} toggleVideo={toggleVideo} toggleAudio={toggleAudio} isVideoEnabled={isVideoEnabled} isAudioEnabled={isAudioEnabled} modal={isJoinModalOpen} />

                    <RemoteVideo videoRef={videoRemoteRef} isJoined={joinedRoom} />
                </div>
                <div className={styles.chatContainer}>
                    <Chat isJoined={joinedRoom} isDataChanelReady={RTCDataChannelState === 'open'} emitMessage={emitMessage} onClose={() => setIsChatOpen(false)} isOpen={isChatOpen} />
                </div>
                {joinedRoom && !isChatOpen && <div className={styles.chatIcon}>
                    <IconButton icon="chat" square onClick={() => setIsChatOpen(true)} />
                </div>}
            </div> 
    </div>
    )
}