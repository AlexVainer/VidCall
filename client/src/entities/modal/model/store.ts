import { create } from "zustand"

interface ModalStore {
    isCreateModalOpen: boolean;
    isJoinModalOpen: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
    openJoinModal: () => void;
    closeJoinModal: () => void;
    modalError: string;
    setModalError: (error: string) => void;
    isErrorModalOpen: boolean;
    setIsErrorModalOpen: (isOpen: boolean) => void;
}

export const useModalStore = create<ModalStore>((set => ({
    isCreateModalOpen: false,
    isJoinModalOpen: false,
    isErrorModalOpen: false,
    modalError: "",
    openCreateModal: () => set({ isCreateModalOpen: true }),
    closeCreateModal: () => set({ isCreateModalOpen: false }),
    openJoinModal: () => set({ isJoinModalOpen: true }),
    closeJoinModal: () => set({ isJoinModalOpen: false }),
    setModalError: (modalError: string) => {
        return set({ modalError, isErrorModalOpen: !!modalError })
    },
    setIsErrorModalOpen: (isOpen: boolean) => set({ isErrorModalOpen: isOpen }),
})))
