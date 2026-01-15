import styles from './RoomTabs.module.scss'
import { Tab } from "./Tab"
import { useCreateRoom } from "../model/useCreateRoom"

export const RoomTabs = () => {
    const { handleCreate } = useCreateRoom()
  
    return (
        <div className={styles.tabs}>
            <Tab onClick={handleCreate}>
                Create Room
            </Tab>
        </div>
    )
}