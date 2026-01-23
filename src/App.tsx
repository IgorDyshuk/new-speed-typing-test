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
      <div className="bg-background leading-[250%] relative px-2 sm:px-10 md:px-17 lg:px-25 xl:px-30 2xl:px-45 h-[92vh]">
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
