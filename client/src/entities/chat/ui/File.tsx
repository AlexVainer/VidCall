import { Icon } from "@/shared"
import styles from './Chat.module.scss'

export const File = ({ key, name, onClick }: { key: string, name: string, onClick?: () => void }) => {
    return (
        <div className={styles.message__file} key={key} onClick={onClick}>
            <Icon name="file" size={28} />
            <span>{name}</span>
        </div>
    )
}
