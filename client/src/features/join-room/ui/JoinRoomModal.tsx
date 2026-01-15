import { Modal, Button } from '@/shared'
import { useModalStore } from "@/entities"
import type { JoinRoomModalProps } from '../model/types'
import styles from './JoinRoomModal.module.scss'


export const JoinRoomModal = ({ join }: JoinRoomModalProps) => {
    const { isJoinModalOpen } = useModalStore()

    return (
        <Modal unclosable={true} isOpen={isJoinModalOpen}>
            <div className={styles.container}>
                <div className={styles.title}>Check your settings</div>
                <Button onClick={join}>
                    Join Room
                </Button>
            </div>
        </Modal>
    )
}