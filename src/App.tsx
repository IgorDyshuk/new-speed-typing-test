import { Route, Routes, HashRouter } from "react-router-dom";
import GamePage from "@/pages/GamePage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/themeProvider";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="royal" storageKey="vite-ui-theme">
      <div className="bg-background leading-[250%]">
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <Routes>
              <Route path="/" element={<GamePage />} />
            </Routes>
          </HashRouter>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
