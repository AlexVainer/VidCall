import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { IconButton, Loader } from "@/shared"
import type { RemoteVideoProps } from "../model/types"
import styles from "./Video.module.scss"

export const RemoteVideo = ({videoRef, isJoined, isDataChannelReady, toggleFullSize, isFullSize}: RemoteVideoProps) => {
    const [isMuted, setIsMuted] = useState(false)
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

    return (
        <div className={styles.remoteVideo}>
            {isJoined && !isDataChannelReady ? <div className={styles.pendingLoader}>
                <Loader type='echo' />
                <p>{t('pending')}</p>
            </div> : null}
            <video 
                controls={false}
                ref={videoRef} 
                autoPlay 
                playsInline
                className={styles.video}
                muted
            /> 

            {isDataChannelReady ? <div className={styles.controls}>
                <IconButton icon={isMuted ? 'mute-on' : 'mute-off'} isActive={!isMuted} onClick={toggleMute} square liquid />
                <IconButton icon={isFullSize ? 'fullsize-off' : 'fullsize'} onClick={toggleFullSize} square liquid />
            </div> : null}
        </div>
    )
}
