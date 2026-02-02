import { BrowserRouter, Routes, Route } from "react-router"
import { ModalProvider } from "@/app/ModalProvider/ui/ModalProvider"
import { HomePage, RoomPage } from "@/pages"

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <ModalProvider />
            <Routes>
                <Route path="/room/:roomId?" element={<RoomPage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    )
}