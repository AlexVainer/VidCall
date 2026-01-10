import styles from './RoomTabs.module.scss'

export const Tab = ({ onClick, children}: {onClick: () => void, children: React.ReactNode }) => {
    return (
        <div className={styles.tab} onClick={onClick}>
            {children}
        </div>
    )   
}
