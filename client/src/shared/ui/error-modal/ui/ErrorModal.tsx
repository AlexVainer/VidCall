import { Link } from "react-router"
import { useModalStore } from "@/entities"
import { Button } from "@/shared"
import { Modal } from "@/shared"
import type { ErrorModalProps } from "../models/types"
import styles from './ErrorModal.module.scss'

export const ErrorModal = ({ onClose, error }: ErrorModalProps) => {
    const { modalError, setModalError } = useModalStore()

    const handleClose = () => {
        setModalError('')
    }

    return (
        <Modal onClose={onClose}>
            <div className={styles.errorModal}>
                <p className={styles.errorMessage}>{error || modalError}</p>
            </div>
            <Link to="/" className={styles.homeLink}>
                <Button onClick={handleClose}>Home</Button>
            </Link>
        </Modal>
    )
}
