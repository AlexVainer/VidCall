import { IconButton } from "@/shared"
import type { LocalVideoProps } from "../model/types"
import styles from "./Video.module.scss"


export const LocalVideo = ({videoRef, toggleVideo, toggleAudio, toggleScreenShare, isVideoEnabled, isAudioEnabled, isScreenSharing, isJoined, toggleFullSize, isFullSize}: LocalVideoProps) => {
    return (
        <div className={`${styles.localVideo} ${isFullSize ? styles.floating : ''}`}>
            <video 
            controls={false} 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={styles.video}
            onContextMenu={toggleAudio}
            /> 
            {isFullSize
                ? <div className={styles.return}>
                    <IconButton icon='expand' size={32} onClick={toggleFullSize} square liquid/>
                </div>
                : null}
            {isJoined ? <div className={styles.controls}>
                <IconButton icon={isVideoEnabled ? 'video-on' : 'video-off'} isActive={isVideoEnabled} onClick={toggleVideo} square liquid />
                
                <IconButton icon={isAudioEnabled ? 'mic-on' : 'mic-off'} isActive={isAudioEnabled} onClick={toggleAudio} square liquid />

                <IconButton icon={isScreenSharing ? 'share-screen' : 'share-screen-off'} isActive={isScreenSharing} onClick={toggleScreenShare} square liquid />
            </div> : null}
        </div>)
}
