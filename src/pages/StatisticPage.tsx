import EditAccountButton from "@/components/EditAccountButton";
import formateTime from "@/lib/formatTime";
import { useAccountStore } from "@/store/useAccountStore";
import { RiAccountCircleFill } from "react-icons/ri";
//TODO: добавить кнопку чтобы ты мог редактировать свое имя
//TODO: добавить таблицу с лучшими результатами (только для заранее поставленных значениях теста)
//TODO: сдлать таблицу со средней статистикой по аккаунту
//TODO: сделать список с последними 10 тестами

export default function StatisticPage() {
  const { username, createdAt, testStarted, testCompleted, totalTypingMs } =
    useAccountStore();
  const formattedUsername = username.trim();
  const formattedJoined = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "--";

  return (
    <div className="bg-sub-alt rounded-xl flex text-sub items-center relative">
      <div className="flex items-center py-2 pl-2">
        <RiAccountCircleFill className="h-23 w-23" />
        <div className="flex flex-col">
          <span className="text-text text-[2rem] leading-10 whitespace-nowrap">
            {formattedUsername}
          </span>
          <span className="text-[11px] leading-3.5 whitespace-nowrap">
            joined {formattedJoined}
          </span>
        </div>
      </div>
      <div className="w-2.5 h-20 bg-background rounded-2xl mx-5 py-2" />
      <div className="relative w-full flex justify-between">
        <div className="flex flex-col text-sm py-2">
          tests started{" "}
          <span className="text-text text-2xl">{testStarted}</span>
        </div>
        <div className="flex flex-col text-sm py-2">
          tests completed{" "}
          <span className="text-text text-2xl">{testCompleted}</span>
        </div>
        <div className="flex flex-col text-sm py-2">
          time typing{" "}
          <span className="text-text text-2xl">
            {formateTime(totalTypingMs / 1000)}
          </span>
        </div>
        <div className="px-1.5"></div>
      </div>
      <EditAccountButton />
    </div>
  );
}
