import type { ButtonProps } from "../models/types"
import styles from './Button.module.scss'

export const Button = ({ children, onClick, disabled }: ButtonProps) => {
    return (
        <button onClick={onClick} className={styles.button + (disabled ? ' ' + styles.button__disabled : '')}>
            {children}
        </button>
    )
}
