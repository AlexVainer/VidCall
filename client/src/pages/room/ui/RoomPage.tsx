import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import { Settings } from "@/widgets"
import { JoinRoomModal } from "@/features"
import { Chat, LocalVideo, RemoteVideo } from "@/entities"
import { useModalStore, useRoomStore, checkRoomExists } from "@/entities"
import { IconButton } from "@/shared"
import { useWebRTC } from "../model/useWebRTC"
import styles from './RoomPage.module.scss'


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
    
    const { t } = useTranslation()

    useEffect(() => {
        if (!roomId) {
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
                setModalError(t('roomIsFull'))
                return
            } else {
                setModalError(t('roomNotExist'))
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

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    }

    if (modalError || !isRoomChecked) return null

    return (
        <div className={styles.page}>
            <JoinRoomModal join={joinRoom} />

            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Settings />

                    <div className={styles.videoContainer}>
                        <LocalVideo videoRef={videoSelfRef} toggleVideo={toggleVideo} toggleAudio={toggleAudio} isVideoEnabled={isVideoEnabled} isAudioEnabled={isAudioEnabled} modal={isJoinModalOpen} />

                        <RemoteVideo videoRef={videoRemoteRef} isJoined={joinedRoom} />
                    </div>
                </div>
                <div className={`${styles.chatContainer} ${isChatOpen ? styles.chatContainer__open : ''}`}>
                    <Chat isJoined={joinedRoom} isDataChanelReady={RTCDataChannelState === 'open'} emitMessage={emitMessage} isOpen={isChatOpen} />
                </div>
                {joinedRoom && <div className={styles.chatIcon}>
                    <IconButton icon={isChatOpen ? 'close' : 'chat'} square onClick={toggleChat} >
                        <p>{isChatOpen ? t('closeChat') : t('openChat')}</p>
                    </IconButton>
                </div>}
            </div> 
    </div>
    )
}
