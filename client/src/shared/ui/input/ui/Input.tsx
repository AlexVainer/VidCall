import type { InputProps } from "../model/types"
import styles from './Input.module.scss'

export const Input = ({ ref, value, onChange, error, placeholder, type, title, onEnter }: InputProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            onEnter?.()
        }
    }

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
                onKeyDown={handleKeyDown}
                className={styles.input + (error ? ' ' + styles.input__error : '')}
                placeholder={placeholder}
                type={type}
            />
            <span className={`${styles.error} ${error ? styles.error__visible : ''}`}>{error}</span>
        </div>
    )
}
