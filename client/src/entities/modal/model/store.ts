import { create } from "zustand"

interface ModalStore {
    modalError: string;
    setModalError: (error: string) => void;
    isErrorModalOpen: boolean;
    setIsErrorModalOpen: (isOpen: boolean) => void;
}

export const useModalStore = create<ModalStore>((set => ({
    isErrorModalOpen: false,
    modalError: "",
    setModalError: (modalError: string) => {
        return set({ modalError, isErrorModalOpen: !!modalError })
    },
    setIsErrorModalOpen: (isOpen: boolean) => set({ isErrorModalOpen: isOpen }),
})))
