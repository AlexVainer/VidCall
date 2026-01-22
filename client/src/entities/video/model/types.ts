export interface LocalVideoProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    toggleVideo: () => void
    toggleAudio: () => void
    isVideoEnabled: boolean
    isAudioEnabled: boolean
    isJoined: boolean
}

export interface RemoteVideoProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    isJoined: boolean
}
