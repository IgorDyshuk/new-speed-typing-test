import { Route, Routes, useLocation } from "react-router-dom";
import GamePage from "@/pages/GamePage.tsx";
import ResultsPage from "@/pages/ResultsPage.tsx";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import StatisticPage from "@/pages/StatisticPage";

export default function AnimatedRoutes() {
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
              transition={{ duration: 0.175, ease: easeInOut }}
            >
              <ResultsPage />
            </motion.div>
          }
        />
        <Route
          path="/statistic"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.175, ease: easeInOut }}
            >
              <StatisticPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
