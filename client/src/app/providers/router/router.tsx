import { BrowserRouter, Routes, Route } from "react-router"
import { HomePage, RoomPage } from "@/pages"
import { ModalProvider } from "@/app/ModalProvider/ui/ModalProvider"

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <ModalProvider />
            <Routes>
                <Route path="/room/:roomId" element={<RoomPage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    )
}