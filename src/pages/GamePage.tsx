import WordList from "@/components/WordList";
import { LangChoice } from "@/components/LangChoice.tsx";
import { ThemeChoice } from "@/components/ThemeChoice";
import CountdownTimer from "@/components/CountdownTimer";
import RestartButton from "@/components/restartButton/RestartButton.tsx";
import useTypingGame, { type LetterStatus } from "@/hooks/useTypingGame";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ModalBlur from "@/components/ModalBlur";
import TestConfig from "@/components/TestConfig";
import {
  defaultSettings,
  useGameSettingsStore,
} from "@/store/useGameSettingsStore";

export default function GamePage() {
  const SESSION_FLAG = "typing-test-first-visit";

  const {
    duration,
    wordCount,
    mode,
    withNumbers,
    withPunctuation,
    setDuration,
    setWordCount,
    setMode,
    setWithNumbers,
    setWithPunctuation,
  } = useGameSettingsStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasVisited = window.sessionStorage.getItem(SESSION_FLAG);
    if (hasVisited) return;

    setDuration(defaultSettings.duration);
    setWordCount(defaultSettings.wordCount);
    setMode(defaultSettings.mode);
    setWithNumbers(defaultSettings.withNumbers);
    setWithPunctuation(defaultSettings.withPunctuation);
    window.sessionStorage.setItem(SESSION_FLAG, "1");
  }, [setDuration, setWordCount, setMode, setWithNumbers, setWithPunctuation]);

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
    wordsCompleted,
    totalWords,
  } = useTypingGame(wordCount, duration, mode, withNumbers, withPunctuation);

  const [renderWords, setRenderWords] = useState<string[]>([]);
  const [renderStatuses, setRenderStatuses] = useState<LetterStatus[][]>([]);
  const [renderExtras, setRenderExtras] = useState<string[][]>([]);
  const [wordsPhase, setWordsPhase] = useState<
    "initial" | "idle" | "fade-out" | "fade-in"
  >("initial");
  const hasMountedRef = useRef(false);
  const fadeOutTimeoutRef = useRef<number | null>(null);
  const fadeInTimeoutRef = useRef<number | null>(null);
  const WORDS_FADE_MS = 140;

  const wordsMatch = useCallback(
    (a: string[], b: string[]) =>
      a.length === b.length && a.every((word, idx) => word === b[idx]),
    [],
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      setRenderWords(words);
      setRenderStatuses(statuses);
      setRenderExtras(extras);
      setWordsPhase("fade-in");
      return;
    }

    if (wordsMatch(renderWords, words)) {
      setRenderStatuses(statuses);
      setRenderExtras(extras);
      return;
    }

    setWordsPhase("fade-out");
    if (fadeOutTimeoutRef.current !== null) {
      window.clearTimeout(fadeOutTimeoutRef.current);
    }
    fadeOutTimeoutRef.current = window.setTimeout(() => {
      setRenderWords(words);
      setRenderStatuses(statuses);
      setRenderExtras(extras);
      setWordsPhase("fade-in");
    }, WORDS_FADE_MS);

    return () => {
      if (fadeOutTimeoutRef.current !== null) {
        window.clearTimeout(fadeOutTimeoutRef.current);
        fadeOutTimeoutRef.current = null;
      }
    };
  }, [words, statuses, extras, renderWords, wordsMatch]);

  useEffect(() => {
    if (wordsPhase !== "fade-in") return;
    if (fadeInTimeoutRef.current !== null) {
      window.clearTimeout(fadeInTimeoutRef.current);
    }
    fadeInTimeoutRef.current = window.setTimeout(
      () => setWordsPhase("idle"),
      WORDS_FADE_MS,
    );
    return () => {
      if (fadeInTimeoutRef.current !== null) {
        window.clearTimeout(fadeInTimeoutRef.current);
        fadeInTimeoutRef.current = null;
      }
    };
  }, [wordsPhase]);

  useEffect(() => {
    return () => {
      if (fadeOutTimeoutRef.current !== null) {
        window.clearTimeout(fadeOutTimeoutRef.current);
      }
      if (fadeInTimeoutRef.current !== null) {
        window.clearTimeout(fadeInTimeoutRef.current);
      }
    };
  }, []);

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
        <div
          className={`transition-opacity duration-300 ${
            !started ? "opacity-100" : "opacity-0"
          }`}
        >
          <TestConfig
            duration={duration}
            onChangeDuration={(s) => {
              setDuration(s);
              restart();
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
            wordCount={wordCount}
            onWordCount={(n) => {
              setWordCount(n);
              restart();
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
            mode={mode}
            onModeChange={(nextMode) => {
              setMode(nextMode);
              setWordCount(100);
              restart();
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
            withNumbers={withNumbers}
            onToggleNumbers={(next) => {
              setWithNumbers(next);
              restart();
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
            withPunctuation={withPunctuation}
            onTogglePunctuation={(next) => {
              setWithPunctuation(next);
              restart();
              requestAnimationFrame(() => {
                inputRef.current?.focus();
              });
            }}
          />
        </div>
        <div
          id="typingTest"
          className={`relative pt-75 flex flex-col items-center justify-center outline-none transition-opacity duration-150 ${
            wordsPhase === "fade-out" || wordsPhase === "initial"
              ? "opacity-0"
              : "opacity-100"
          }`}
        >
          <div className="grid grid-cols-3 items-center w-full">
            <div className="justify-self-start">
              {mode === "time" ? (
                <div
                  className={`transition-opacity duration-300 ${
                    started && !finished ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <CountdownTimer timeLeft={timeLeft} />
                </div>
              ) : (
                <div
                  className={`text-main text-[2rem] transition-opacity duration-300 ${
                    started && !finished ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {wordsCompleted} / {totalWords}
                </div>
              )}
            </div>
            <div
              className={`justify-self-center transition-opacity duration-300 ${!started ? "opacity-100" : "opacity-0"}`}
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
                words={renderWords}
                statuses={renderStatuses}
                extras={renderExtras}
                currentWordIndex={currentWordIndex}
                currentCharIndex={currentCharIndex}
                started={started}
                finished={finished}
                idle={idle}
                mode={mode}
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
        </div>
      </main>
      <div
        className={`mt-55 transition-opacity duration-300 ${!started ? "opacity-100" : "opacity-0"}`}
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
