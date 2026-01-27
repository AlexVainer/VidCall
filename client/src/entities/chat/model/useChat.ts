import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { v4 as uuidv4 } from 'uuid'
import { useChatStore } from "./store"
import type { Message } from "./types"

export const useChat = ({ isDataChanelReady, emitMessage }: { isDataChanelReady: boolean, emitMessage: (message: Message) => void }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const { messages, emit } = useChatStore()
    const [messageText, setMessageText] = useState('')
    const [files, setFiles] = useState<File[]>([])
    const { t } = useTranslation()

    const handleSend = () => {
        if((!messageText && !files.length) || !isDataChanelReady) return

        const message: Message = { id: uuidv4(), text: messageText, sendedAt: new Date(), type: 'self'}
        emitMessage({ ...message, type: 'remote', files })
        emit({ ...message, files })
        setFiles([])
        setMessageText('')
    }

    const handleFileSelect = (file: FileList) => {
        const inputFiles = Array.from(file)
        if (!inputFiles.length) return
        if (inputFiles.some(f => (f.size > 10 * 1000 * 1000) || !f.size )) {
            inputFiles.forEach(f => {
                if (!f.size) emit({ id: uuidv4(), text: t('fileEmpty', { fileName: f.name }), sendedAt: new Date(), type: 'system' })
                else if (f.size > 10 * 1000 * 1000) emit({ id: uuidv4(), text: t('fileTooLarge', { fileName: f.name }), sendedAt: new Date(), type: 'system' })
            })
        }
        if (inputFiles.length > 9) {
            emit({ id: uuidv4(), text: t('filesLimit'), sendedAt: new Date(), type: 'system' })
        }
        setFiles([...files, ...inputFiles.filter(f => (f.size <= 10 * 1000 * 1000) && f.size).splice(0, 9)])
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value)
    }

    return { handleSend, handleFileSelect, handleChange, messageText, setMessageText, files, setFiles, inputRef, messages, emit }
}
