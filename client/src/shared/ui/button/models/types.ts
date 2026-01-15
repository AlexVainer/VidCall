import type { IconName } from "../../icon/model/types"

export interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    square?: boolean
    liquid?: boolean
}

export interface IconButtonProps {
    icon: IconName
    onClick?: () => void
    disabled?: boolean
    children?: React.ReactNode
    square?: boolean
    liquid?: boolean
    className?: string
    size?: number
}

