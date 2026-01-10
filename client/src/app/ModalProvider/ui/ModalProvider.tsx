import { CreateRoomModal, JoinRoomModal } from "@/features"
import { useModalStore } from "@/entities"
import { ErrorModal } from "@/shared"

export const ModalProvider = () => {
    const { isCreateModalOpen, isJoinModalOpen, modalError } = useModalStore()

    return (
        <>
            {isCreateModalOpen ? <CreateRoomModal /> : null}
            {isJoinModalOpen ? <JoinRoomModal /> : null}
            {modalError ? <ErrorModal /> : null}
        </>
    )
}