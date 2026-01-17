import BestPresetResult from "@/components/BestPresetResult";
import EditAccountButton from "@/components/EditAccountButton";
import ResultTable from "@/components/ResultsTable";
import formattedDate from "@/lib/formatDate";
import formateTime from "@/lib/formatTime";
import {
  TIME_TEST_PRESETS,
  useAccountStore,
  WORD_TEST_PRESETS,
} from "@/store/useAccountStore";
import { RiAccountCircleFill } from "react-icons/ri";
//TODO: сдлать таблицу со средней статистикой по аккаунту

export default function StatisticPage() {
  const { username, createdAt, testStarted, testCompleted, totalTypingMs } =
    useAccountStore();
  const formattedUsername = username.trim();

  return (
    <div className="mb-18">
      <div className="bg-sub-alt rounded-xl flex text-sub items-center relative">
        <div className="flex items-center py-6 pl-5">
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
        <div className="w-2.5 h-24 bg-background rounded-2xl mx-5 py-6" />
        <div className="relative w-full flex justify-between">
          <div className="flex flex-col text-sm py-6">
            tests started{" "}
            <span className="text-text text-3xl">{testStarted}</span>
          </div>
          <div className="flex flex-col text-sm py-6">
            tests completed{" "}
            <span className="text-text text-3xl">{testCompleted}</span>
          </div>
          <div className="flex flex-col text-sm py-6">
            time typing{" "}
            <span className="text-text text-3xl">
              {formateTime(totalTypingMs / 1000)}
            </span>
          </div>
          <div className="px-2.5"></div>
        </div>
        <EditAccountButton />
      </div>

      <div className="my-18 flex justify-between items-center gap-8">
        <div className="bg-sub-alt rounded-xl flex text-sub items-center justify-between gap-5 py-5 px-12 w-full">
          {TIME_TEST_PRESETS.map((preset) => {
            return <BestPresetResult preset={preset} mode="time" />;
          })}
        </div>
        <div className="bg-sub-alt rounded-xl flex text-sub items-center justify-between gap-5 py-5 px-12 w-full">
          {WORD_TEST_PRESETS.map((preset) => {
            return <BestPresetResult preset={preset} mode="words" />;
          })}
        </div>
      </div>

      <ResultTable />
    </div>
  );
}
