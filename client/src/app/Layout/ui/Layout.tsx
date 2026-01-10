import { useEffect } from "react"
import { useSocketStore } from "@/entities"
import styles from './Layout.module.scss'

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const { initSocket, socket, disconnectSocket } = useSocketStore()

    useEffect(() => {
        if (socket) return
        initSocket()

        return () => {
            disconnectSocket()
        }
    }, [])

    return (
        <div className={styles.layout}>
            {children}
        </div>
    )
}