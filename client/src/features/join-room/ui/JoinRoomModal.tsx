import { Modal, Button } from '@/shared'
import { useModalStore } from "@/entities"
import type { JoinRoomModalProps } from '../model/types'
import styles from './JoinRoomModal.module.scss'
import { useTranslation } from 'react-i18next'


export const JoinRoomModal = ({ join }: JoinRoomModalProps) => {
    const { isJoinModalOpen } = useModalStore()
    const { t } = useTranslation()

    return (
        <Modal unclosable isOpen={isJoinModalOpen}>
            <div className={styles.container}>
                <div className={styles.title}>{t('joinModalTitle')}</div>
                <Button onClick={join}>
                    {t('joinRoom')}
                </Button>
            </div>
        </Modal>
    )
}