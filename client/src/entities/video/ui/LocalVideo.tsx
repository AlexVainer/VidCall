import { IconButton } from "@/shared"
import type { LocalVideoProps } from "../model/types"
import { useDraggable } from "../model/useDraggable"
import styles from "./Video.module.scss"


export const LocalVideo = ({videoRef, toggleVideo, toggleAudio, toggleScreenShare, isVideoEnabled, isAudioEnabled, isScreenSharing, isJoined, isFullSize, toggleFullSize, isChatOpen}: LocalVideoProps) => {
    const {dragRef, handleDragStart, handleDragEnd, handleDrag, handleTouchStart, handleTouchMove, handleTouchEnd} = useDraggable({isActive: isFullSize})

    const handleClose = () => {
        toggleFullSize()
    }

    return (
        <div className={`${styles.localVideo} ${(isFullSize && !isChatOpen) ? styles.floating : ''}`} ref={dragRef}>
            <video 
            controls={false} 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={styles.video}
            onContextMenu={toggleAudio}
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove} 
            onTouchEnd={handleTouchEnd} 
            onMouseDown={handleDragStart} 
            onMouseMove={handleDrag} 
            onMouseUp={handleDragEnd} 
            onMouseOut={handleDragEnd}
            /> 

            <div className={styles.closeButton}>
                <IconButton icon='close' size={28} onClick={handleClose} content />
            </div>
            {isJoined ? <div className={styles.controls}>
                <IconButton icon={isVideoEnabled ? 'video-on' : 'video-off'} isActive={isVideoEnabled} onClick={toggleVideo} square liquid />
                
                <IconButton icon={isAudioEnabled ? 'mic-on' : 'mic-off'} isActive={isAudioEnabled} onClick={toggleAudio} square liquid />

                <IconButton icon={isScreenSharing ? 'share-screen' : 'share-screen-off'} isActive={isScreenSharing} onClick={toggleScreenShare} square liquid />
            </div> : null}
        </div>)
}
