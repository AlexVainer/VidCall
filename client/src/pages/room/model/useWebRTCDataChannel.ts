import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { v4 as uuidv4 } from 'uuid'
import { useChatStore, type Message } from "@/entities"
import type { BufferDataFileType } from "./types"


export const useWebRTCDataChannel = ({ peerConnection }: { peerConnection: React.RefObject<RTCPeerConnection | null> }) => {
    const { emit, addFile } = useChatStore()
    const dataChannelRef = useRef<RTCDataChannel | null>(null)
    const bufferDataFile = useRef<BufferDataFileType | null>(null)
    const bufferData = useRef<ArrayBuffer[] | null>(null)
    const [RTCDataChannelState, setRTCDataChannelState] = useState<RTCDataChannelState | null>(null)
    const { t } = useTranslation()

    const handleDataMessage = (event: MessageEvent) => {
        if (typeof event.data === 'string') {
        const data = JSON.parse(event.data)
        if (data.id) emit(data)
        else {
            if (data.fileName) {
            if (data.state === 'start') {
                bufferData.current = null
                bufferDataFile.current = null
                bufferDataFile.current = data
            } else if (data.state === 'finish') {
                if (bufferDataFile.current && bufferData.current) {
                const acceptedBlob = new Blob(bufferData.current)
                const file = new File([acceptedBlob], data.fileName, { type: data.fileType })
                addFile({ file, messageId: data.messageId })
                }
            }
            }
        }
        } else {
        bufferData.current = [...(bufferData.current || []), event.data]
        }
    }

    const initWebRTCData = async (dataRole: string | null) => {
        if (!dataRole) return
        if (!peerConnection.current) return
        if (dataRole === 'host') {
        const dataChannel = peerConnection.current.createDataChannel('chat')
        dataChannelRef.current = dataChannel
        dataChannel.onopen = () => {
            setRTCDataChannelState(dataChannel.readyState)
            emit({ type: 'system', id: uuidv4(), text: t('dataChannelOpen'), sendedAt: new Date() })
        }
        dataChannel.onmessage = (event: MessageEvent) => handleDataMessage(event)
        dataChannel.onclose = () => {
            setRTCDataChannelState(dataChannel.readyState)
            emit({ type: 'system', id: uuidv4(), text: t('dataChannelClosed'), sendedAt: new Date() })
        }
        } else if (dataRole === 'guest') {
            peerConnection.current.ondatachannel = (event) => {
                dataChannelRef.current = event.channel
                event.channel.onopen = () => {
                setRTCDataChannelState(event.channel.readyState)
                emit({ type: 'system', id: uuidv4(), text: t('dataChannelOpen'), sendedAt: new Date() })
                }
                event.channel.onmessage = (event: MessageEvent) => handleDataMessage(event)
                event.channel.onclose = () => {
                setRTCDataChannelState(event.channel.readyState)
                emit({ type: 'system', id: uuidv4(), text: t('dataChannelClosed'), sendedAt: new Date() })
                }
            }
        }
  }

    const emitMessage = async (message: Message) => {
        if (dataChannelRef.current) {
        if (message.files?.length) {
            const sendFile = async (file: File) => {
            return new Promise((resolve, reject) => {
                dataChannelRef.current?.send(JSON.stringify({ messageId: message.id, fileName: file.name, fileSize: file.size, state: 'start', fileType: file.type }))
                const reader = new FileReader()
                let offset = 0
                const chunkSize = 1024 * 16
                reader.onload = (e: ProgressEvent<FileReader>) => {
                if (!e.target?.result) return
                const result = e.target.result
                if (typeof result === 'string') return
                dataChannelRef.current?.send(result)
                offset += result.byteLength
                if (offset < file.size) {
                    readSlice(offset)
                } else {
                    dataChannelRef.current?.send(JSON.stringify({ messageId: message.id, fileName: file.name, fileSize: file.size, state: 'finish', fileType: file.type }))
                    resolve(true)
                }
                }
                reader.onerror = (e) => {
                    reject(e)
                }
                const readSlice = (chunkOffset: number) => {
                    const slice = file.slice(offset, chunkOffset + chunkSize)
                    reader.readAsArrayBuffer(slice)
                }
                readSlice(offset)
            })
            }
            for (const file of message.files) {
            await sendFile(file)
            }
        }
        dataChannelRef.current.send(JSON.stringify({ ...message, files: [] }))
        }
    }

    return { emitMessage, dataChannelRef, handleDataMessage, initWebRTCData, RTCDataChannelState }
}
