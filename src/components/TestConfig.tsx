import { AtSign, Hash, Clock, CaseUpper, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TestConfig({
  duration,
  onChangeDuration,
}: {
  duration: number;
  onChangeDuration: (seconds: number) => void;
}) {
  const [customOpen, setCustomOpen] = useState(false);
  const [customStr, setCustomStr] = useState("");
  const [lastCustom, setLastCustom] = useState<number | null>(null);
  const times = [10, 30, 60, 120];

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (customOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [customOpen]);

  const commitCustom = () => {
    const s = parseInt(customStr.trim(), 10);
    if (!Number.isNaN(s) && s > 0) {
      onChangeDuration(s);
      setLastCustom(s);
      setCustomOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-sub-alt text-sub w-fit text-sm px-4 py-2 rounded-md">
      <button
        type="button"
        className="flex items-center gap-0.5 hover:cursor-pointer"
      >
        <AtSign size={14} className="pt-[2px]" />
        punctuations
      </button>
      <button
        type="button"
        className="flex items-center gap-0.5 hover:cursor-pointer"
      >
        <Hash size={15} />
        numbers
      </button>
      <div className="w-2 h-6 bg-background rounded-2xl" />
      <button
        type="button"
        className="flex items-center gap-1 hover:cursor-pointer"
      >
        <Clock size={15} />
        time
      </button>
      <button
        type="button"
        className="flex items-center gap-0.5 hover:cursor-pointer"
      >
        <CaseUpper size={24} className="pt-[5px]" /> words
      </button>
      <div className="w-2 h-6 bg-background rounded-2xl" />
      <div className="flex gap-4">
        {times.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              onChangeDuration(t);
              setLastCustom(null);
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
          className={`px-2 py-1 rounded-sm transition-colors ${!times.includes(duration) ? "bg-main text-background" : "hover:bg-sub/20 hover:cursor-pointer text-sub"}`}
        >
          {lastCustom !== null ? lastCustom : <Wrench size={20} />}
        </button>
        <div
          className={`overflow-hidden transition-all duration-200 ${customOpen ? "w-20 opacity-100" : "w-0 opacity-0"}`}
        >
          {" "}
          <input
            ref={inputRef}
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
          />{" "}
        </div>
      </div>
    </div>
  );
}
