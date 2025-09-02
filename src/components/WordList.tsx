import type { LetterStatus } from "@/hooks/useTypingGame";

export default function WordList({
  words,
  statuses,
  extras,
  currentWordIndex,
  currentCharIndex,
}: {
  words: string[];
  statuses: LetterStatus[][];
  extras: string[][];
  currentWordIndex: number;
  currentCharIndex: number;
}) {
  return (
    <div className="flex flex-wrap overflow-hidden max-h-[12rem]">
      {words.map((word, wi) => {
        const letters = word.split("");
        const letterStatuses = statuses[wi] || [];
        const extraChars = extras[wi] || [];
        const isCurrentWord = wi === currentWordIndex;

        return (
          <span
            key={wi}
            className="inline-block mx-[0.3em] my-[0.25em] text-[32px] font-[450]"
          >
            {letters.map((ch, ci) => {
              const st = letterStatuses[ci] ?? "pending";
              const isCurrent = isCurrentWord && ci === currentCharIndex;
              let colorClass = "text-sub";
              if (st === "correct") colorClass = "text-main";
              if (st === "incorrect") colorClass = "text-error";
              const underline = isCurrent ? "border-b-2 border-caret" : "";
              return (
                <span
                  key={`${wi}_${ci}`}
                  className={`letter ${colorClass} ${underline}`}
                >
                  {ch}
                </span>
              );
            })}
            {extraChars.map((ex, idx) => (
              <span key={`ex_${wi}_${idx}`} className="letter text-error-extra">
                {ex}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
}
