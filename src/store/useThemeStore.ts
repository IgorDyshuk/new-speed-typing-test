import type { Theme } from "@/components/themeProvider";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const defaultTheme: Theme = "royal";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      setTheme: (theme) => set({ theme }),
    }),
    { name: "typing-test-theme" },
  ),
);
