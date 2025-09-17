import { AtSign, Hash, Clock, CaseUpper, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TestConfig({
  duration,
  onChangeDuration,
  wordCount,
  onWordCount,
}: {
  duration: number;
  onChangeDuration: (seconds: number) => void;
  wordCount: number;
  onWordCount: (n: number) => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customStr, setCustomStr] = useState("");
  const [lastCustom, setLastCustom] = useState<{
    time: number | null;
    words: number | null;
  }>({
    time: null,
    words: null,
  });
  const [panel, setPanel] = useState<"time" | "words">("time");
  const words = [10, 25, 50, 100];
  const times = [10, 30, 60, 120];

  const isTimePanel = panel === "time";
  const isWordsPanel = panel === "words";

  const panelClasses = (active: boolean) =>
    `flex w-full items-center gap-3 transition-all duration-300 ${
      active
        ? "opacity-100 translate-y-0 pointer-events-auto relative"
        : "opacity-0 translate-y-2 pointer-events-none absolute inset-0"
    }`;

  const timeInputRef = useRef<HTMLInputElement | null>(null);
  const wordsInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (customOpen) {
      requestAnimationFrame(() => {
        const target =
          panel === "time" ? timeInputRef.current : wordsInputRef.current;
        target?.focus();
        target?.select();
      });
    }
  }, [customOpen, panel]);

  const commitCustom = () => {
    const s = parseInt(customStr.trim(), 10);
    if (!Number.isNaN(s) && s > 0) {
      if (panel === "time") {
        const isPreset = times.includes(s);
        onChangeDuration(s);
        setLastCustom((prev) => ({ ...prev, time: isPreset ? null : s }));
      } else {
        const isPreset = words.includes(s);
        onWordCount(s);
        setLastCustom((prev) => ({ ...prev, words: isPreset ? null : s }));
      }
      setCustomOpen(false);
      setCustomStr("");
    }
  };

  return (
    <div className="flex items-center gap-4 bg-sub-alt text-sub w-fit text-sm pl-8 pr-4 py-2 rounded-md">
      <button
        type="button"
        className="flex items-center gap-0.5 hover:cursor-pointer"
      >
        <AtSign size={14} className="pt-[2px]" />
        punctuations
      </button>
      <button
        type="button"
        className={`flex items-center gap-0.5 hover:cursor-pointer`}
      >
        <Hash size={15} />
        numbers
      </button>
      <div className="w-2 h-6 bg-background rounded-2xl" />
      <button
        type="button"
        onClick={() => {
          setPanel("time");
          setCustomOpen(false);
          setCustomStr("");
        }}
        className={`flex items-center gap-1 transition-colors duration-200 hover:cursor-pointer ${panel === "time" ? "text-main" : ""}`}
      >
        <Clock size={15} />
        time
      </button>
      <button
        type="button"
        onClick={() => {
          setPanel("words");
          setCustomOpen(false);
          setCustomStr("");
        }}
        className={`flex items-center gap-0.5 transition-colors duration-200 hover:cursor-pointer ${panel === "words" ? "text-main" : ""}`}
      >
        <CaseUpper size={24} className="pt-[5px]" /> words
      </button>
      <div className="w-2 h-6 bg-background rounded-2xl" />
      <div className="relative min-h-[32px] min-w-[200px] flex-1">
        <div className={panelClasses(isTimePanel)}>
          {times.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                onChangeDuration(t);
                setLastCustom((prev) => ({ ...prev, time: null }));
              }}
              aria-pressed={duration === t}
              className={`px-2 py-1 rounded-sm transition-colors ${
                duration === t
                  ? "bg-main text-background"
                  : "hover:bg-sub/20 hover:cursor-pointer text-sub"
              }`}
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setCustomOpen((v) => !v);
              setCustomStr("");
            }}
            aria-pressed={!times.includes(duration)}
            className={`px-2 py-1 rounded-sm transition-colors ${
              !times.includes(duration)
                ? "bg-main text-background"
                : "hover:bg-sub/20 hover:cursor-pointer text-sub"
            }`}
          >
            {lastCustom.time !== null ? lastCustom.time : <Wrench size={18} />}
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${customOpen && isTimePanel ? "w-20 opacity-100" : "w-0 opacity-0"}`}
          >
            <input
              ref={timeInputRef}
              placeholder="sec"
              value={customStr}
              onChange={(e) => setCustomStr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitCustom();
                if (e.key === "Escape") setCustomOpen(false);
              }}
              onBlur={() => {
                if (customStr.trim() !== "") commitCustom();
                else setCustomOpen(false);
              }}
              className="w-20 px-2 py-1 rounded-sm bg-background text-text outline-hidden border border-sub focus:border-main"
            />
          </div>
        </div>
        <div className={panelClasses(isWordsPanel)}>
          {words.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                onWordCount(n);
                setLastCustom((prev) => ({ ...prev, words: null }));
              }}
              aria-pressed={wordCount === n}
              className={`px-2 py-1 rounded-sm transition-colors ${
                wordCount === n
                  ? "bg-main text-background"
                  : "hover:bg-sub/20 hover:cursor-pointer text-sub"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setCustomOpen((v) => !v);
              setCustomStr("");
            }}
            aria-pressed={!words.includes(wordCount)}
            className={`px-2 py-1 rounded-sm transition-colors ${!words.includes(wordCount) ? "bg-main text-background" : "hover:bg-sub/20 hover:cursor-pointer text-sub"}`}
          >
            {lastCustom.words !== null ? (
              lastCustom.words
            ) : (
              <Wrench size={18} />
            )}
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${customOpen && isWordsPanel ? "w-20 opacity-100" : "w-0 opacity-0"}`}
          >
            <input
              ref={wordsInputRef}
              placeholder="words"
              value={customStr}
              onChange={(e) => setCustomStr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitCustom();
                if (e.key === "Escape") setCustomOpen(false);
              }}
              onBlur={() => {
                if (customStr.trim() !== "") commitCustom();
                else setCustomOpen(false);
              }}
              className="w-20 px-2 py-1 rounded-sm bg-background text-text outline-hidden border border-sub focus:border-main"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
