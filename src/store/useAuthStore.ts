import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
};

const initialAuthState: Pick<AuthState, "isAuthenticated" | "userId"> = {
  isAuthenticated: false,
  userId: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialAuthState,
      login: (userId) =>
        set(() => ({
          isAuthenticated: true,
          userId,
        })),
      logout: () => set(() => ({ ...initialAuthState })),
    }),
    { name: "typing-auth" },
  ),
);
