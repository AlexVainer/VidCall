import { IconButton } from "@/shared"
import type { LocalVideoProps } from "../model/types"
import styles from "./Video.module.scss"


export const LocalVideo = ({videoRef, toggleVideo, toggleAudio, isVideoEnabled, isAudioEnabled, modal}: LocalVideoProps) => {
    return (
        <div className={styles.localVideo + (modal ? ' ' + styles.localVideo__modal : '')}>
            <video 
            controls={false} 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={styles.video}
            style={{transform: 'scale(-1,1)'}}
            onContextMenu={toggleAudio}
            /> 

            <div className={styles.controls}>
                <IconButton icon={isVideoEnabled ? 'video-on' : 'video-off'} isActive={isVideoEnabled} onClick={toggleVideo} square liquid />
                
                <IconButton icon={isAudioEnabled ? 'mic-on' : 'mic-off'} isActive={isAudioEnabled} onClick={toggleAudio} square liquid />
            </div>
        </div>)
}
