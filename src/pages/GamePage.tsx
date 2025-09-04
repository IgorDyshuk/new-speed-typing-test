import WordList from "@/components/WordList";
import { LangChoice } from "@/components/LangChoice.tsx";
import { ThemeChoice } from "@/components/ThemeChoice";
import CountdownTimer from "@/components/CountdownTimer";
import RestartButton from "@/components/restartButton/RestartButton.tsx";
import useTypingGame from "@/hooks/useTypingGame";
import { useEffect, useRef } from "react";

export default function GamePage() {
  const {
    words,
    statuses,
    extras,
    currentWordIndex,
    currentCharIndex,
    handleKeyDown,
    handleBeforeInput,
    restart,
    started,
    timeLeft,
  } = useTypingGame(100);

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [words]);

  return (
    <div
      id="game"
      className="relative min-h-screen px-30 py-40 bg-background flex flex-col items-center justify-center outline-none"
    >
      <div className="grid grid-cols-3 items-center w-full">
        <div className="justify-self-start">
          <div
            className={`transition-opacity duration-300 ${started ? "opacity-100" : "opacity-0"}`}
          >
            <CountdownTimer timeLeft={timeLeft} />
          </div>
        </div>
        <div className="justify-self-center">
          <LangChoice />
        </div>
        <div />
      </div>
      <div
        className="relative w-full"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="relative z-10">
          <WordList
            words={words}
            statuses={statuses}
            extras={extras}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          onKeyDown={handleKeyDown}
          onBeforeInput={handleBeforeInput}
          onChange={(e) => {
            // keep empty
            e.currentTarget.value = "";
          }}
          defaultValue=""
          className="absolute inset-0 z-0 opacity-0 pointer-events-none"
          aria-hidden
        />
      </div>
      <div onClick={restart}>
        <RestartButton />
      </div>

      <div className="absolute bottom-40 right-32">
        <ThemeChoice />
      </div>
    </div>
  );
}
