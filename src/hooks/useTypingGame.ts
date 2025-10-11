import i18n from "@/i18n";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// TODO: сделать оптимизацию хука
export type LetterStatus = "pending" | "correct" | "incorrect";
export type TestMode = "time" | "words";

//TODO: починить китайский и японский язык

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
  includeNumbers = false,
  includePunctuation = false
) {
  const { t } = useTranslation();

  const dictionary = useMemo(() => {
    const text = t("text")
    if (["zh", "ja"].includes(i18n.language))  {
      return text.split("")
    }
    return text.split(" ")
  }, [t, i18n.language])

  const punctuationOptions = [
    {token: ".", weight: 0.5},
    {token: ",", weight: 0.85},
    {token: "?", weight: 0.25},
    {token: "!", weight: 0.25},
    {token: "...", weight: 0.1},
    {token: ":", weight: 0.15},
    {token: "(", weight: 0.2},
    {token: "'", weight: 0.2},
    {token: "\"", weight: 0.2},
  ]
  
  const pairedPunctuation = [
    { open: "(", close: ")" },
    { open: "[", close: "]" },
    { open: "\"", close: "\"" },
    { open: "'", close: "'" },
  ];

  const pickedWeighted = <T extends {weight: number}>(options: T[]): T => {
    const total = options.reduce((sum, opt) => sum + opt.weight, 0) 
    let r = Math.random() * total
    for (const opt of options) {
      r -= opt.weight
      if (r <= 0) return opt
    }
    return options[options.length - 1]
  }
  
  const punctuationPool = punctuationOptions
    .map((opt) => opt.token)
    .concat(pairedPunctuation.map((pair) => pair.close));

  const isClosingChar = (char: string) => 
    pairedPunctuation.some(
      (pair) => pair.close === char && pair.open !== char,
    )
  
  const findPairByOpen = (char: string) =>
    pairedPunctuation.find((pair) => pair.open === char);

  const isPunctuation = (token: string) => punctuationPool.includes(token)

  const pickPunctuation = () =>
    pickedWeighted(punctuationOptions).token

  const pickNumbers = () => {
    const digits = Math.floor(Math.random() * 3) + 1
    let value = ''
    for (let i = 0; i < digits; i++) {
      value += Math.floor(Math.random() * 10).toString()
    }
    return value
  }

  const generateWords = useCallback((): string[] => {
    const merged: string[] = []
    let wordsSinceStrong = 0

    const strongEndings = [".", "!", "?", "...", ";"];
    let pendingWrap: {open: string; close: string} | null = null

    while (merged.length < wordCount) {
      while(merged.length === 0) {
        const token = dictionary[Math.floor(Math.random() * dictionary.length)]
        merged.push(token)
        wordsSinceStrong = 1
      }

      let token: string

      if (includeNumbers && Math.random() < 0.18) {
        token = pickNumbers()
      } else if (includePunctuation && Math.random() < 0.24) {
        token = pickPunctuation()
      } else {
        token = dictionary[Math.floor(Math.random() * dictionary.length)]
      }

      if (includePunctuation && isPunctuation(token)) {
        if (isClosingChar(token)) {
          continue
        }

        const pair = findPairByOpen(token)
        if (pair) {

          if (merged.length === 0) continue

          if (merged.length > 0) {
            const lastWord = merged[merged.length - 1];
            const endsWithStrong = strongEndings.some((ending) =>
              lastWord.endsWith(ending),
            );
            if (endsWithStrong) {
              pendingWrap = null;
              continue;
            }
          }
          pendingWrap = pair;
          continue;
        }


        if (merged.length === 0) {
          continue
        }
        const lastWord = merged[merged.length - 1];
        const lastTail = lastWord.slice(-3);
        const alreadyEndsWith = punctuationPool.some((ending) =>
          lastTail.endsWith(ending),
        );
        if (alreadyEndsWith) continue;
        
        const isStrong = strongEndings.includes(token)
        if (isStrong && wordsSinceStrong < 3) {
          continue
        }

        merged[merged.length - 1] += token
        if (isStrong) {
          wordsSinceStrong = 0
        }
        continue
      }
      
      if (pendingWrap) {
        token = pendingWrap.open + token + pendingWrap.close
        pendingWrap = null
      }
      merged.push(token)
      wordsSinceStrong += 1
      
      for (let i = 0; i < merged.length-1; i++) {
        const current = merged[i]
        const next = merged[i+1]
        if (!next) continue

        const endsWithStrong = strongEndings.some((ending)=>
          current.endsWith(ending)
        )
        if (!endsWithStrong) continue
        merged[i + 1] = next.charAt(0).toUpperCase() + next.slice(1)
      }

    }

    if (includePunctuation && merged.length > 0) {
      const first = merged[0]
      if (first && first.length > 0) {
        merged[0] = first.charAt(0).toUpperCase() + first.slice(1)
      }
    }

    return merged
  }, [dictionary, wordCount, includeNumbers, includePunctuation])

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
  }, [generateWords, durationSeconds, includeNumbers, includePunctuation]);

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
    const {
    wpm,
    acc,
    correctLetters,
    incorrectLetters,
    extraLetters,
    totalTyped,
  } = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    let extrasCount = 0;

    for (let wi = 0; wi < state.statuses.length; wi++) {
      const row = state.statuses[wi];
      for (let i = 0; i < row.length; i++) {
        const st = row[i];
        if (st === "correct") correct++;
        else if (st === "incorrect") incorrect++;
      }
    }

    for (let wi = 0; wi < state.extras.length; wi++) {
      extrasCount += state.extras[wi].length;
    }

    const typed = correct + incorrect + extrasCount;

    const elapsedSec =
      mode === "time"
        ? Math.max(0, Math.min(durationSeconds, elapsedMs / 1000))
        : elapsedMs / 1000;

    const minutes = elapsedSec > 0 ? elapsedSec / 60 : 0;
    const wpmValue = minutes > 0 ? (correct / 5) / minutes : 0;
    const accValue = typed > 0 ? (correct / typed) * 100 : 100;

    return {
      wpm: wpmValue,
      acc: accValue,
      correctLetters: correct,
      incorrectLetters: incorrect,
      extraLetters: extrasCount,
      totalTyped: typed,
    };
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

  const navigate = useNavigate()
  const totalSeconds = elapsedMs / 1000

  useEffect(()=>{
    if (!finished) return    
    navigate("/results", {
      state: {
        summary: {
          wpm,
          acc,
          wordsCompleted,
          totalWords,
          durationSeconds,
          mode,
          includeNumbers,
          includePunctuation,
          totalSeconds,
          correctLetters,
          incorrectLetters,
          extraLetters,
          totalTyped,
          language: i18n.language
        }
      }
    })
  }, [finished, navigate, wpm, acc, wordsCompleted, totalWords, durationSeconds, includeNumbers, includePunctuation, i18n.language])

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
