import { create } from "zustand";

type GameSessionStore = {
    started: boolean;
    finished: boolean;
    setStarted: (value: boolean) => void;
    setFinished: (value: boolean) => void;
}

export const useGameSessionStore = create<GameSessionStore>((set) => ({
    started: false,
    finished: false,
    setStarted: (value) => set({started: value}),
    setFinished: (value) => set({finished: value})
}))