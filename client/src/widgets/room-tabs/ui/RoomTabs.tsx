import { useTranslation } from "react-i18next"
import { useCreateRoom } from "../model/useCreateRoom"
import styles from './RoomTabs.module.scss'
import { Tab } from "./Tab"

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