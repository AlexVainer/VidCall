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
            onClick={toggleVideo}
            onContextMenu={toggleAudio}
            /> 

            <div className={styles.controls}>
                <IconButton icon={isVideoEnabled ? 'video-off' : 'video-on'} onClick={toggleVideo} square={true} liquid={true} />
                
                <IconButton icon={isAudioEnabled ? 'mic-off' : 'mic-on'} onClick={toggleAudio} square={true} liquid={true} />
            </div>
        </div>)
}
