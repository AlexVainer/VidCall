import type { ModalProps } from '../model/types'
import styles from './Modal.module.scss'


export const Modal = ({ children, onClose, unclosable }: ModalProps) => {
    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !unclosable) {
            onClose?.()
        }
    }

    return (
        <div className={styles.wrapper} onClick={handleClickOutside}>
            <div className={styles.modal}>
                <div className={styles.modal__content}>
                    {children}
                </div>
                {!unclosable ? <div className={styles.cross} onClick={onClose}>
                    ✚
                </div> : null}
            </div>
        </div>
    )
}