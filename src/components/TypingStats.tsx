import type { Result } from "@/store/useLatestResults";

type TypingStatsProps = {
  testStarted: number;
  testCompleted: number;
  typingTime: string;
  results: Result[];
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
        <span className="text-sub leading-normal">
          {which === "main"
            ? "test started"
            : which === "average"
              ? "test completed"
              : "typing time"}
        </span>
        <span className="text-5xl">{firstLine}</span>
      </div>
      <div className="flex flex-col ">
        <span className="text-sub leading-normal">
          {which === "main"
            ? "highest wpm"
            : which === "average"
              ? "average wpm"
              : "average wpm (last 10 tests)"}
        </span>
        <span className="text-5xl">{wpm}</span>
        <span
          className={`${highestResultDetails === "_" ? "text-sm text-background" : "text-sm"} `}
        >
          {highestResultDetails === "_" ? "_" : `${highestResultDetails}`}
        </span>
      </div>
      <div className="flex flex-col ">
        <span className="text-sub leading-normal">
          {" "}
          {which === "main"
            ? "highest accuracy"
            : which === "average"
              ? "average accuracy"
              : "average accuracy (last 10 tests)"}
        </span>
        <span className="text-5xl">{accuracy}%</span>
      </div>
      <div className="flex flex-col ">
        <span className="text-sub leading-normal">highest consistency</span>
        <span className="text-5xl">{consistency}%</span>
      </div>
    </div>
  );
}

export default function TypingStats({
  testStarted,
  testCompleted,
  typingTime,
  results,
}: TypingStatsProps) {
  const highestWpm = Math.max(...results.map((i) => i.wpm));
  const highestResult = results.find((result) => result.wpm === highestWpm);
  const highestResultDetails = highestResult
    ? `${highestResult.mode} ${highestResult.lasting}`
    : undefined;
  const highestAcc = Math.max(...results.map((i) => i.accuracy));
  const highestCon = Math.max(...results.map((i) => i.consistency));

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

  return (
    <div className="grid w-full grid-cols-3 gap-8 text-text">
      <RenderColumn
        which="main"
        firstLine={testStarted}
        wpm={highestWpm}
        highestResultDetails={highestResultDetails}
        accuracy={highestAcc}
        consistency={highestCon}
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
