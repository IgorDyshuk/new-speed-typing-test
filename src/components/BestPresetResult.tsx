import formattedDate from "@/lib/formatDate";
import { getLanguageLabel } from "@/lib/formatLanguage";
import { useAccountStore, type TimeTestPresets } from "@/store/useAccountStore";

type BestPresetResultProps = {
  preset: TimeTestPresets;
};

export default function BestPresetResult({ preset }: BestPresetResultProps) {
  const bestResult = useAccountStore((state) => state.bestTimeResults[preset]);
  if (!bestResult) {
    return (
      <div key={preset} className="flex flex-col items-center gap-[0.25em]">
        <p className="text-sm ">{preset} seconds</p>
        <p className="text-4xl text-text pt-2">-</p>
        <p className="text-text text-[1.5rem] opacity-75">-</p>
      </div>
    );
  }

  const bestResultDate = formattedDate(bestResult.completedAt);
  const formattedLanguage = getLanguageLabel(bestResult.language);

  return (
    <div
      key={preset}
      className="relative flex flex-col items-center gap-[0.25em] group"
    >
      <p className="text-sm text-[13px] leading-5.5">{preset} seconds</p>
      <p className="text-4xl text-text pt-2">{Math.floor(bestResult.wpm)}</p>
      <p className="text-text text-[1.5rem] opacity-75">
        {Math.floor(bestResult.acc)}%
      </p>

      {bestResult && (
        <div className="pointer-events-none absolute -top-4 w-max rounded-md bg-sub-alt px-3 py-2 text-[13px] leading-5.5 flex flex-col items-center text-text opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <p className="text-sub">{preset} seconds</p>
          <p className="">{Math.floor(bestResult.wpm)} wpm</p>
          <p className="">{Math.floor(bestResult.acc)}% acc</p>
          <p className="">{Math.floor(bestResult.con)}% con</p>
          <p className="">{formattedLanguage}</p>
          <p className="text-sub">{bestResultDate}</p>
        </div>
      )}
    </div>
  );
}
