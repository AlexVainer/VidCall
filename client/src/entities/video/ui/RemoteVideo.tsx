import { useEffect, useState } from "react"
import { IconButton } from "@/shared"
import type { RemoteVideoProps } from "../model/types"
import styles from "./Video.module.scss"


export const RemoteVideo = ({videoRef, isJoined}: RemoteVideoProps) => {
    const [isMuted, setIsMuted] = useState(false)

    useEffect(() => {
        const video = videoRef.current
        if (video) {
            video.muted = isMuted
        }
    }, [isMuted, videoRef])

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    return (
        <div className={styles.remoteVideo}>
            <video 
                controls={false}
                ref={videoRef} 
                autoPlay 
                playsInline
                className={styles.video}
                muted
            /> 

            {isJoined ? <div className={styles.controls}>
                <IconButton icon={isMuted ? 'mute-on' : 'mute-off'} isActive={!isMuted} onClick={toggleMute} square liquid />
            </div> : null}
        </div>
    )
}
