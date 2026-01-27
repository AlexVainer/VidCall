import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Share } from "@/entities"
import { Button, IconButton } from "@/shared"
import styles from "./Settings.module.scss"

export const Settings = ({ isJoined }: { isJoined: boolean }) => {
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
        <div className={styles.buttonContainer}>
            {!isShareClicked && isJoined ?
                <div className={styles.buttonContainer}>
                    <Share />
                </div> : null}
            {isShareClicked ? <IconButton icon='copy' onClick={handleCopyLink}>{t('copyLink')}</IconButton> : null}
            <div className={styles.exitButton}>
                <Button red onClick={handleClickLogo}>{t('exitRoom')}</Button>
            </div>
        </div>
    </div>
  )
}
