import { format } from "date-fns"
import type { Message } from "../model/types"
import styles from "./Chat.module.scss"


export const MessageItem = ({ message }: { message: Message }) => {
    return (
        <div className={`${styles.message} ${styles[message.type]}`}>
            <div className={styles.message__content}>
                {message.text}
                {message.type !== 'system' && <span className={styles.message__time}>{format(new Date(message.sendedAt), "HH:mm")}</span>}
            </div>
        </div>
    )
}
