import {BrowserRouter, Route, Routes} from "react-router-dom";
import GamePage from "@/pages/GamePage.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

function App() {
    const queryClient = new QueryClient()

    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<GamePage/>}/>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </div>
    )
}

export default App