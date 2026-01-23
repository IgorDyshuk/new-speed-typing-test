import type { TestMode } from "@/hooks/useTypingGame";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type MobileTestConfigProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  started: boolean;
  finished: boolean;
  mode: TestMode;
  withNumbers: boolean;
  withPunctuation: boolean;
  duration: number;
  wordCount: number;
  presetTimes: number[];
  presetWords: number[];
  onChangeDuration: (s: number) => void;
  onChangeWordCount: (n: number) => void;
  onModeChange: (mode: TestMode) => void;
  onToggleNumbers: (next: boolean) => void;
  onTogglePunctuation: (next: boolean) => void;
  onClose?: () => void;
};

export default function MobileTestConfig({
  open,
  onOpenChange,
  started,
  finished,
  mode,
  withNumbers,
  withPunctuation,
  duration,
  wordCount,
  presetTimes,
  presetWords,
  onChangeDuration,
  onChangeWordCount,
  onModeChange,
  onToggleNumbers,
  onTogglePunctuation,
  onClose,
}: MobileTestConfigProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="w-full md:hidden flex justify-center mt-4">
        <DialogTrigger asChild>
          <button
            type="button"
            className={`rounded-lg bg-sub-alt text-text px-4 py-2 text-sm hover:bg-text hover:text-background transition-all duration-300 ${
              started && !finished ? "opacity-0" : "opacity-100"
            }`}
          >
            Test config
          </button>
        </DialogTrigger>
      </div>
      <DialogContent className="max-w-xs rounded-xl bg-background border border-sub-alt text-sub space-y-4">
        <DialogHeader>
          <DialogTitle className="text-text">Test config</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded-md ${
              mode === "time" ? "bg-main text-sub-alt" : "bg-sub-alt text-text"
            }`}
            onClick={() => onModeChange("time")}
          >
            time
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-md ${
              mode === "words" ? "bg-main text-sub-alt" : "bg-sub-alt text-text"
            }`}
            onClick={() => onModeChange("words")}
          >
            words
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-md ${
              withNumbers ? "bg-main text-sub-alt" : "bg-sub-alt text-text"
            }`}
            onClick={() => onToggleNumbers(!withNumbers)}
          >
            numbers
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-md ${
              withPunctuation ? "bg-main text-sub-alt" : "bg-sub-alt text-text"
            }`}
            onClick={() => onTogglePunctuation(!withPunctuation)}
          >
            punctuation
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-text text-sm">
            {mode === "time" ? "Time" : "Words"} presets
          </p>
          <div className="flex flex-col gap-2">
            {(mode === "time" ? presetTimes : presetWords).map((value) => (
              <button
                key={value}
                type="button"
                className={`px-3 py-1 rounded-md ${
                  (mode === "time" ? duration : wordCount) === value
                    ? "bg-main text-sub-alt"
                    : "bg-sub-alt text-text"
                }`}
                onClick={() =>
                  mode === "time"
                    ? onChangeDuration(value)
                    : onChangeWordCount(value)
                }
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="w-full rounded-lg bg-text text-background py-2"
          onClick={() => {
            onOpenChange(false);
            onClose?.();
          }}
        >
          Done
        </button>
      </DialogContent>
    </Dialog>
  );
}
