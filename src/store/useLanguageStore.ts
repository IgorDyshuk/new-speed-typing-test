import { create } from "zustand";
import { persist } from "zustand/middleware";

type LanguageState = {
  language: string;
  setLanguage: (code: string) => void;
};

const defaultLanguage = "en";

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: defaultLanguage,
      setLanguage: (code) => set({ language: code }),
    }),
    { name: "typing-test-language" },
  ),
);
