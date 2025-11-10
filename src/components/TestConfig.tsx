import { AtSign, Hash, Clock, CaseUpper, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type TestMode = "time" | "words";

export default function TestConfig({
  duration,
  onChangeDuration,
  wordCount,
  onWordCount,
  mode,
  onModeChange,
  withNumbers,
  onToggleNumbers,
  withPunctuation,
  onTogglePunctuation,
}: {
  duration: number;
  onChangeDuration: (seconds: number) => void;
  wordCount: number;
  onWordCount: (n: number) => void;
  mode: TestMode;
  onModeChange: (mode: TestMode) => void;
  withNumbers: boolean;
  onToggleNumbers: (next: boolean) => void;
  withPunctuation: boolean;
  onTogglePunctuation: (next: boolean) => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customStr, setCustomStr] = useState("");

  const words = [10, 25, 50, 100];
  const times = [10, 30, 60, 120];

  const isCustomTimeValue = !times.includes(duration);
  const customTimeLabel = isCustomTimeValue ? duration : null;
  const isCustomWordValue = !words.includes(wordCount);
  const customWordLabel = isCustomWordValue ? wordCount : null;

  const [displayMode, setDisplayMode] = useState<TestMode>(mode);
  const [panelPhase, setPanelPhase] = useState<"idle" | "fade-out" | "fade-in">(
    "idle",
  );
  const fadeOutTimeoutRef = useRef<number | null>(null);
  const fadeInTimeoutRef = useRef<number | null>(null);
  const PANEL_FADE_MS = 140;

  useEffect(() => {
    if (displayMode === mode) return;
    setPanelPhase("fade-out");
    if (fadeOutTimeoutRef.current !== null) {
      window.clearTimeout(fadeOutTimeoutRef.current);
    }
    fadeOutTimeoutRef.current = window.setTimeout(() => {
      setDisplayMode(mode);
      setPanelPhase("fade-in");
    }, PANEL_FADE_MS);

    return () => {
      if (fadeOutTimeoutRef.current !== null) {
        window.clearTimeout(fadeOutTimeoutRef.current);
        fadeOutTimeoutRef.current = null;
      }
    };
  }, [mode, displayMode]);

  useEffect(() => {
    if (panelPhase !== "fade-in") return;
    if (fadeInTimeoutRef.current !== null) {
      window.clearTimeout(fadeInTimeoutRef.current);
    }
    fadeInTimeoutRef.current = window.setTimeout(
      () => setPanelPhase("idle"),
      PANEL_FADE_MS,
    );
    return () => {
      if (fadeInTimeoutRef.current !== null) {
        window.clearTimeout(fadeInTimeoutRef.current);
        fadeInTimeoutRef.current = null;
      }
    };
  }, [panelPhase]);

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

  const isTimePanel = displayMode === "time";
  const isWordsPanel = displayMode === "words";
  const isActiveTime = mode === "time";
  const isActiveWords = mode === "words";

  const panelClasses = (active: boolean) =>
    `flex w-full items-center gap-3 transition-opacity duration-200 ${
      active
        ? "opacity-100 pointer-events-auto relative"
        : "opacity-0 pointer-events-none absolute inset-0"
    }`;

  const timeInputRef = useRef<HTMLInputElement | null>(null);
  const wordsInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (customOpen) {
      requestAnimationFrame(() => {
        const target = isTimePanel
          ? timeInputRef.current
          : wordsInputRef.current;
        target?.focus();
        target?.select();
      });
    }
  }, [customOpen, isTimePanel]);

  const commitCustom = () => {
    const s = parseInt(customStr.trim(), 10);

    if (Number.isNaN(s) || s < 2) {
      toast.error("Minimum value is 2");
      setCustomStr("");
      return;
    }
    if (isTimePanel) {
      onChangeDuration(s);
    } else {
      onWordCount(s);
    }
    setCustomOpen(false);
    setCustomStr("");
  };

  return (
    <div className="flex items-center gap-7 bg-sub-alt text-sub w-fit text-[12px] leading-[12px] pl-4 pr-2 py-1.5 rounded-md">
      <button
        type="button"
        onClick={() => onTogglePunctuation(!withPunctuation)}
        className={`flex items-center gap-0.5 hover:cursor-pointer ${withPunctuation ? "text-main" : ""}`}
      >
        <AtSign size={13} className="pt-[2px]" />
        punctuation
      </button>
      <button
        type="button"
        onClick={() => onToggleNumbers(!withNumbers)}
        className={`flex items-center gap-0.5 hover:cursor-pointer ${withNumbers ? "text-main" : ""}`}
      >
        <Hash size={12} />
        numbers
      </button>
      <div className="w-2 h-6 bg-background rounded-2xl" />
      <button
        type="button"
        onClick={() => {
          onModeChange("time");
          setCustomOpen(false);
          setCustomStr("");
        }}
        className={`flex items-center gap-1 transition-colors duration-200 hover:cursor-pointer ${isActiveTime ? "text-main" : ""}`}
      >
        <Clock size={13} />
        time
      </button>
      <button
        type="button"
        onClick={() => {
          onModeChange("words");
          setCustomOpen(false);
          setCustomStr("");
        }}
        className={`flex items-center gap-0.5 transition-colors duration-200 hover:cursor-pointer ${isActiveWords ? "text-main" : ""}`}
      >
        <CaseUpper size={22} className="pt-[3px]" /> words
      </button>
      <div className="w-2 h-6 bg-background rounded-2xl" />
      <div
        className={`relative min-h-[2px] min-w-[200px] flex-1 transition-opacity duration-150 ${
          panelPhase === "fade-out" ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className={panelClasses(isTimePanel)}>
          <div className="flex items-center gap-3">
            {times.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onChangeDuration(t);
                }}
                aria-pressed={duration === t}
                className={`px-2 py-1 rounded-sm transition-colors ${
                  duration === t
                    ? "text-main"
                    : "hover:text-text hover:cursor-pointer"
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
                  ? "text-main"
                  : "hover:text-text hover:cursor-pointer"
              }`}
            >
              {customTimeLabel ?? <Wrench size={18} />}
            </button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              customOpen && isTimePanel
                ? "ml-3 w-20 opacity-100"
                : "ml-0 w-0 opacity-0"
            }`}
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
          <div className="flex items-center gap-3">
            {words.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  onWordCount(n);
                }}
                aria-pressed={wordCount === n}
                className={`px-2 py-1 rounded-sm transition-colors ${
                  wordCount === n
                    ? "text-main"
                    : "hover:text-text hover:cursor-pointer"
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
              className={`px-2 py-1 rounded-sm transition-colors ${
                !words.includes(wordCount)
                  ? "text-main"
                  : "hover:text-text hover:cursor-pointer"
              }`}
            >
              {customWordLabel ?? <Wrench size={18} />}
            </button>
          </div>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              customOpen && isWordsPanel
                ? "ml-3 w-20 opacity-100"
                : "ml-0 w-0 opacity-0"
            }`}
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
