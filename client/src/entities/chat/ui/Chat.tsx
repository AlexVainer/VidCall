import { IconButton, Input } from "@/shared"
import type { ChatProps } from "../model/types"
import type { Message } from "../model/types"
import { useChat } from "../model/useChat"
import styles from "./Chat.module.scss"
import { MessageItem } from "./Message"

export const Chat = ({ isJoined, isDataChanelReady, onClose, isOpen }: ChatProps) => {
    const { messages, messageText, handleChange, handleSend } = useChat()

    return (
        <div className={styles.chatWrapper + (isJoined ? ' ' + styles.ready : "") + (isOpen ? ' ' + styles.opened : "")}>
            {isDataChanelReady ? null : <div className={styles.connecting}>Waiting for connection...</div>}
            <div className={styles.cross}>
                {isDataChanelReady && isOpen ? <IconButton icon="close" square onClick={onClose} /> : null}
            </div>
            <div className={styles.innerChat}>
                <div className={styles.messagesContainer}>
                    {isDataChanelReady ? messages?.map((message: Message) => (
                        <MessageItem key={message.id} message={message} />
                    )) : null}
                </div>
                <div className={styles.inputContainer}>
                    <Input value={messageText} onChange={handleChange} onEnter={handleSend} />
                    <IconButton icon="send" square onClick={handleSend} disabled={!messageText} />
                </div>
            </div>
        </div>
    )
}