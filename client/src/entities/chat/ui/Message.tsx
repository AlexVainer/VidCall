import type { Message } from "../model/types"
import styles from "./Chat.module.scss"


export const MessageItem = ({ message }: { message: Message }) => {
    return (
        <div className={`${styles.message} ${styles[message.type]}`}>
            <div className={styles.message__content}>
                {message.text}
            </div>
        </div>
    )
}
