export interface BufferDataFileType {
  messageId: string
  fileName: string
  fileSize: number
  fileType: string
  state: 'start' | 'finish'
}
