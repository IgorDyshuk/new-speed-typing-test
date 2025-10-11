import RestartButton from "@/components/restartButton/RestartButton";
import Tooltip from "@/components/tooltip/Tooltip";
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
        language: string;
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

  return (
    <div className="px-45 bg-background h-screen flex justify-center items-center">
      <div className="w-full flex justify-center flex-col">
        <div className="w-full grid gap-7 grid-cols-[auto_1fr] text-sub pb-0.25 text-[1rem] leading-[1rem]">
          <div>
            <Tooltip
              label={`${summary.wpm.toFixed(2)} wpm`}
              wrap={false}
              beforeTop={-10}
              afterTop={15}
            >
              <h3 className="text-[2rem] leading-[1.5rem]"> wpm </h3>
              <p className="text-main text-[4rem] leading-[4rem] pb-[0.5rem]">
                {Math.floor(summary.wpm)}
              </p>
            </Tooltip>
            <Tooltip
              label={`${summary.acc.toFixed(2)}%`}
              wrap={false}
              beforeTop={-10}
              afterTop={15}
            >
              <h3 className="text-[2rem] leading-[1.5rem]"> acc </h3>
              <p className="text-main text-[4rem] leading-[4rem]">
                {Math.floor(summary.acc)}%
              </p>
            </Tooltip>
          </div>
          <div>sdfsd</div>
          <div>
            <p className="pb-1">test type</p>
            {/* <p>{Math.round(summary.wordsCompleted)}</p> */}
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
              label="all-typed correct incorrect extra"
              wrap={true}
              beforeTop={-72}
              afterTop={1}
            >
              <p className="pb-2">characters</p>
              <p className="text-main text-[2rem]">
                {Math.round(summary.totalTyped)}/
                {Math.round(summary.correctLetters)}/
                {Math.round(summary.incorrectLetters)}/
                {Math.round(summary.extraLetters)}
              </p>
            </Tooltip>
            <div>
              <p className="pb-2">time</p>
              <p className="text-main text-[2rem]">
                {Math.round(summary.totalSeconds)}s
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
