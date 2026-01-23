export interface LocalVideoProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    toggleVideo: () => void
    toggleAudio: () => void
    toggleScreenShare: () => void
    isVideoEnabled: boolean
    isAudioEnabled: boolean
    isScreenSharing: boolean
    isJoined: boolean
}

export interface RemoteVideoProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    isJoined: boolean
}
