import { useTranslation } from 'react-i18next'
import { Link } from "react-router"
import { useModalStore } from "@/entities"
import { IconButton } from "@/shared"
import { Modal } from "@/shared"
import type { ErrorModalProps } from "../models/types"
import styles from './ErrorModal.module.scss'


export const ErrorModal = ({ error }: ErrorModalProps) => {
    const { modalError, setModalError, isErrorModalOpen } = useModalStore()
    const { t } = useTranslation()

    const handleClose = () => {
        setModalError('')
    }

    return (
        <Modal unclosable isOpen={isErrorModalOpen}>
            <div className={styles.errorModal}>
                <p className={styles.errorMessage}>{error || modalError}</p>
            </div>
            <Link to="/" className={styles.homeLink}>
                <IconButton icon='home' onClick={handleClose}>{t('homePage.button')}</IconButton>
            </Link>
        </Modal>
    )
}
