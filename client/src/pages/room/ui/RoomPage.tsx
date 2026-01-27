import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router"
import { Settings } from "@/widgets"
import { Chat, LocalVideo, RemoteVideo } from "@/entities"
import { useModalStore, useRoomStore, checkRoomExists } from "@/entities"
import { IconButton } from "@/shared"
import { useWebRTC } from "../model/useWebRTC"
import { JoinContainer } from "./JoinContainer"
import styles from './RoomPage.module.scss'


export const RoomPage = () => {
    const { roomId } = useParams<{ roomId: string }>()
    const { setModalError, modalError } = useModalStore()
    const { setRoomParamId, roomParamId, checkedRoom, setCheckedRoom, joinedRoom, role } = useRoomStore()
    const [isRoomChecked, setIsRoomChecked] = useState(false)
    const [isCheckingRoom, setIsCheckingRoom] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isFullSize, setIsFullSize] = useState(false)
    
    const {
        videoSelfRef,
        videoRemoteRef,
        isVideoEnabled,
        isAudioEnabled,
        isMediaReady,
        toggleVideo,
        toggleAudio,
        initMedia,
        isMediaPending,
        joinRoom,
        clearRefs,
        emitMessage,
        RTCDataChannelState,
        toggleScreenShare,
        isScreenSharing,
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
        if (!isRoomChecked || modalError || !roomId || joinedRoom || roomParamId) return
        
        setRoomParamId(roomId)
        if(!isMediaReady && !isMediaPending.current) {
            initMedia(true)
        }
    }, [roomId, isRoomChecked, modalError, roomParamId, isMediaPending, initMedia, setRoomParamId, isMediaReady, joinedRoom])
    
    useEffect(() => {
        return () => {
            clearRefs()
        }
    }, [])

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
    }

    const toggleFullSize = () => {
        setIsFullSize(!isFullSize)
    }

    const isDataChannelReady = RTCDataChannelState === 'open'

    if (modalError || !isRoomChecked) return null

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.leftContainer}>
                    <Settings isJoined={joinedRoom} />

                    <div className={styles.videoContainer}>
                        <LocalVideo 
                            isChatOpen={isChatOpen}
                            isFullSize={isFullSize} 
                            toggleFullSize={toggleFullSize}
                            isJoined={joinedRoom} 
                            videoRef={videoSelfRef} 
                            toggleVideo={toggleVideo} 
                            toggleAudio={toggleAudio} 
                            toggleScreenShare={toggleScreenShare} 
                            isVideoEnabled={isVideoEnabled} 
                            isAudioEnabled={isAudioEnabled} 
                            isScreenSharing={isScreenSharing} />
                        {joinedRoom 
                            ? <RemoteVideo isChatOpen={isChatOpen} videoRef={videoRemoteRef} isJoined={joinedRoom} toggleFullSize={toggleFullSize} isFullSize={isFullSize} isDataChannelReady={isDataChannelReady} />
                            : <JoinContainer isVideoEnabled={isVideoEnabled} toggleVideo={toggleVideo} isAudioEnabled={isAudioEnabled} toggleAudio={toggleAudio} joinRoom={joinRoom} role={role} />
                        }
                    </div>
                </div>
                <div className={`${styles.chatContainer} ${isChatOpen ? styles.chatContainer__open : ''}`}>
                    <Chat isJoined={joinedRoom} isMediaReady={isMediaReady} isDataChanelReady={isDataChannelReady} emitMessage={emitMessage} isOpen={isChatOpen} />
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
