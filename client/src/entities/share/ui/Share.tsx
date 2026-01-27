import { useTranslation } from "react-i18next"
import { IconButton, WithTooltip, Button } from "@/shared"
import type { ShareProps } from "../model/types"
import styles from "./Share.module.scss"

export const Share = ({ link }: ShareProps) => {
    const { t } = useTranslation()
    
    return (
        <WithTooltip content={shareContent({t})} gap={250}>
            <IconButton icon="share" size={28} link={link}>
                {t('share')}
            </IconButton>
        </WithTooltip>
    )
}

const shareContent = ({ t }: {t: (key: string) => string}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href)
    }
    const handleShare = () => {
        navigator.share({
            title: document.title,
            text: t('shareText'),
            url: window.location.href
        })
    }
    return (
        <div className={styles.shareContent}>
            <div className={styles.copyLink}>
                <p>{window.location.href}</p>
                <Button onClick={handleCopy}>{t('copy')}</Button>
            </div>
            <p>{t('shareWith')}</p>
            <div className={styles.shareWith}>
                <a href={`https://telegram.me/share/url?url=${window.location.href}`} target="_blank"><IconButton icon="telegram" size={24} round/></a>
                <a href={`https://wa.me/?text=${window.location.href}`} target="_blank"><IconButton icon="whatsapp" size={24} round/></a>
                <a href={`https://www.instagram.com/share?url=${window.location.href}`} target="_blank"><IconButton icon="instagram" size={24} round/></a>
                <a href={`mailto:?subject=${window.location.href}`} target="_blank"><IconButton icon="email" size={24} round/></a>
                <IconButton icon="share" size={24} round onClick={handleShare}/>
            </div>
        </div>
    )
}
