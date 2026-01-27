import { format } from "date-fns"
import { useMemo } from "react"
import { useChatStore } from "../model/store"
import type { Message } from "../model/types"
import styles from "./Chat.module.scss"
import { File } from "./File"

export const MessageItem = ({ message, key }: { message: Message, key: string }) => {
    const { files } = useChatStore()
    const messageFiles = useMemo(() => files.filter(file => file.messageId === message.id), [files, message.id])

    const handleClickFile = (file: File) => {
        const url = URL.createObjectURL(file)
        window.open(url, '_blank')
    }

    return (
        <div className={`${styles.message} ${styles[message.type]}`} key={key}>
            <div className={styles.message__content}>
                <p className={styles.message__text}>{message.text}</p>
                <div className={styles.message__files}>
                    {message.type === 'self' ? message.files?.map(file => <File key={file.name} name={file.name} onClick={() => handleClickFile(file)} />) : null}
                    {message.type === 'remote' ? messageFiles.map(file => <File key={file.file.name} name={file.file.name} onClick={() => handleClickFile(file.file)} />) : null}
                </div>
                {message.type !== 'system' && <span className={styles.message__time}>{format(new Date(message.sendedAt), "HH:mm")}</span>}
            </div>
        </div>
    )
}
