import { useState } from "react"
import { useChatStore } from "./store"

export const useChat = () => {
    const { messages, emit } = useChatStore()
    const [messageText, setMessageText] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value)
    }

    const handleSend = () => {
        if(!messageText) return
        const message = { id: Math.random().toString(36).substr(2, 9), text: messageText, sendedAt: new Date() }
        emit({ ...message, type: 'remote' })
        emit({ ...message, type: 'self' })
    }

    return { messages, messageText, handleChange, handleSend }
}
