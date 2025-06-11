import {BrowserRouter, Route, Routes} from "react-router-dom";
import GamePage from "@/pages/GamePage.tsx";

function App() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<GamePage />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App