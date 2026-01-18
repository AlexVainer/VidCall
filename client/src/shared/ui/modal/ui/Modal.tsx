import { Icon } from "@/shared"
import type { ModalProps } from '../model/types'
import styles from './Modal.module.scss'


export const Modal = ({ children, onClose, unclosable, isOpen, fullSize }: ModalProps) => {
    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !unclosable) {
            onClose?.()
        }
    }

    return (
        <div className={`${styles.modal} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.fade} ${isOpen ? styles.open : ''}`} onClick={handleClickOutside} />
            <div className={`${styles.modal__content} ${isOpen ? styles.open : ''} ${fullSize ? styles.fullSize : ''}`}>
                {children}
                {!unclosable ? <div className={styles.cross} onClick={onClose}>
                    <Icon name="close" size={24} color="red" />
                </div> : null}
            </div>
        </div>
    )
}
