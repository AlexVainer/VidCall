import { useTranslation } from "react-i18next"
import { RoomTabs } from "@/widgets"
import styles from './HomePage.module.scss'

export const HomePage = () => {
    const { t } = useTranslation()

    return (
        <div className={styles.page}>
            <div className={styles.logoContainer}>
                <img src="/public/images/logo.webp" fetchPriority="high" alt="logo" />
            </div>

            <div className={styles.homeText}>
                <h1>{t('homePage.title')}</h1>
                <p>{t('homePage.description')}</p>
            </div>

            <RoomTabs />
        </div>
    )
}