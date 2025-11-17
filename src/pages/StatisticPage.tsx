import formateTime from "@/lib/formatTime";
import { useAccountStore } from "@/store/useAccountStore";
import { RiAccountCircleFill } from "react-icons/ri";

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
  //TODO: добавить кнопку чтобы ты мог редактировать свое имя

  return (
    <div className="bg-sub-alt p-2 rounded-xl flex text-sub items-center">
      <div className="flex items-center">
        <RiAccountCircleFill className="h-23 w-23" />
        <div className="flex flex-col">
          <span className="text-text text-[2rem] leading-10">
            {formattedUsername}
          </span>
          <span className="text-[11px] leading-3.5 whitespace-nowrap">
            joined {formattedJoined}
          </span>
        </div>
      </div>
      <div className="w-2.5 h-20 bg-background rounded-2xl mx-5" />
      <div className="w-full flex justify-between pr-2.5">
        <div className="flex flex-col text-sm">
          tests started{" "}
          <span className="text-text text-2xl">{testStarted}</span>
        </div>
        <div className="flex flex-col text-sm">
          tests completed{" "}
          <span className="text-text text-2xl">{testCompleted}</span>
        </div>
        <div className="flex flex-col text-sm">
          time typing{" "}
          <span className="text-text text-2xl">
            {formateTime(totalTypingMs / 1000)}
          </span>
        </div>
      </div>
    </div>
  );
}
