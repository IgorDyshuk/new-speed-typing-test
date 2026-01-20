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
      if (key === "characters")
        return sign * (a.totals.correctLetters - a.totals.correctLetters);
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
    <div className="flex flex-col gap-3 mt-25">
      <table className="text-text w-full">
        <thead className="text-sub text-sm w-full">
          <tr className="[&>td]:py-2">
            {headings.map((heading) => (
              <td
                key={heading}
                onClick={() => handleSort(heading)}
                className="first:pl-12 w-1/6 text-left hover:cursor-pointer"
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
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((result) => {
            const { date, time } = formatDateTime(result.completedAt);
            return (
              <tr
                key={`${result.wpm} ${result.completedAt}`}
                className="odd:bg-sub-alt even:bg-background [&>td]:py-2"
              >
                <td className="pl-12">{result.wpm.toFixed(2)}</td>
                <td>{result.accuracy.toFixed(2)}%</td>
                <td>{result.consistency.toFixed(2)}%</td>
                <td>
                  {[
                    Math.round(result.totals?.totalTyped ?? 0),
                    Math.round(result.totals?.correctLetters ?? 0),
                    Math.round(result.totals?.incorrectLetters ?? 0),
                    Math.round(result.totals?.extraLetters ?? 0),
                  ].join("/")}
                </td>
                <td>
                  {result.mode} {result.lasting}
                </td>
                <td className="pr-12 flex flex-col gap-0">
                  <span className="leading-5">{date}</span>{" "}
                  <span className="leading-5">{time}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
