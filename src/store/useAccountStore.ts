import { create } from "zustand";
import { persist } from "zustand/middleware";

//TODO: записывать время когда ты впервые зарегался на сайте

type AccountState = {
  username: string;
  setUsername: (name: string) => void;

  testStarted: number;
  incrementTestStarted: () => void;
  testCompleted: number;
  incrementTestCompleted: () => void;

  totalTypingMs: number;
  addTypingMs: (delta: number) => void;
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      username: "",
      setUsername: (name) => set({ username: name }),

      testStarted: 0,
      incrementTestStarted: () =>
        set((state) => ({ testStarted: state.testStarted + 1 })),
      testCompleted: 0,
      incrementTestCompleted: () =>
        set((state) => ({ testCompleted: state.testCompleted + 1 })),

      totalTypingMs: 0,
      addTypingMs: (delta) =>
        set((state) => ({ totalTypingMs: state.totalTypingMs + delta })),
    }),
    { name: "typing-account" },
  ),
);
