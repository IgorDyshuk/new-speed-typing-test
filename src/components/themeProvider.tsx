import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "royal" | "ocean" | "sunset" | "forest" | "rose" | "slate";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  availableThemes?: Theme[];
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "royal",
  storageKey = "vite-ui-theme",
  availableThemes,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const themes = useMemo<Theme[]>(
    () =>
      availableThemes ?? [
        "royal",
        "ocean",
        "sunset",
        "forest",
        "rose",
        "slate",
      ],
    [availableThemes]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      setTheme: (t: Theme) => {
        localStorage.setItem(storageKey, t);
        setThemeState(t);
      },
      themes,
    }),
    [theme, themes, storageKey]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
