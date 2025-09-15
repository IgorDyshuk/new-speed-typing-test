import WordList from "@/components/WordList";
import { LangChoice } from "@/components/LangChoice.tsx";
import { ThemeChoice } from "@/components/ThemeChoice";
import CountdownTimer from "@/components/CountdownTimer";
import RestartButton from "@/components/restartButton/RestartButton.tsx";
import useTypingGame from "@/hooks/useTypingGame";
import { useCallback, useEffect, useRef, useState } from "react";
import ModalBlur from "@/components/ModalBlur";
import TestConfig from "@/components/TestConfig";

export default function GamePage() {
  const [duration, setDuration] = useState<number>(30);
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
    finished,
    wpm,
    acc,
  } = useTypingGame(100, duration);

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [idle, setIdle] = useState(false);
  const INACTIVITY_MS = 5000;
  const inactivityTimeoutRef = useRef<number | null>(null);
  const lastInputRef = useRef<number>(0);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimeoutRef.current !== null) {
      window.clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
  }, []);

  const scheduleIdle = useCallback(() => {
    clearInactivityTimer();
    inactivityTimeoutRef.current = window.setTimeout(() => {
      if (Date.now() - lastInputRef.current >= INACTIVITY_MS) {
        setIdle(true);
      }
    }, INACTIVITY_MS);
  }, [clearInactivityTimer]);

  const touchActivity = useCallback(() => {
    if (!started || finished) return;
    lastInputRef.current = Date.now();
    setIdle(false);
    scheduleIdle();
  }, [started, finished, scheduleIdle]);

  useEffect(() => {
    if (started && !finished) {
      lastInputRef.current = Date.now();
      setIdle(false);
      scheduleIdle();
    } else {
      clearInactivityTimer();
      setIdle(false);
    }
    return () => clearInactivityTimer();
  }, [started, finished, scheduleIdle, clearInactivityTimer]);

  const handleRestart = useCallback(() => {
    restart();

    inputRef.current?.focus();

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [restart]);

  return (
    <div className="px-30 bg-background h-screen">
      {/* <header></header> */}
      <main className="flex items-center flex-col">
        <TestConfig
          duration={duration}
          onChangeDuration={(s) => {
            setDuration(s);
            requestAnimationFrame(() => {
              inputRef.current?.focus();
            });
          }}
        />
        <div
          id="typingTest"
          className="relative pt-75 flex flex-col items-center justify-center outline-none"
        >
          <div className="grid grid-cols-3 items-center w-full">
            <div className="justify-self-start">
              <div
                className={`transition-opacity duration-300 ${started && !finished ? "opacity-100" : "opacity-0"}`}
              >
                <CountdownTimer timeLeft={timeLeft} />
              </div>
            </div>
            <div
              className={`justify-self-center transition-opacity duration-300 ${!started ? "opacity-100" : finished ? "opacity-100" : "opacity-0"}`}
            >
              <LangChoice
                onCloseFucusTyping={() =>
                  requestAnimationFrame(() => inputRef.current?.focus())
                }
              />
            </div>
            <div />
          </div>
          <div
            className="relative w-full typing-area"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="relative z-10">
              <WordList
                words={words}
                statuses={statuses}
                extras={extras}
                currentWordIndex={currentWordIndex}
                currentCharIndex={currentCharIndex}
                started={started}
                finished={finished}
                idle={idle}
              />
              <ModalBlur />
            </div>
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
              onKeyDown={(e) => {
                touchActivity();
                handleKeyDown(e);
              }}
              onBeforeInput={(e) => {
                touchActivity();
                handleBeforeInput(e);
              }}
              onChange={(e) => {
                // keep empty
                e.currentTarget.value = "";
              }}
              onFocus={() => {
                if (started && !finished) touchActivity();
              }}
              onBlur={clearInactivityTimer}
              defaultValue=""
              className="absolute inset-0 z-0 opacity-0 pointer-events-none"
              aria-hidden
            />
          </div>

          <div
            className={`transition-opacity duration-300`}
            onClick={handleRestart}
          >
            <RestartButton />
          </div>
          <div
            className={`relative z-10 mt-4 flex items-center gap-6 text-sub transition-opacity duration-300 ${finished ? "opacity-100" : "opacity-0"}`}
          >
            <div className="text-lg font-medium">
              WPM: <span className="text-text">{Math.round(wpm)}</span>
            </div>
            <div className="text-lg font-medium">
              ACC: <span className="text-text">{Math.round(acc)}%</span>
            </div>
          </div>
        </div>
      </main>
      <div
        className={`mt-55 transition-opacity duration-300 ${!started ? "opacity-100" : finished ? "opacity-100" : "opacity-0"}`}
      >
        <ThemeChoice
          onCloseFucusTyping={() =>
            requestAnimationFrame(() => inputRef.current?.focus())
          }
        />
      </div>
    </div>
  );
}
// duration controlled via TestConfig
