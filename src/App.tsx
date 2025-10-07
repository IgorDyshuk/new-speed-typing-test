import { Route, Routes, HashRouter, useLocation } from "react-router-dom";
import GamePage from "@/pages/GamePage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/themeProvider";
import ResultsPage from "@/pages/ResultsPage.tsx";
import { AnimatePresence, easeInOut, motion } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // initial={{ opacity: 0, y: -20 }}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.175, ease: easeInOut }}
            >
              <GamePage />
            </motion.div>
          }
        />
        <Route
          path="/results"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // initial={{ opacity: 0, y: -20 }}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.175, ease: easeInOut }}
            >
              <ResultsPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="royal" storageKey="vite-ui-theme">
      <div className="bg-background leading-[250%]">
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <AnimatedRoutes />
          </HashRouter>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
