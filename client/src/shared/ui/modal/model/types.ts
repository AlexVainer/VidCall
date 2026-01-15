export interface ModalProps {
    children: React.ReactNode
    onClose?: () => void
    unclosable?: boolean
    isOpen: boolean 
    fullSize?: boolean
}
