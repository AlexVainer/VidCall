import type { IconName } from "../../icon/model/types"

export interface ButtonProps {
    children?: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    square?: boolean
    liquid?: boolean
    isActive?: boolean
    action?: boolean
    red?: boolean
    content?: boolean
}

export interface IconButtonProps extends ButtonProps {
    icon: IconName
    size?: number
}

