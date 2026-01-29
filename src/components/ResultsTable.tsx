import { type Result } from "@/store/useLatestResults";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

type SortKey =
  | "wpm"
  | "accuracy"
  | "consistency"
  | "characters"
  | "mode"
  | "date";

type DirectionType = "asc" | "desc";
type LastResultTableProps = { testStarted: number; results: Result[] };

export default function LastResultTable({
  testStarted,
  results,
}: LastResultTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [dir, setDir] = useState<DirectionType>("desc");

  const handleSort = (key: SortKey) => {
    if (key === "mode" || key === "characters") return;
    setDir((prevDir) =>
      sortBy === key ? (prevDir === "asc" ? "desc" : "asc") : "desc",
    );
    setSortBy(key);
  };
  const headings: SortKey[] = [
    "wpm",
    "accuracy",
    "consistency",
    "characters",
    "mode",
    "date",
  ];
  const [multi, setMulti] = useState(1);
  const handleClick = () => {
    if (multi >= 3) return;
    setMulti(multi + 1);
  };
  99;
  const cmp = (a: number | string, b: number | string) =>
    typeof a === "string" && typeof b === "string"
      ? a.localeCompare(b)
      : (Number(a) || 0) - (Number(b) || 0);

  function compareFn(key: SortKey) {
    const sign = dir === "asc" ? 1 : -1;
    return [...results].sort((a, b) => {
      if (key === "date")
        return (
          sign *
          (new Date(a.completedAt).getTime() -
            new Date(b.completedAt).getTime())
        );
      if (key === "characters") {
        const totalA = a.totals?.totalTyped ?? 0;
        const totalB = b.totals?.totalTyped ?? 0;
        return sign * (totalA - totalB);
      }
      return sign * cmp(a[key], b[key]);
    });
  }
  const sorted = compareFn(sortBy);
  const visible = sorted.slice(0, multi * 10);

  const canShowMore = visible.length < results.length;

  const formatDateTime = (iso: string, useUTC = false) => {
    const opts = useUTC ? { timeZone: "UTC" } : {};
    const date = new Intl.DateTimeFormat(undefined, {
      ...opts,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));

    const time = new Intl.DateTimeFormat(undefined, {
      ...opts,
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

    return { date, time };
  };

  return testStarted === 0 ? (
    <div></div>
  ) : (
    <div className="flex flex-col gap-4 mt-15 md:mt-18 xl:mt-21 2xl:mt-25">
      <div className="md:hidden flex items-center justify-between px-2 text-sub text-sm">
        <div className="flex items-center gap-2">
          <span>sort</span>
          <select
            className="bg-sub-alt text-text rounded-md px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as SortKey)}
          >
            {headings
              .filter((h) => h !== "mode" && h !== "characters")
              .map((heading) => (
                <option key={heading} value={heading}>
                  {heading}
                </option>
              ))}
          </select>
        </div>
        <button
          className="bg-sub-alt text-text rounded-md px-2 py-1 text-sm"
          onClick={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}
        >
          {dir === "asc" ? "asc ↑" : "desc ↓"}
        </button>
      </div>

      <div className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="text-text w-full table-auto border-separate border-spacing-y-1">
            <thead className="text-sub text-sm">
              <tr className="[&>th]:py-1 [&>th]:px-3 lg:[&>th]:px-6 bg-background/60">
                {headings.map((heading) => (
                  <th
                    key={heading}
                    onClick={() => handleSort(heading)}
                    className={`text-left font-medium tracking-wide hover:cursor-pointer select-none ${
                      heading === "characters" || heading === "mode"
                        ? "hidden md:table-cell"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {heading}
                      {sortBy === heading ? (
                        dir === "asc" ? (
                          <ArrowUp size={15} />
                        ) : (
                          <ArrowDown size={15} />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((result) => {
                const { date, time } = formatDateTime(result.completedAt);
                return (
                  <tr
                    key={`${result.wpm} ${result.completedAt}`}
                    className="odd:bg-sub-alt/70 even:bg-background hover:bg-sub-alt transition-colors [&>td]:py-1.5 [&>td]:px-3 lg:[&>td]:px-6"
                  >
                    <td>{result.wpm.toFixed(2)}</td>
                    <td>{result.accuracy.toFixed(2)}%</td>
                    <td>{result.consistency.toFixed(2)}%</td>
                    <td className="hidden md:table-cell">
                      {[
                        Math.round(result.totals?.totalTyped ?? 0),
                        Math.round(result.totals?.correctLetters ?? 0),
                        Math.round(result.totals?.incorrectLetters ?? 0),
                        Math.round(result.totals?.extraLetters ?? 0),
                      ].join("/")}
                    </td>
                    <td className="hidden md:table-cell">
                      {result.mode} {result.lasting}
                    </td>
                    <td className="pr-4">
                      <div className="leading-5">{date}</div>
                      <div className="leading-5 text-sub text-xs">{time}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {visible.map((result) => {
          const { date, time } = formatDateTime(result.completedAt);
          return (
            <div
              key={`${result.wpm} ${result.completedAt}`}
              className="bg-sub-alt rounded-xl p-4 text-text flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">
                  {result.wpm.toFixed(0)} wpm
                </span>
                <span className="text-xs text-sub">
                  {date} • {time}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>acc {result.accuracy.toFixed(1)}%</span>
                <span>cons {result.consistency.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs text-sub">
                <span>
                  {result.mode} {result.lasting}
                </span>
                <span>
                  {[
                    Math.round(result.totals?.totalTyped ?? 0),
                    Math.round(result.totals?.correctLetters ?? 0),
                    Math.round(result.totals?.incorrectLetters ?? 0),
                    Math.round(result.totals?.extraLetters ?? 0),
                  ].join("/")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {canShowMore && (
        <button
          onClick={handleClick}
          className="w-full text-center text-text bg-sub-alt rounded-lg hover:bg-text hover:text-sub-alt hover:cursor-pointer"
        >
          show more
        </button>
      )}
    </div>
  );
}
