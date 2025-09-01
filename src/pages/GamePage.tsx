import WordList from "@/components/WordList";
import { LangChoice } from "@/components/LangChoice.tsx";
import { ThemeChoice } from "@/components/ThemeChoice";

export default function GamePage() {
  return (
    <div className="relative min-h-screen px-30 py-40 bg-background flex flex-col items-center justify-center">
      <LangChoice />
      <WordList />

      <div className="absolute bottom-40 right-32">
        <ThemeChoice />
      </div>
    </div>
  );
}
