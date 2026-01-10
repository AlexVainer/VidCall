import type { InputProps } from "../model/types"
import styles from './Input.module.scss'

export const Input = ({ ref, value, onChange, error, placeholder, type, title }: InputProps) => {
    return (
        <div className={
            styles.input__container 
            + (title ? ' ' + styles.input__withTitle : '') 
            + (typeof error === 'string' ? ' ' + styles.input__withError : '')
        }>
            {title && <span className={styles.title}>{title}</span>}
            <input
                ref={ref}
                value={value}
                onChange={onChange}
                className={styles.input + (error ? ' ' + styles.input__error : '')}
                placeholder={placeholder}
                type={type}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    )
}
