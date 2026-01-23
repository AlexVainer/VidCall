export interface LocalVideoProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    toggleVideo: () => void
    toggleAudio: () => void
    toggleScreenShare: () => void
    isVideoEnabled: boolean
    isAudioEnabled: boolean
    isScreenSharing: boolean
    isJoined: boolean
    isFullSize: boolean
    toggleFullSize: () => void
}

export interface RemoteVideoProps {
    videoRef: React.RefObject<HTMLVideoElement | null>
    isJoined: boolean
    isDataChannelReady: boolean
    isFullSize: boolean
    toggleFullSize: () => void
}
