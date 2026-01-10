import { useModalStore } from "@/entities"
import styles from './RoomTabs.module.scss'
import { Tab } from "./Tab"

export const RoomTabs = () => {
    const { openCreateModal, openJoinModal } = useModalStore()
    
    return (
        <div className={styles.tabs}>
            <Tab onClick={openCreateModal}>
                Create Room
            </Tab>
            <Tab onClick={openJoinModal}>
                Join Room
            </Tab>
        </div>
    )
}