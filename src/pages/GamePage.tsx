import WordList from "@/components/WordList";
import { LangChoice } from "@/components/LangChoice.tsx";
import { ThemeChoice } from "@/components/ThemeChoice";

export default function GamePage() {
  return (
    <div className="px-30">
      <div className={"flex h-[80vh] flex-col items-center justify-center"}>
        <LangChoice />
        <WordList />
      </div>
      <ThemeChoice />
    </div>
  );
}
