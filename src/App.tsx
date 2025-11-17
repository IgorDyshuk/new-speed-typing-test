import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/themeProvider";
import { Toaster } from "sonner";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Header from "./components/Header";
import { ThemeChoice } from "./components/ThemeChoice";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="royal" storageKey="vite-ui-theme">
      <div className="bg-background leading-[250%] relative px-45 h-[92vh]">
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <Header />
            <AnimatedRoutes />
            <ThemeChoice />
          </HashRouter>
          <Toaster richColors />
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
