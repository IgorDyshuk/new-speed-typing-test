import BestPresetResult from "@/components/BestPresetResult";
import EditAccountButton from "@/components/EditAccountButton";
import LastResultTable from "@/components/ResultsTable";
import TypingStats from "@/components/TypingStats";
import formattedDate from "@/lib/formatDate";
import formateTime from "@/lib/formatTime";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TIME_TEST_PRESETS,
  useAccountStore,
  WORD_TEST_PRESETS,
} from "@/store/useAccountStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useLatestStore } from "@/store/useLatestResults";
import { RiAccountCircleFill } from "react-icons/ri";

export default function StatisticPage() {
  const navigate = useNavigate();
  const {
    username,
    createdAt,
    testStarted,
    testCompleted,
    totalTypingMs,
    bestTimeResults,
  } = useAccountStore();
  const { isAuthenticated } = useAuthStore();
  const results = useLatestStore((state) => state.results);
  const formattedUsername = username.trim();
  const typingTime = formateTime(totalTypingMs / 1000);

  useEffect(() => {
    if (!isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="mb-18">
      <div className="bg-sub-alt rounded-xl flex flex-col md:flex-row text-sub items-start md:items-center relative">
        <div className="flex items-center justify-between w-full md:w-fit pl-0.5 pr-1 md:p-0">
          <div className="">
            <div className="flex items-center py-0 pl-0 md:py-6 md:pl-5">
              <RiAccountCircleFill className="h-23 w-23" />
              <div className="flex flex-col">
                <span className="text-text text-[2rem] leading-10 whitespace-nowrap">
                  {formattedUsername}
                </span>
                <span className="text-[11px] leading-3.5 whitespace-nowrap">
                  joined {formattedDate(createdAt)}
                </span>
              </div>
            </div>
          </div>
          <div className="block md:hidden">
            <EditAccountButton />
          </div>
        </div>
        <div className="hidden md:flex w-2.5 h-24 bg-background rounded-2xl mx-5 py-6" />
        <div className="relative w-full flex flex-wrap justify-between p-3 md:p-0">
          <div className="flex flex-col text-sm py-0 md:py-6">
            tests started{" "}
            <span className="text-text text-3xl">{testStarted}</span>
          </div>
          <div className="flex flex-col text-sm py-0 md:py-6">
            tests completed{" "}
            <span className="text-text text-3xl">{testCompleted}</span>
          </div>
          <div className="flex flex-col w-full md:w-fit text-sm py-0 md:py-6">
            time typing <span className="text-text text-3xl">{typingTime}</span>
          </div>
          <div className="px-2.5"></div>
        </div>

        <div className="hidden md:flex absolute inset-y-0 right-0 items-center">
          <EditAccountButton />
        </div>
      </div>

      <div className="my-14 xl:my-16 2xl:my-18 flex flex-col xl:flex-row  justify-between items-center gap-8">
        <div className="bg-sub-alt rounded-xl flex text-sub items-center justify-between gap-5 py-5 px-3 md:px-6 lg:px-9 xl:px-12 text-center w-full">
          {TIME_TEST_PRESETS.map((preset) => {
            return <BestPresetResult preset={preset} mode="time" />;
          })}
        </div>
        <div className="bg-sub-alt rounded-xl flex text-sub items-center justify-between gap-5 py-5 px-3 md:px-6 lg:px-9 xl:px-12 text-center w-full">
          {WORD_TEST_PRESETS.map((preset) => {
            return <BestPresetResult preset={preset} mode="words" />;
          })}
        </div>
      </div>

      <TypingStats
        testStarted={testStarted}
        testCompleted={testCompleted}
        typingTime={typingTime}
        results={results}
        bestTimeResults={bestTimeResults}
      />

      <LastResultTable testStarted={testStarted} results={results} />
    </div>
  );
}
