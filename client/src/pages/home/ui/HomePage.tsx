import { RoomTabs } from "@/widgets"
import styles from './HomePage.module.scss'

export const HomePage = () => {
    return (
        <div className={styles.page}>
            <RoomTabs />
        </div>
    )
}