import styles from './RoomTabs.module.scss'
import { Tab } from "./Tab"
import { useCreateRoom } from "../model/useCreateRoom"
import { useTranslation } from "react-i18next"

export const RoomTabs = () => {
    const { handleCreate } = useCreateRoom()
    const { t } = useTranslation()

    return (
        <div className={styles.tabs}>
            <Tab onClick={handleCreate}>
                {t('createRoom')}
            </Tab>
        </div>
    )
}