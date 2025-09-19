import type { LetterStatus, TestMode } from "@/hooks/useTypingGame";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import TypingCaret from "./TypingCaret";

type WordListProps = {
  words: string[];
  statuses: LetterStatus[][];
  extras: string[][];
  currentWordIndex: number;
  currentCharIndex: number;
  started: boolean;
  finished: boolean;
  idle: boolean;
  mode: TestMode;
};

export default function WordList({
  words,
  statuses,
  extras,
  currentWordIndex,
  currentCharIndex,
  started,
  finished,
  idle,
  mode,
}: WordListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordsWrapRef = useRef<HTMLDivElement | null>(null);
  const firstWordRef = useRef<HTMLSpanElement | null>(null);
  const lineHeightRef = useRef<number>(0);
  const measuredRef = useRef(false);
  const [contentOffset, setContentOffset] = useState(0);

  // Measure line height once using the first word (height + vertical margins)
  useLayoutEffect(() => {
    const el = firstWordRef.current;
    if (!el || measuredRef.current) return;
    const style = window.getComputedStyle(el);
    const mt = parseFloat(style.marginTop || "0");
    const mb = parseFloat(style.marginBottom || "0");
    const h = el.offsetHeight + mt + mb;
    if (h > 0) {
      lineHeightRef.current = h;
      measuredRef.current = true;
    }
  }, []);

  const caretMetrics = useMemo(() => {
    const extraCount = extras[currentWordIndex]?.length ?? 0;
    const currentWord = words[currentWordIndex] ?? "";
    const totalWords = words.length;
    return { extraCount, currentWord, totalWords };
  }, [extras, words, currentWordIndex]);

  const { extraCount, currentWord, totalWords } = caretMetrics;

  // Auto-scroll by shifting words' margin-top when caret moves beyond second line
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const lh =
      lineHeightRef.current ||
      container.getBoundingClientRect().height / 3 ||
      48;

    const current = container.querySelector(
      '[data-current="true"]',
    ) as HTMLElement | null;
    if (!current) return;

    const cRect = container.getBoundingClientRect();
    const curRect = current.getBoundingClientRect();
    const relTop = curRect.top - cRect.top;

    // If caret reaches 3rd visible line, move content up by one line
    if (relTop >= lh * 2) {
      setContentOffset((prev) => prev - lh);
    }
  }, [currentWordIndex, currentCharIndex, extraCount, currentWord, totalWords]);

  // Reset content offset when test restarts (started becomes false with new words)
  useLayoutEffect(() => {
    if (!started) {
      setContentOffset(0);
    }
  }, [started, words.length]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden max-h-[10.5rem] words-blurred"
    >
      <div
        id="words"
        ref={wordsWrapRef}
        className={`flex flex-wrap ${mode === "words" ? "justify-start" : ""}`}
        style={{ marginTop: contentOffset }}
      >
        {words.map((word, wi) => {
          const letters = word.split("");
          const letterStatuses = statuses[wi] || [];
          const extraChars = extras[wi] || [];
          const isCurrentWord = wi === currentWordIndex;
          const hasError =
            extraChars.length > 0 ||
            letterStatuses.some((s) => s === "incorrect");
          const shouldOutline = wi < currentWordIndex && hasError;
          return (
            <span
              key={wi}
              ref={wi === 0 ? firstWordRef : undefined}
              className={`word inline-block mx-[0.3em] my-[0.25em] text-[32px] font-[450] ${isCurrentWord ? "current" : ""} ${shouldOutline ? "shadow-[inset_0_-2px_0_0_var(--color-error)]" : ""}`}
            >
              {letters.map((ch, ci) => {
                const st = letterStatuses[ci] ?? "pending";
                const isCurrent = isCurrentWord && ci === currentCharIndex;
                const isEndAnchor =
                  isCurrentWord &&
                  currentCharIndex === letters.length &&
                  extraChars.length === 0 &&
                  ci === letters.length - 1;
                let colorClass = "text-sub";
                if (st === "correct") colorClass = "text-text";
                if (st === "incorrect") colorClass = "text-error";
                return (
                  <span
                    key={`${wi}_${ci}`}
                    className={`letter ${colorClass} ${isCurrent ? "current" : ""}`}
                    data-current={isCurrent || isEndAnchor ? "true" : undefined}
                    data-side={
                      isEndAnchor ? "after" : isCurrent ? "before" : undefined
                    }
                  >
                    {ch}
                  </span>
                );
              })}
              {extraChars.map((ex, idx) => {
                const isLastExtra =
                  isCurrentWord && idx === extraChars.length - 1;
                return (
                  <span
                    key={`ex_${wi}_${idx}`}
                    className="letter text-error-extra"
                    data-current={isLastExtra ? "true" : undefined}
                    data-side={isLastExtra ? "after" : undefined}
                  >
                    {ex}
                  </span>
                );
              })}
            </span>
          );
        })}
      </div>
      <TypingCaret
        containerRef={containerRef}
        deps={[
          currentWordIndex,
          currentCharIndex,
          extraCount,
          currentWord,
          totalWords,
          contentOffset,
        ]}
        started={started}
        finished={finished}
        idle={idle}
      />
    </div>
  );
}
