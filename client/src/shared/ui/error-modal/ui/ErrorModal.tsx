import { Link } from "react-router"
import { useModalStore } from "@/entities"
import { Button } from "@/shared"
import { Modal } from "@/shared"
import type { ErrorModalProps } from "../models/types"
import styles from './ErrorModal.module.scss'
import { useTranslation } from 'react-i18next'


export const ErrorModal = ({ onClose, error }: ErrorModalProps) => {
    const { modalError, setModalError, isErrorModalOpen } = useModalStore()
    const { t } = useTranslation()

    const handleClose = () => {
        setModalError('')
    }

    return (
        <Modal onClose={onClose} isOpen={isErrorModalOpen}>
            <div className={styles.errorModal}>
                <p className={styles.errorMessage}>{error || modalError}</p>
            </div>
            <Link to="/" className={styles.homeLink}>
                <Button onClick={handleClose}>{t('home')}</Button>
            </Link>
        </Modal>
    )
}
