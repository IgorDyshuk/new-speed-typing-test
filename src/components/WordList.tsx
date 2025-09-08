import type { LetterStatus } from "@/hooks/useTypingGame";
import { useRef } from "react";
import TypingCaret from "./TypingCaret";

//TODO: добавть режимы в котором можно в печатаемый текст добавлять цифры и знаки припинания
export default function WordList({
  words,
  statuses,
  extras,
  currentWordIndex,
  currentCharIndex,
  started,
  idle,
}: {
  words: string[];
  statuses: LetterStatus[][];
  extras: string[][];
  currentWordIndex: number;
  currentCharIndex: number;
  started: boolean;
  idle: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-wrap overflow-hidden max-h-[10.5rem]"
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

        // TODO: Сделать прокуртку слов, когда курсор находится на последней букве на второй линиии, прокручивать слова на одну линию вверх, тоесть курсор сначала проходит полностью первую линию потому вторую и затем слова всегда прокручиваются и мы играем только на второй линии (чтобы узнать на сколько прокурчивать думаю сделть юзеффект с рефом на первой слово, чтобы узнать его высоту и прокурчивать линию на это выстоу)
        return (
          <span
            key={wi}
            className={`inline-block mx-[0.3em] my-[0.25em] text-[32px] font-[450] ${shouldOutline ? "shadow-[inset_0_-2px_0_0_var(--color-error)]" : ""}`}
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
                  className={`letter ${colorClass}`}
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
      <TypingCaret
        containerRef={containerRef}
        deps={[
          currentWordIndex,
          currentCharIndex,
          extras[currentWordIndex]?.length ?? 0,
          words[currentWordIndex],
          words.length,
        ]}
        started={started}
        idle={idle}
      />
    </div>
  );
}
