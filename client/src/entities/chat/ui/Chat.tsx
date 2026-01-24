import { useTranslation } from "react-i18next"
import { useRoomStore, type Message } from "@/entities"
import { FileInput, IconButton, Input } from "@/shared"
import type { ChatProps } from "../model/types"
import { useChat } from "../model/useChat"
import styles from "./Chat.module.scss"
import { MessageItem } from "./Message"

export const Chat = ({ isJoined, isMediaReady, isDataChanelReady, emitMessage, isOpen }: ChatProps) => {
    const { role } = useRoomStore()
    const { handleSend, handleFileSelect, messageText, files, inputRef, handleChange, messages } = useChat({ isDataChanelReady, emitMessage })
    const { t } = useTranslation()

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
    }

    return (
        <div className={styles.chatWrapper + (isMediaReady ? ' ' + styles.ready : "") + (isOpen ? ' ' + styles.opened : "")}>
            <div className={styles.innerChat}>
                <div className={styles.messagesContainer}>
                    {isJoined ? messages?.map((message: Message) => (
                        <MessageItem key={message.id} message={message} />
                    )) : null}

                    {files.length ? <div className={styles.sendingFiles}>
                         <div>
                            <p>{t('appendedFiles')}</p>
                            {files.map((file: File) => (
                            <div key={file.name + file.size} className={styles.sendingFiles__file}>{file.name}</div>
                        ))}</div>
                    </div> : null}
                </div>
                
                <div className={styles.inputContainer}>
                    <Input value={messageText} onChange={handleChange} onEnter={handleSend} ref={inputRef} />
                    <FileInput onFileSelect={handleFileSelect} multiple />
                    <IconButton icon="send" square onClick={handleSend} disabled={(!messageText && !files.length) || !isDataChanelReady} />
                </div>
                {isDataChanelReady ? null : <div className={`${styles.connecting} ${isOpen ? styles.connecting__open : ''}`}>
                    {isJoined && role === 'host'
                        ? <>
                            <p>{t('shareLink')}</p>
                            <p className={styles.share} onClick={handleShare}>{t('share')}</p>
                        </>
                        : <p>{t('joinPending')}</p>
                    }
                </div>}
            </div>
        </div>
    )
}