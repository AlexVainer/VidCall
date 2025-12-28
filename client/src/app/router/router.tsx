import { BrowserRouter, Route, Routes } from "react-router"
import { App } from "../"

export const AppRouter = () => {
    return (
        <BrowserRouter>   
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </BrowserRouter>
    )
}