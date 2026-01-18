import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { IconButton } from "@/shared"
import styles from "./Settings.module.scss"

export const Settings = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isShareClicked, setIsShareClicked] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsShareClicked(false)
  }

  const handleClickLogo = () => {
    navigate('/')
  }

  return (
    <div className={styles.settingsContainer}>
        <div className={styles.logoContainer}>
            <img src="/public/images/logo.png" alt="logo" onClick={handleClickLogo} />
        </div>
        {!isShareClicked && 
            <div className={styles.buttonContainer}>
                <IconButton icon='share' onClick={() => setIsShareClicked(true)}>{t('share')}</IconButton>
            </div>}
        <div className={styles.buttonContainer}>
            {isShareClicked && <IconButton icon='copy' onClick={handleCopyLink}>{t('copyLink')}</IconButton>}
        </div>
    </div>
  )
}
