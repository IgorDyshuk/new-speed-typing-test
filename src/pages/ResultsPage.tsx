import RestartButton from "@/components/restartButton/RestartButton";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: {
      summary?: {
        wpm: number;
        acc: number;
        wordsCompleted: number;
        totalWords: number;
        durationSeconds: number;
        mode: "time" | "words";
        includeNumbers: boolean;
        includePunctuation: boolean;
      };
    };
  };

  const summary = state?.summary;
  if (!summary) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <div className="px-30 bg-background h-screen">
        <p> wpm {Math.round(summary.wpm)}</p>
        <p> acc {Math.round(summary.acc)}</p>
        <p>{Math.round(summary.wordsCompleted)}</p>
        <p>{Math.round(summary.totalWords)}</p>
        <p>time {Math.round(summary.durationSeconds)}</p>
        <p>{summary.mode}</p>
        {summary.includeNumbers && <p>numbers</p>}
        {summary.includePunctuation && <p>withPunctuation</p>}

        <button type="button" onClick={() => navigate("/", { replace: true })}>
          <RestartButton />
        </button>
      </div>
    </div>
  );
}
