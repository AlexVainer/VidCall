import type { ButtonProps, IconButtonProps } from "../models/types"
import styles from './Button.module.scss'
import { Icon } from "../../icon/ui/Icon"

export const Button = ({ children, onClick, disabled, square, liquid }: ButtonProps) => {
    return (
        <button onClick={onClick} className={`${styles.button} ${disabled ? styles.disabled : ''} ${square ? styles.square : ''} ${liquid ? styles.liquid : ''}`}>
            {children}
        </button>
    )
}

export const IconButton = ({ icon, onClick, children, size = 28, ...props}: IconButtonProps) => {
    return (
        <Button onClick={onClick} className={`${styles.button} ${styles.button__withIcon}`} {...props}>
            <Icon name={icon} size={size} {...props} />
            {children ? <p>{children}</p> : null}
        </Button>
    )
}
