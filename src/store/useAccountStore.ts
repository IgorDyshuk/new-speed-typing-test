import { create } from "zustand";
import { persist } from "zustand/middleware";

type AccountState = {
  username: string;
  setUsername: (name: string) => void;
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      username: "",
      setUsername: (name) => set({ username: name }),
    }),
    { name: "typing-account" }
  )
);
