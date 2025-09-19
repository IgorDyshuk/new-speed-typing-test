import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type LetterStatus = "pending" | "correct" | "incorrect";
export type TestMode = "time" | "words";


// TODO: переделать accuracy чтобы не считало побуквенно а по словам, чтобы если неправильно написал даже одну букву в слове то не считать слово неправилным полностью
export type TypingState = {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number; // index in expected word (next expected letter)
  statuses: LetterStatus[][]; // per expected letter
  extras: string[][]; // chars typed after word end
};

function buildStatuses(words: string[]): LetterStatus[][] {
  return words.map((w) => Array<LetterStatus>(w.length).fill("pending"));
}

function buildExtras(words: string[]): string[][] {
  return words.map(() => []);
}

export default function useTypingGame(
  wordCount: number = 100,
  durationSeconds: number = 30,
  mode: TestMode = "time",
  includeNumbers = false
) {
  const { t } = useTranslation();

  const dictionary = useMemo(() => t("text").split(" "), [t]);

  const pickNumbers = () => {
    const digits = Math.floor(Math.random() * 3) + 1
    let value = ''
    for (let i = 0; i < digits; i++) {
      value += Math.floor(Math.random() * 10).toString()
    }
    return value
  }

  const generateWords = useCallback((): string[] => {
    const res: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      if (includeNumbers && Math.random() < 0.18) {
        res.push(pickNumbers())
      } else {
        res.push(dictionary[Math.floor(Math.random() * dictionary.length)]);
      }
    }
    return res;
  }, [dictionary, wordCount, includeNumbers]);

  const [state, setState] = useState<TypingState>(() => {
    const words = generateWords();
    return {
      words,
      currentWordIndex: 0,
      currentCharIndex: 0,
      statuses: buildStatuses(words),
      extras: buildExtras(words),
    };
  });

  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [finished, setFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const isWordsGameComplete = useCallback(
    (draft: TypingState) => {
      if (mode !== "words") return false;
      return draft.statuses.every((row) => row.every((st) => st !== "pending"));
    },
    [mode],
  );

  useEffect(() => {
    const words = generateWords();
    setState({
      words,
      currentWordIndex: 0,
      currentCharIndex: 0,
      statuses: buildStatuses(words),
      extras: buildExtras(words),
    });
    setStarted(false);
    setTimeLeft(durationSeconds);
    setFinished(false);
    setElapsedMs(0);
  }, [generateWords, durationSeconds]);

  const restart = useCallback(() => {
    const words = generateWords();
    setState({
      words,
      currentWordIndex: 0,
      currentCharIndex: 0,
      statuses: buildStatuses(words),
      extras: buildExtras(words),
    });
    setStarted(false);
    setTimeLeft(durationSeconds);
    setFinished(false);
    setElapsedMs(0);
  }, [generateWords, durationSeconds]);

  useEffect(() => {
    setStarted(false);
    setFinished(false);
    setTimeLeft(durationSeconds);
    setElapsedMs(0);
  }, [durationSeconds, mode]);

  useEffect(() => {
    if (mode !== "time" || !started || finished) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          setFinished(true);
          setElapsedMs(durationSeconds * 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [mode, started, finished, durationSeconds]);

  useEffect(() => {
    if (!started || finished) return;
    const id = window.setInterval(() => {
      setElapsedMs((prev) => prev + 100);
    }, 100);
    return () => window.clearInterval(id);
  }, [started, finished]);

  // Derived results: words per minute (wpm) and accuracy (acc)
  const { wpm, acc } = useMemo(() => {
    let typed = 0;
    let correct = 0;
    for (let wi = 0; wi < state.statuses.length; wi++) {
      const row = state.statuses[wi];
      for (let i = 0; i < row.length; i++) {
        const st = row[i];
        if (st !== "pending") typed++;
        if (st === "correct") correct++;
      }
    }
    for (let wi = 0; wi < state.extras.length; wi++) {
      typed += state.extras[wi].length;
    }

    const elapsedSec = (() => {
      if (mode === "time") {
        return Math.max(0, Math.min(durationSeconds, elapsedMs / 1000));
      }
      return elapsedMs / 1000;
    })();

    const minutes = elapsedSec > 0 ? elapsedSec / 60 : 0;
    const wpmValue = minutes > 0 ? (correct / 5) / minutes : 0;
    const accValue = typed > 0 ? (correct / typed) * 100 : 100;
    return { wpm: wpmValue, acc: accValue };
  }, [state.statuses, state.extras, elapsedMs, mode, durationSeconds]);

  const wordsCompleted = useMemo(() => {
    return state.statuses.reduce((total, row) => {
      return total + (row.every((st) => st !== "pending") ? 1 : 0);
    }, 0);
  }, [state.statuses]);

  const totalWords = state.words.length;

  useEffect(() => {
    if (mode === "words" && !finished && wordsCompleted >= totalWords) {
      setFinished(true);
    }
  }, [mode, finished, wordsCompleted, totalWords]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (finished) {
        e.preventDefault();
        return;
      }

      const key = e.key;
      if (state.words.length === 0) return;

      const isSpace = key === " ";
      const isBackspace = key === "Backspace";
      const isWordBackspace = isBackspace && (e.ctrlKey || e.altKey);
      if (e.metaKey) return;
      if (isBackspace) {
        e.preventDefault();
      }

      let shouldFinish = false;
      const finalize = (draft: TypingState) => {
        if (mode === "words" && isWordsGameComplete(draft)) {
          shouldFinish = true;
        }
        return draft;
      };

      setState((prev) => {
        const { words, currentWordIndex, currentCharIndex } = prev;
        const statusesCopy = prev.statuses.map((row) => [...row]);
        const extrasCopy = prev.extras.map((row) => [...row]);

        const currentWord = words[currentWordIndex];
        const atLastWord = currentWordIndex >= words.length - 1;
        const wordStatuses = statusesCopy[currentWordIndex];
        const wordExtras = extrasCopy[currentWordIndex];

        const hasPrev = currentWordIndex > 0;

        const isLetter = key.length === 1 && key !== " ";

        if (isWordBackspace) {
          e.preventDefault();

          if (currentCharIndex > 0 || wordExtras.length > 0) {
            for (let i = 0; i < currentCharIndex; i++) {
              wordStatuses[i] = "pending";
            }
            extrasCopy[currentWordIndex] = [];
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          if (hasPrev) {
            statusesCopy[currentWordIndex - 1] = Array<LetterStatus>(
              words[currentWordIndex - 1].length,
            ).fill("pending");
            extrasCopy[currentWordIndex - 1] = [];
            return finalize({
              words,
              currentWordIndex: currentWordIndex - 1,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          return finalize({
            ...prev,
            statuses: statusesCopy,
            extras: extrasCopy,
          });
        }

        if (isBackspace) {
          if (wordExtras.length > 0) {
            wordExtras.pop();
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          if (currentCharIndex > 0) {
            const prevIndex = currentCharIndex - 1;
            wordStatuses[prevIndex] = "pending";
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex: prevIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          if (hasPrev) {
            const newWordIndex = currentWordIndex - 1;
            const newWord = words[newWordIndex];
            const newStatuses = statusesCopy[newWordIndex];
            const newExtras = extrasCopy[newWordIndex];

            if (newExtras.length > 0) {
              newExtras.pop();
              return finalize({
                words,
                currentWordIndex: newWordIndex,
                currentCharIndex: newWord.length,
                statuses: statusesCopy,
                extras: extrasCopy,
              });
            } else {
              let idx = -1;
              for (let i = newStatuses.length - 1; i >= 0; i--) {
                if (newStatuses[i] !== "pending") {
                  idx = i;
                  break;
                }
              }
              if (idx === -1) {
                idx = 0;
              } else {
                newStatuses[idx] = "pending";
              }
              return finalize({
                words,
                currentWordIndex: newWordIndex,
                currentCharIndex: idx,
                statuses: statusesCopy,
                extras: extrasCopy,
              });
            }
          }

          return finalize({
            ...prev,
            statuses: statusesCopy,
            extras: extrasCopy,
          });
        }

        if (isSpace) {
          if (currentCharIndex === 0) {
            e.preventDefault();
            return finalize({
              ...prev,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          for (let i = currentCharIndex; i < currentWord.length; i++) {
            if (wordStatuses[i] === "pending") {
              wordStatuses[i] = "incorrect";
            }
          }

          if (!atLastWord) {
            return finalize({
              words,
              currentWordIndex: currentWordIndex + 1,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          } else {
            e.preventDefault();
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }
        }

        if (isLetter) {
          if (!started) setStarted(true);
          const expected = currentWord[currentCharIndex] ?? "";
          if (currentCharIndex < currentWord.length) {
            wordStatuses[currentCharIndex] = key === expected ? "correct" : "incorrect";
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex: currentCharIndex + 1,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }
          wordExtras.push(key);
          return finalize({
            words,
            currentWordIndex,
            currentCharIndex,
            statuses: statusesCopy,
            extras: extrasCopy,
          });
        }

        return finalize({
          ...prev,
          statuses: statusesCopy,
          extras: extrasCopy,
        });
      });

      if (shouldFinish && !finished) {
        setFinished(true);
      }
    },
    [state.words.length, finished, started, mode, isWordsGameComplete],
  );

  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const nativeEvent = e.nativeEvent as InputEvent;
      const type = nativeEvent?.inputType ?? "";
      const data = nativeEvent?.data ?? "";

      const isDelete = type === "deleteContentBackward";
      const isDeleteWord = type === "deleteWordBackward";
      const isInsert = type === "insertText" || type === "insertCompositionText";

      if (!isDelete && !isDeleteWord && !isInsert) return;

      e.preventDefault();

      if (finished) return;

      const key = isInsert ? (data || "") : "";
      const isSpace = key === " ";
      const isLetter = isInsert && key.length > 0 && key !== " ";

      let shouldFinish = false;
      const finalize = (draft: TypingState) => {
        if (mode === "words" && isWordsGameComplete(draft)) {
          shouldFinish = true;
        }
        return draft;
      };

      setState((prev) => {
        const { words, currentWordIndex, currentCharIndex } = prev;
        const statusesCopy = prev.statuses.map((row) => [...row]);
        const extrasCopy = prev.extras.map((row) => [...row]);

        const currentWord = words[currentWordIndex];
        const wordStatuses = statusesCopy[currentWordIndex];
        const wordExtras = extrasCopy[currentWordIndex];

        const hasPrev = currentWordIndex > 0;

        if (isDeleteWord) {
          if (currentCharIndex > 0 || wordExtras.length > 0) {
            for (let i = 0; i < currentCharIndex; i++) {
              wordStatuses[i] = "pending";
            }
            extrasCopy[currentWordIndex] = [];
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          if (hasPrev) {
            statusesCopy[currentWordIndex - 1] = Array<LetterStatus>(
              words[currentWordIndex - 1].length,
            ).fill("pending");
            extrasCopy[currentWordIndex - 1] = [];
            return finalize({
              words,
              currentWordIndex: currentWordIndex - 1,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          return finalize({
            ...prev,
            statuses: statusesCopy,
            extras: extrasCopy,
          });
        }

        if (isDelete) {
          if (wordExtras.length > 0) {
            wordExtras.pop();
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          if (currentCharIndex > 0) {
            const prevIndex = currentCharIndex - 1;
            wordStatuses[prevIndex] = "pending";
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex: prevIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          if (hasPrev) {
            const newWordIndex = currentWordIndex - 1;
            const newWord = words[newWordIndex];
            const newStatuses = statusesCopy[newWordIndex];
            const newExtras = extrasCopy[newWordIndex];

            if (newExtras.length > 0) {
              newExtras.pop();
              return finalize({
                words,
                currentWordIndex: newWordIndex,
                currentCharIndex: newWord.length,
                statuses: statusesCopy,
                extras: extrasCopy,
              });
            } else {
              let idx = -1;
              for (let i = newStatuses.length - 1; i >= 0; i--) {
                if (newStatuses[i] !== "pending") {
                  idx = i;
                  break;
                }
              }
              if (idx === -1) {
                idx = 0;
              } else {
                newStatuses[idx] = "pending";
              }
              return finalize({
                words,
                currentWordIndex: newWordIndex,
                currentCharIndex: idx,
                statuses: statusesCopy,
                extras: extrasCopy,
              });
            }
          }

          return finalize({
            ...prev,
            statuses: statusesCopy,
            extras: extrasCopy,
          });
        }

        if (isSpace) {
          if (currentCharIndex === 0) {
            return finalize({
              ...prev,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          for (let i = currentCharIndex; i < currentWord.length; i++) {
            if (wordStatuses[i] === "pending") {
              wordStatuses[i] = "incorrect";
            }
          }

          if (currentWordIndex < words.length - 1) {
            return finalize({
              words,
              currentWordIndex: currentWordIndex + 1,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }

          return finalize({
            words,
            currentWordIndex,
            currentCharIndex,
            statuses: statusesCopy,
            extras: extrasCopy,
          });
        }

        if (isLetter) {
          if (!started) setStarted(true);
          const expected = currentWord[currentCharIndex] ?? "";
          if (currentCharIndex < currentWord.length) {
            wordStatuses[currentCharIndex] = key === expected ? "correct" : "incorrect";
            return finalize({
              words,
              currentWordIndex,
              currentCharIndex: currentCharIndex + 1,
              statuses: statusesCopy,
              extras: extrasCopy,
            });
          }
          wordExtras.push(key);
          return finalize({
            words,
            currentWordIndex,
            currentCharIndex,
            statuses: statusesCopy,
            extras: extrasCopy,
          });
        }

        return finalize({
          ...prev,
          statuses: statusesCopy,
          extras: extrasCopy,
        });
      });

      if (shouldFinish && !finished) {
        setFinished(true);
      }
    },
    [finished, mode, isWordsGameComplete, started],
  );

  return {
    words: state.words,
    statuses: state.statuses,
    extras: state.extras,
    currentWordIndex: state.currentWordIndex,
    currentCharIndex: state.currentCharIndex,
    handleKeyDown,
    handleBeforeInput,
    restart,
    started,
    timeLeft,
    finished,
    wpm,
    acc,
    wordsCompleted,
    totalWords,
  };
}
