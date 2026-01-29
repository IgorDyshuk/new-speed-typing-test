import type { BestTestResults, TimeTestPresets } from "@/store/useAccountStore";
import type { Result } from "@/store/useLatestResults";

type TypingStatsProps = {
  testStarted: number;
  testCompleted: number;
  typingTime: string;
  results: Result[];
  bestTimeResults: Record<TimeTestPresets, BestTestResults | null>;
};

type RenderColumnProps = {
  which: "main" | "average" | "averageLast";
  firstLine: number | string;
  wpm: number;
  highestResultDetails?: string;
  accuracy: number;
  consistency: number;
};

function RenderColumn({
  which,
  firstLine,
  wpm,
  highestResultDetails = "_",
  accuracy,
  consistency,
}: RenderColumnProps) {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col ">
        <span className="text-sub leading-normal text-sm md:text-base">
          {which === "main"
            ? "test started"
            : which === "average"
              ? "test completed"
              : "typing time"}
        </span>
        <span className="text-3xl md:text-4xl lg:text-5xl">{firstLine}</span>
      </div>
      <div className="flex flex-col ">
        <span className="text-sub leading-normal text-sm md:text-base">
          {which === "main"
            ? "highest wpm"
            : which === "average"
              ? "average wpm"
              : "average wpm (last 10 tests)"}
        </span>
        <span className="text-3xl md:text-4xl lg:text-5xl">
          {wpm === 0 ? "_" : `${wpm}`}
        </span>
        <span
          className={`${highestResultDetails === "_" ? "text-sm text-background" : "text-sm"} `}
        >
          {highestResultDetails === "_" ? "_" : `${highestResultDetails}`}
        </span>
      </div>
      <div className="flex flex-col ">
        <span className="text-sub leading-normal text-sm md:text-base">
          {which === "main"
            ? "highest accuracy"
            : which === "average"
              ? "average accuracy"
              : "average accuracy (last 10 tests)"}
        </span>
        <span className="text-3xl md:text-4xl lg:text-5xl">
          {accuracy === 0 ? "_" : `${accuracy}%`}
        </span>
      </div>
      <div className="flex flex-col ">
        <span className="text-sub leading-normal text-sm md:text-base">
          {which === "main"
            ? "highest consistency"
            : which === "average"
              ? "average consistency"
              : "average consistency (last 10 tests)"}
        </span>
        <span className="text-3xl md:text-4xl lg:text-5xl">
          {consistency === 0 ? "_" : `${consistency}%`}
        </span>
      </div>
    </div>
  );
}

export default function TypingStats({
  testStarted,
  testCompleted,
  typingTime,
  results,
  bestTimeResults,
}: TypingStatsProps) {
  const bestTimeEntries = (
    Object.entries(bestTimeResults) as [string, BestTestResults | null][]
  ).flatMap(([preset, res]) =>
    res ? [{ preset: Number(preset) as TimeTestPresets, result: res }] : [],
  );

  const bestTimeEntry =
    bestTimeEntries.length === 0
      ? null
      : bestTimeEntries.reduce((best, cur) =>
          cur.result.wpm > best.result.wpm ? cur : best,
        );

  const highestWpmStore = bestTimeEntry?.result.wpm ?? 0;
  const highestWpmLatest =
    results.length === 0 ? 0 : Math.max(...results.map((i) => i.wpm));
  const highestWpm = Math.max(highestWpmStore, highestWpmLatest);

  const highestLatestResult = results.find((r) => r.wpm === highestWpm);

  const isBestFromStore =
    bestTimeEntry?.result?.wpm !== undefined &&
    highestWpm === bestTimeEntry.result.wpm;

  const isBestFromLatest =
    highestLatestResult?.wpm !== undefined &&
    highestWpm === highestLatestResult.wpm;

  const highestResultDetails = isBestFromStore
    ? `time ${bestTimeEntry.preset}`
    : isBestFromLatest
      ? `${highestLatestResult.mode} ${highestLatestResult.lasting}`
      : "_";

  const highestAcc =
    results.length === 0 ? 0 : Math.max(...results.map((i) => i.accuracy));
  const highestCon =
    results.length === 0 ? 0 : Math.max(...results.map((i) => i.consistency));

  const testCompletedStats = testCompleted
    ? `${testCompleted}(${Math.round((testCompleted / testStarted) * 100)}%)`
    : "";
  const averageWpm =
    results.length === 0
      ? 0
      : results.reduce((sum, result) => sum + result.wpm, 0) / results.length;
  const averageAcc =
    results.length === 0
      ? 0
      : results.reduce((sum, result) => sum + result.accuracy, 0) /
        results.length;
  const averageCon =
    results.length === 0
      ? 0
      : results.reduce((sum, result) => sum + result.consistency, 0) /
        results.length;

  const last = results.slice(0, 10);
  const averageLastWpm =
    last.length === 0
      ? 0
      : last.reduce((sum, result) => sum + result.wpm, 0) / last.length;
  const averageLastAcc =
    last.length === 0
      ? 0
      : last.reduce((sum, result) => sum + result.accuracy, 0) / last.length;
  const averageLastCon =
    last.length === 0
      ? 0
      : last.reduce((sum, result) => sum + result.consistency, 0) / last.length;

  return testStarted === 0 ? (
    <div></div>
  ) : (
    <div className="grid w-full grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 text-text">
      <RenderColumn
        which="main"
        firstLine={testStarted}
        wpm={Math.round(highestWpm)}
        highestResultDetails={highestResultDetails}
        accuracy={Math.round(highestAcc)}
        consistency={Math.round(highestCon)}
      />

      <RenderColumn
        which="average"
        firstLine={testCompletedStats}
        wpm={Math.round(averageWpm)}
        accuracy={Math.round(averageAcc)}
        consistency={Math.round(averageCon)}
      />

      <RenderColumn
        which="averageLast"
        firstLine={typingTime}
        wpm={Math.round(averageLastWpm)}
        accuracy={Math.round(averageLastAcc)}
        consistency={Math.round(averageLastCon)}
      />
    </div>
  );
}
