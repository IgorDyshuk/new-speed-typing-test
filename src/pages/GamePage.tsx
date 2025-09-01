import WordList from "@/components/WordList";
import { LangChoice } from "@/components/LangChoice.tsx";
import { ThemeChoice } from "@/components/ThemeChoice";
import CountdownTimer from "@/components/CountdownTimer";

export default function GamePage() {
  return (
    <div className="relative min-h-screen px-30 py-40 bg-background flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 items-center w-full">
        <div className="justify-self-start">
          <CountdownTimer timeLeft={30} />
        </div>
        <div className="justify-self-center">
          <LangChoice />
        </div>
        <div />
      </div>
      <WordList />

      <div className="absolute bottom-40 right-32">
        <ThemeChoice />
      </div>
    </div>
  );
}
