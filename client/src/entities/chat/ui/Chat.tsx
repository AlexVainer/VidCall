import { useState } from "react"
import { useChatStore, type Message } from "@/entities"
import { IconButton, Input } from "@/shared"
import type { ChatProps } from "../model/types"
import styles from "./Chat.module.scss"
import { MessageItem } from "./Message"

export const Chat = ({ isJoined, isDataChanelReady, emitMessage, onClose, isOpen }: ChatProps) => {
    const { messages, emit } = useChatStore()
    const [messageText, setMessageText] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageText(e.target.value)
    }

    const handleSend = () => {
        if(!messageText) return
        const message: Message = { id: Math.random().toString(36).substr(2, 9), text: messageText, sendedAt: new Date(), type: 'self'}
        emitMessage({ ...message, type: 'remote' })
        emit({ ...message })
        setMessageText('')
    }

    return (
        <div className={styles.chatWrapper + (isJoined ? ' ' + styles.ready : "") + (isOpen ? ' ' + styles.opened : "")}>
            <div className={styles.cross}>
                {isDataChanelReady && isOpen ? <IconButton icon="close" square onClick={onClose} /> : null}
            </div>
            <div className={styles.innerChat}>
                <div className={styles.messagesContainer}>
                    {isJoined ? messages?.map((message: Message) => (
                        <MessageItem key={message.id} message={message} />
                    )) : null}
                </div>
                <div className={styles.inputContainer}>
                    <Input value={messageText} onChange={handleChange} onEnter={handleSend} />
                    <IconButton icon="send" square onClick={handleSend} disabled={!messageText} />
                </div>
            </div>
            {isDataChanelReady ? null : <div className={styles.connecting}>Waiting for connection...</div>}
        </div>
    )
}