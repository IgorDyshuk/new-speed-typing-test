import { create } from "zustand";

type GameSessionStore = {
    started: boolean;
    finished: boolean;
    restart: () => void;
    setStarted: (value: boolean) => void;
    setFinished: (value: boolean) => void;
    setRestart: (cb: () => void) => void
}

export const useGameSessionStore = create<GameSessionStore>((set) => ({
    started: false,
    finished: false,
    restart: () => {},
    setStarted: (value) => set({started: value}),
    setFinished: (value) => set({finished: value}),
    setRestart: (cb) => set({restart: cb})
}))