import { ChartAreaLegend } from "@/components/Chart/ChartArea";
import RestartButton from "@/components/restartButton/RestartButton";
import Tooltip from "@/components/tooltip/Tooltip";
import { useDailyStatsStore } from "@/store/useDailyStatsStore";
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
      };
    };
  };

  const summary = state?.summary;
  if (!summary) {
    navigate("/", { replace: true });
    return null;
  }

  const languageNameMap: Record<string, string> = {
    en: "english",
    de: "german",
    fr: "french",
    es: "spanish",
    it: "italian",
    pt: "portuguese",
    nl: "dutch",
    pl: "polish",
    ru: "russian",
    uk: "ukrainian",
    cs: "czech",
    hu: "hungarian",

    zh: "chinese",
    ja: "japanese",
    ko: "korean",

    sv: "swedish",
    tr: "turkish",
    ar: "arabic",
    hi: "hindi",
    ro: "romanian",
  };

  const wpmChartData = summary.wpmSamples.map((value, index) => ({
    second: index + 1,
    wpm: Math.floor(value),
  }));

  const errorDeltaSamples = summary.errorDeltaSamples ?? [];

  const mistakeDeltaChartData = errorDeltaSamples.map(([delta, second]) => ({
    second,
    errors: delta / 2,
  }));

  const accTooltip = [
    `${summary.acc.toFixed(2)}%`,
    `${summary.correctLetters}\u00A0correct`,
    `${summary.historicalMistakes}\u00A0incorrect`,
  ].join("\n");

  const { totalMs } = useDailyStatsStore();
  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return [hours, minutes, seconds]
      .map((value) => value.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <div className="bg-background mt-35 flex justify-center items-center">
      <div className="w-full flex justify-center flex-col">
        <div className="w-full grid gap-7 grid-cols-[auto_1fr] text-sub pb-px text-[1rem] leading-4">
          <div className="flex flex-col gap-2">
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
          <div>
            <p className="pb-2">test type</p>
            <div className="text-main">
              <p>
                {summary.mode}{" "}
                {summary.mode === "time"
                  ? Math.round(summary.durationSeconds)
                  : Math.round(summary.totalWords)}
              </p>
              <p>{languageNameMap[summary.language] ?? summary.language}</p>
              {summary.includeNumbers && <p>numbers</p>}
              {summary.includePunctuation && <p>withPunctuation</p>}
            </div>
          </div>
          <div className="flex justify-between items-start">
            <div></div>
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
            <div></div>
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
                {formatDuration(totalMs / 1000)} today
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
