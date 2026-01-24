interface Video {
    videoRef: React.RefObject<HTMLVideoElement | null>
    isJoined: boolean
    isFullSize: boolean
    toggleFullSize: () => void
    isChatOpen: boolean
}

export interface LocalVideoProps extends Video {
    toggleVideo: () => void
    toggleAudio: () => void
    toggleScreenShare: () => void
    isVideoEnabled: boolean
    isAudioEnabled: boolean
    isScreenSharing: boolean
}

export interface RemoteVideoProps extends Video {
    isDataChannelReady: boolean
}