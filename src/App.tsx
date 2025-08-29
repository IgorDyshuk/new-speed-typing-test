import { BrowserRouter, Route, Routes } from "react-router-dom";
import GamePage from "@/pages/GamePage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/themeProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="royal" storageKey="vite-ui-theme">
      <div className="bg-background">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<GamePage />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
