import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/themeProvider";
import { Toaster } from "sonner";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Header from "./components/Header";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="royal" storageKey="vite-ui-theme">
      <div className="px-45 bg-background leading-[250%]">
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <Header />
            <AnimatedRoutes />
          </HashRouter>
          <Toaster richColors />
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
