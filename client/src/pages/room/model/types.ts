export interface BufferDataFileType {
  messageId: string
  fileName: string
  fileSize: number
  fileType: string
  state: 'start' | 'finish'
}

export interface JoinContainerProps {
  isVideoEnabled: boolean
  toggleVideo: () => void
  isAudioEnabled: boolean
  toggleAudio: () => void
  joinRoom: () => void
}
