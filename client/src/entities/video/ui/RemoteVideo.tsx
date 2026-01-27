import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useRoomStore } from "@/entities"
import { IconButton, Loader } from "@/shared"
import type { RemoteVideoProps } from "../model/types"
import { useDraggable } from "../model/useDraggable"
import styles from "./Video.module.scss"

export const RemoteVideo = ({videoRef, isJoined, isDataChannelReady, toggleFullSize, isFullSize, isChatOpen}: RemoteVideoProps) => {
    const [isMuted, setIsMuted] = useState(false)
    const [close, setClose] = useState(false)
    const { role } = useRoomStore()
    const {dragRef, handleDragStart, handleDragEnd, handleDrag, handleTouchStart, handleTouchMove, handleTouchEnd} = useDraggable({isActive: isChatOpen && !close})
    const { t } = useTranslation()

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            video.muted = isMuted
        }
    }, [isMuted, videoRef])

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    const handleClose = () => {
        setClose(true)
    }

    return (
        <div className={`${styles.remoteVideo} ${(isChatOpen && !close) ? styles.floating : ''}`} ref={dragRef}>
            {!isJoined || (isChatOpen && !isDataChannelReady) ? null : <div className={styles.pendingLoader}>
                <Loader type='echo' />
                <p>{role === 'host' ? t('pending') : t('joining')}</p>
            </div>}
            <video 
                controls={false}
                ref={videoRef} 
                autoPlay 
                playsInline
                className={styles.video}
                muted
                draggable={false}
                onTouchStart={handleTouchStart} 
                onTouchMove={handleTouchMove} 
                onTouchEnd={handleTouchEnd} 
                onMouseDown={handleDragStart} 
                onMouseMove={handleDrag} 
                onMouseUp={handleDragEnd} 
                onMouseOut={handleDragEnd}
            /> 

            <div className={styles.closeButton}>
                <IconButton icon='close' size={36} onClick={handleClose} content />
            </div>

            {isDataChannelReady ? <div className={styles.controls}>
                <IconButton icon={isMuted ? 'mute-on' : 'mute-off'} isActive={!isMuted} onClick={toggleMute} square liquid />
                <IconButton icon={isFullSize ? 'fullsize-off' : 'fullsize'} onClick={toggleFullSize} square liquid />
            </div> : null}
        </div>
    )
}
