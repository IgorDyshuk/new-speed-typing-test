import BestPresetResult from "@/components/BestPresetResult";
import EditAccountButton from "@/components/EditAccountButton";
import formattedDate from "@/lib/formatDate";
import formateTime from "@/lib/formatTime";
import { TIME_TEST_PRESETS, useAccountStore } from "@/store/useAccountStore";
import { RiAccountCircleFill } from "react-icons/ri";
//TODO: добавить таблицу с лучшими результатами (только для заранее поставленных значениях теста)
//TODO: сдлать таблицу со средней статистикой по аккаунту
//TODO: сделать список с последними 10 тестами

export default function StatisticPage() {
  const { username, createdAt, testStarted, testCompleted, totalTypingMs } =
    useAccountStore();
  const formattedUsername = username.trim();

  return (
    <div>
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

      <div className="mt-18 bg-sub-alt rounded-xl flex text-sub items-center justify-between gap-5 py-6 px-10">
        {TIME_TEST_PRESETS.map((preset) => {
          return <BestPresetResult preset={preset} />;
        })}
        {TIME_TEST_PRESETS.map((preset) => {
          return <BestPresetResult preset={preset} />;
        })}
      </div>
    </div>
  );
}
