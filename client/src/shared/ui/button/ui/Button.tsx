import { Icon } from "../../icon/ui/Icon"
import type { ButtonProps, IconButtonProps } from "../models/types"
import styles from './Button.module.scss'

export const Button = ({ children, onClick, disabled, square, liquid, isActive }: ButtonProps) => {
    return (
        <button onClick={onClick} className={`${styles.button} ${disabled ? styles.disabled : ''} ${square ? styles.square : ''} ${liquid ? styles.liquid : ''} ${isActive ? styles.active : ''} ${children ? styles.withText : ''}`}>
            {children}
        </button>
    )
}

export const IconButton = ({ icon, onClick, children, size = 28, ...props}: IconButtonProps) => {
    return (
        <Button onClick={onClick} className={`${styles.button}`} {...props}>
            <Icon name={icon} size={size} {...props} />
            {children ? <p>{children}</p> : null}
        </Button>
    )
}
