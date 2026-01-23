import type { LoaderProps } from '../model/types'
import styles from './Loader.module.scss'

export const Loader = ({ type }: LoaderProps) => {
    return (
        <div className={`${styles.loader} ${styles[type]}`} />
    )
}