import { ChartAreaLegend } from "@/components/Chart/ChartArea";
import RestartButton from "@/components/restartButton/RestartButton";
import Tooltip from "@/components/tooltip/Tooltip";
import { getLanguageLabel } from "@/lib/formatLanguage";
import formateTime from "@/lib/formatTime";
import {
  TIME_TEST_PRESETS,
  useAccountStore,
  WORD_TEST_PRESETS,
} from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useDailyStatsStore } from "@/store/useDailyStatsStore";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useLatestStore } from "@/store/useLatestResults";

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
        totalSeconds: number;
        totalTyped: number;
        correctLetters: number;
        incorrectLetters: number;
        extraLetters: number;
        historicalMistakes: number;
        language: string;
        wpmSamples: number[];
        errorDeltaSamples: [number, number][];
        wpmConsistency: number;
        wasAuthenticated: boolean;
      };
    };
  };

  const summary = state?.summary;
  if (!summary) {
    navigate("/", { replace: true });
    return null;
  }
  const wasAuthenticated = summary.wasAuthenticated;

  const languageLabel = getLanguageLabel(summary.language);

  const errorDeltaSamples = summary.errorDeltaSamples ?? [];

  // In time mode the last sample may arrive after navigation; pad to full duration.
  const expectedSampleCount =
    summary.mode === "time"
      ? Math.max(0, Math.round(summary.durationSeconds))
      : Math.max(summary.wpmSamples.length, errorDeltaSamples.length);

  const lastKnownWpm =
    summary.wpmSamples.length > 0
      ? summary.wpmSamples[summary.wpmSamples.length - 1]
      : 0;
  const normalizedWpmSamples = [
    ...summary.wpmSamples,
    ...Array(
      Math.max(0, expectedSampleCount - summary.wpmSamples.length),
    ).fill(lastKnownWpm),
  ];

  const wpmChartData = normalizedWpmSamples.map((value, index) => ({
    second: index + 1,
    wpm: Math.floor(value),
  }));

  const errorDeltaBySecond = new Map(
    errorDeltaSamples.map(([delta, second]) => [second, delta] as const),
  );

  const mistakeDeltaChartData = Array.from(
    { length: expectedSampleCount },
    (_, index) => {
      const second = index + 1;
      return {
        second,
        errors: errorDeltaBySecond.get(second) ?? 0,
      };
    },
  );

  const accTooltip = [
    `${summary.acc.toFixed(2)}%`,
    `${summary.correctLetters}\u00A0correct`,
    `${summary.historicalMistakes}\u00A0incorrect`,
  ].join("\n");

  const { totalMs } = useDailyStatsStore();
  const { isAuthenticated } = useAuthStore();
  const updateBestTimeResult = useAccountStore((s) => s.updateBestTimeResult);
  const updateBestWordResult = useAccountStore((s) => s.updateBestWordResult);
  const addTypingMs = useAccountStore((s) => s.addTypingMs);
  const incrementTestStarted = useAccountStore((s) => s.incrementTestStarted);
  const incrementTestCompleted = useAccountStore(
    (s) => s.incrementTestCompleted,
  );
  const addResult = useLatestStore((state) => state.addResult);

  const hasSyncedBestRef = useRef(false);

  useEffect(() => {
    if (!summary) return;
    if (!isAuthenticated) return;
    if (hasSyncedBestRef.current) return;

    const now = new Date().toISOString();
    let updated = false;

    if (summary.mode === "time") {
      const duration = Math.round(summary.durationSeconds);
      const preset = TIME_TEST_PRESETS.find((value) => value === duration);
      if (preset) {
        updated = updateBestTimeResult(preset, {
          wpm: summary.wpm,
          acc: summary.acc,
          con: summary.wpmConsistency,
          language: summary.language,
          completedAt: now,
          includeNumbers: summary.includeNumbers,
          includePunctuation: summary.includePunctuation,
        });
      }
    } else if (summary.mode === "words") {
      const words = Math.round(summary.totalWords);
      const preset = WORD_TEST_PRESETS.find((value) => value === words);
      if (preset) {
        updated = updateBestWordResult(preset, {
          wpm: summary.wpm,
          acc: summary.acc,
          con: summary.wpmConsistency,
          language: summary.language,
          completedAt: now,
          includeNumbers: summary.includeNumbers,
          includePunctuation: summary.includePunctuation,
        });
      }
    }

    if (!wasAuthenticated) {
      incrementTestStarted();
      incrementTestCompleted();
      addTypingMs(Math.round(summary.totalSeconds * 1000));
      addResult({
        wpm: summary.wpm,
        accuracy: summary.acc,
        consistency: summary.wpmConsistency,
        totals: {
          totalTyped: summary.totalTyped,
          correctLetters: summary.correctLetters,
          incorrectLetters: summary.incorrectLetters,
          extraLetters: summary.extraLetters,
        },
        mode: summary.mode,
        lasting:
          summary.mode === "time"
            ? Math.round(summary.durationSeconds)
            : Math.round(summary.totalWords),
        completedAt: now,
      });
    }

    if (updated && wasAuthenticated) {
      toast.success("Congrats with new record", { position: "top-center" });
      const common = { particleCount: 120, spread: 70, startVelocity: 45 };
      confetti({ ...common, origin: { x: 0, y: 0.5 }, angle: 60 });
      confetti({ ...common, origin: { x: 1, y: 0.5 }, angle: 120 });
    }
    hasSyncedBestRef.current = true;
  }, [
    summary,
    isAuthenticated,
    wasAuthenticated,
    updateBestTimeResult,
    updateBestWordResult,
    incrementTestStarted,
    incrementTestCompleted,
    addTypingMs,
    addResult,
  ]);

  return (
    <div className="bg-background mt-4 sm:mt-18 md:mt-27 lg:mt-35 xl:mt-44 2xl:mt-52 flex justify-center items-center">
      <div className="w-full flex justify-center flex-col">
        <div className="w-full grid gap-1 md:gap-7 md:grid-cols-[auto_1fr] text-sub pb-px text-[1rem] leading-4">
          <div className="flex md:flex-col gap-10 md:gap-2">
            <Tooltip
              label={`${summary.wpm.toFixed(2)} wpm`}
              wrap={false}
              beforeTop={-10}
              afterTop={15}
            >
              <h3 className="text-[2rem] leading-6 pb-0.5"> wpm </h3>
              <p className="text-main text-[4rem] leading-16 pb-2">
                {Math.floor(summary.wpm)}
              </p>
            </Tooltip>
            <Tooltip
              label={accTooltip}
              wrap={true}
              beforeTop={-49}
              afterTop={15}
            >
              <h3 className="text-[2rem] leading-6"> acc </h3>
              <p className="text-main text-[4rem] leading-16">
                {Math.floor(summary.acc)}%
              </p>
            </Tooltip>
          </div>
          <div>
            <ChartAreaLegend
              wpmData={wpmChartData}
              errorData={mistakeDeltaChartData}
            />
          </div>
          <div className="flex justify-between mt-4 mb-2 md:mt-0 md:mb-0">
            <div>
              <p className="pb-2">test type</p>
              <div className="text-main">
                <p>
                  {summary.mode}{" "}
                  {summary.mode === "time"
                    ? Math.round(summary.durationSeconds)
                    : Math.round(summary.totalWords)}
                </p>
                <p>{languageLabel}</p>
                {summary.includeNumbers && <p>numbers</p>}
                {summary.includePunctuation && <p>withPunctuation</p>}
              </div>
            </div>

            <div className="flex md:hidden">
              <Tooltip
                label={`${summary.wpmConsistency.toFixed(2)} %`}
                wrap={false}
                beforeTop={-10}
                afterTop={15}
              >
                <p className="pb-3">consistency</p>
                <p className="text-main text-[2rem]">
                  {Math.floor(summary.wpmConsistency)}%
                </p>
              </Tooltip>
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div className="hidden md:flex"></div>
            <div className="hidden md:flex">
              <Tooltip
                label={`${summary.wpmConsistency.toFixed(2)} %`}
                wrap={false}
                beforeTop={-10}
                afterTop={15}
              >
                <p className="pb-3">consistency</p>
                <p className="text-main text-[2rem]">
                  {Math.floor(summary.wpmConsistency)}%
                </p>
              </Tooltip>
            </div>
            <div className="hidden md:flex"></div>
            <Tooltip
              label="all-typed correct incorrect extra"
              wrap={true}
              beforeTop={-80}
              afterTop={1}
            >
              <p className="pb-3">characters</p>
              <p className="text-main text-[2rem]">
                {Math.round(summary.totalTyped)}/{""}
                {Math.round(summary.correctLetters)}/{""}
                {Math.round(summary.incorrectLetters)}/{""}
                {Math.round(summary.extraLetters)}
              </p>
            </Tooltip>
            <div>
              <p className="pb-3">time</p>
              <p className="text-main text-[2rem]">
                {Math.round(summary.totalSeconds)}s
              </p>
              <p className="pt-1.5 text-[12px]">
                {formateTime(totalMs / 1000)} today
              </p>
            </div>
          </div>
        </div>
        <button type="button" onClick={() => navigate("/", { replace: true })}>
          <RestartButton />
        </button>
      </div>
    </div>
  );
}
