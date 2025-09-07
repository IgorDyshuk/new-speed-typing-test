import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type LetterStatus = "pending" | "correct" | "incorrect";

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

export default function useTypingGame(wordCount: number = 100, durationSeconds: number = 30) {
  const { t, i18n } = useTranslation();

  const dictionary = useMemo(() => t("text").split(" "), [t, i18n.language]);

  const generateWords = useCallback((): string[] => {
    const res: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      res.push(dictionary[Math.floor(Math.random() * dictionary.length)]);
    }
    return res;
  }, [dictionary, wordCount]);

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

  // Timer state
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [finished, setFinished] = useState(false);

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
  }, [generateWords]);

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
  }, [generateWords, durationSeconds]);

  // Timer effect
  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [started, finished]);

  // Allowed alphabet sourced from locale (fallback to Latin+Cyrillic regex)
  const alphabetSet = useMemo(() => {
    const alphabet = t("alphabet", { defaultValue: "" });
    // If key is missing, i18n may return the key name; guard against that
    if (alphabet && alphabet !== "alphabet") {
      const set = new Set<string>();
      for (const ch of alphabet) set.add(ch);
      set.add(" "); // always allow space
      return set;
    }
    return null;
  }, [t, i18n.language]);

  const defaultAllowRegex = useMemo(() => /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ ]$/, []);

  const allowKey = (key: string) => {
    if (alphabetSet) return key.length === 1 && alphabetSet.has(key);
    return defaultAllowRegex.test(key);
  };


  //TODO: добавть результаты, (wpm и acc) и отображать их снизу блока печатаемых букв
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Block any input when game finished
      if (finished) {
        e.preventDefault();
        return;
      }
      const key = e.key;

      // Ignore when no words
      if (state.words.length === 0) return;

      const isSpace = key === " ";
      const isBackspace = key === "Backspace";
      // Windows: Ctrl+Backspace, macOS: Option(Alt)+Backspace
      const isWordBackspace = isBackspace && (e.ctrlKey || e.altKey);
      if (e.metaKey) return;

      if (isBackspace) {
        e.preventDefault();
      } else if ((e.altKey || e.metaKey || !allowKey(key)) && !isSpace) {
        e.preventDefault();
        return;
      }

      // Word underline on mistakes is handled in WordList by checking
      // statuses[wi] for any "incorrect" or extras[wi].length > 0.
      setState((prev) => {
        let { words, currentWordIndex, currentCharIndex } = prev;
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
            // Clear all before cursor in current word
            for (let i = 0; i < currentCharIndex; i++) {
              wordStatuses[i] = "pending";
            }
            // Clear all extras in current word
            extrasCopy[currentWordIndex] = [];
            return {
              words,
              currentWordIndex,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }

          if (hasPrev) {
            // Move back and clear previous word fully regardless of errors
            statusesCopy[currentWordIndex - 1] = Array<LetterStatus>(
              words[currentWordIndex - 1].length,
            ).fill("pending");
            extrasCopy[currentWordIndex - 1] = [];
            return {
              words,
              currentWordIndex: currentWordIndex - 1,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }

          return {
            ...prev,
            statuses: statusesCopy,
            extras: extrasCopy,
          };
        }

        if (isBackspace) {
          // Backspace behavior
          if (wordExtras.length > 0) {
            wordExtras.pop();
            return {
              words,
              currentWordIndex,
              currentCharIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }

          if (currentCharIndex > 0) {
            // Move back one expected letter and clear its status
            const prevIndex = currentCharIndex - 1;
            wordStatuses[prevIndex] = "pending";
            return {
              words,
              currentWordIndex,
              currentCharIndex: prevIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }

          if (hasPrev) {
            // Move to previous word regardless of errors/extras
            const newWordIndex = currentWordIndex - 1;
            const newWord = words[newWordIndex];
            const newStatuses = statusesCopy[newWordIndex];
            const newExtras = extrasCopy[newWordIndex];

            if (newExtras.length > 0) {
              // Remove last extra on previous word
              newExtras.pop();
              return {
                words,
                currentWordIndex: newWordIndex,
                currentCharIndex: newWord.length, // after last expected letter
                statuses: statusesCopy,
                extras: extrasCopy,
              };
            } else {
              // Find last typed letter in prev word and clear it (or place at 0)
              let idx = -1;
              for (let i = newStatuses.length - 1; i >= 0; i--) {
                if (newStatuses[i] !== "pending") {
                  idx = i;
                  break;
                }
              }
              if (idx === -1) {
                // nothing typed previously; stay at start
                idx = 0;
              } else {
                newStatuses[idx] = "pending";
              }
              return {
                words,
                currentWordIndex: newWordIndex,
                currentCharIndex: idx,
                statuses: statusesCopy,
                extras: extrasCopy,
              };
            }
          }

          return {
            ...prev,
            statuses: statusesCopy,
            extras: extrasCopy,
          };
        }

        if (isSpace) {
          // Ignore space at beginning of word
          if (currentCharIndex === 0) {
            e.preventDefault();
            return {
              ...prev,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }

          // Mark untyped expected letters as incorrect
          for (let i = currentCharIndex; i < currentWord.length; i++) {
            if (wordStatuses[i] === "pending") {
              wordStatuses[i] = "incorrect";
            }
          }

          // Move to next word if exists
          if (!atLastWord) {
            return {
              words,
              currentWordIndex: currentWordIndex + 1,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          } else {
            // Last word: stay on it, but do not add extra space
            e.preventDefault();
            return {
              words,
              currentWordIndex,
              currentCharIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }
        }

        if (isLetter) {
          if (!started) setStarted(true);
          const expected = currentWord[currentCharIndex] ?? "";
          if (currentCharIndex < currentWord.length) {
            wordStatuses[currentCharIndex] = key === expected ? "correct" : "incorrect";
            return {
              words,
              currentWordIndex,
              currentCharIndex: currentCharIndex + 1,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }
          // After word end: record extra letter
          else {
            wordExtras.push(key);
          } 
          return {
            words,
            currentWordIndex,
            currentCharIndex,
            statuses: statusesCopy,
            extras: extrasCopy,
          };
        }

        return {
          ...prev,
          statuses: statusesCopy,
          extras: extrasCopy,
        };
      });
    },
    [state.words.length, finished, started],
  );

  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      // Normalize InputEvent fields
      const ev = e.nativeEvent as unknown as InputEvent;
      const type = (ev && (ev as any).inputType) || "";
      const data = (ev && (ev as any).data) || "";

      // Only handle basic cases: insert text/space, delete backward, delete word backward
      const isDelete = type === "deleteContentBackward";
      const isDeleteWord = type === "deleteWordBackward";
      const isInsert = type === "insertText" || type === "insertCompositionText";

      // Let browser handle other input types
      if (!isDelete && !isDeleteWord && !isInsert) return;

      // Prevent actual input value changes; we render from state only
      e.preventDefault();

      // Block input when game finished
      if (finished) return;

      // Map to key handling
      const key = isInsert ? (data || "") : "";
      const isSpace = key === " ";
      const isLetter = isInsert && key.length > 0 && key !== " ";

      setState((prev) => {
        let { words, currentWordIndex, currentCharIndex } = prev;
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
            return {
              words,
              currentWordIndex,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }
          if (hasPrev) {
            statusesCopy[currentWordIndex - 1] = Array<LetterStatus>(
              words[currentWordIndex - 1].length,
            ).fill("pending");
            extrasCopy[currentWordIndex - 1] = [];
            return {
              words,
              currentWordIndex: currentWordIndex - 1,
              currentCharIndex: 0,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }
          return { ...prev, statuses: statusesCopy, extras: extrasCopy };
        }

        if (isDelete) {
          if (wordExtras.length > 0) {
            wordExtras.pop();
            return {
              words,
              currentWordIndex,
              currentCharIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }
          if (currentCharIndex > 0) {
            const prevIndex = currentCharIndex - 1;
            wordStatuses[prevIndex] = "pending";
            return {
              words,
              currentWordIndex,
              currentCharIndex: prevIndex,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }
          if (hasPrev) {
            const newWordIndex = currentWordIndex - 1;
            const newWord = words[newWordIndex];
            const newStatuses = statusesCopy[newWordIndex];
            const newExtras = extrasCopy[newWordIndex];
            if (newExtras.length > 0) {
              newExtras.pop();
              return {
                words,
                currentWordIndex: newWordIndex,
                currentCharIndex: newWord.length,
                statuses: statusesCopy,
                extras: extrasCopy,
              };
            } else {
              let idx = -1;
              for (let i = newStatuses.length - 1; i >= 0; i--) {
                if (newStatuses[i] !== "pending") {
                  idx = i;
                  break;
                }
              }
              if (idx === -1) idx = 0;
              else newStatuses[idx] = "pending";
              return {
                words,
                currentWordIndex: newWordIndex,
                currentCharIndex: idx,
                statuses: statusesCopy,
                extras: extrasCopy,
              };
            }
          }
          return { ...prev, statuses: statusesCopy, extras: extrasCopy };
        }

        if (isInsert) {
          // Start timer only on letters, not on spaces
          if (isLetter && !started) setStarted(true);
          if (currentCharIndex < currentWord.length) {
            const expected = currentWord[currentCharIndex] ?? "";
            wordStatuses[currentCharIndex] = key === expected ? "correct" : "incorrect";
            return {
              words,
              currentWordIndex,
              currentCharIndex: currentCharIndex + 1,
              statuses: statusesCopy,
              extras: extrasCopy,
            };
          }
          // extras
          if (isLetter || isSpace) {
            wordExtras.push(key);
          }
          return {
            words,
            currentWordIndex,
            currentCharIndex,
            statuses: statusesCopy,
            extras: extrasCopy,
          };
        }

        return { ...prev, statuses: statusesCopy, extras: extrasCopy };
      });
    },
    [state.words.length],
  );

  return {
    ...state,
    restart,
    handleKeyDown,
    handleBeforeInput,
    // timer
    started,
    timeLeft,
    finished,
  };
}
