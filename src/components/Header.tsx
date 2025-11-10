import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useEffect, useState } from "react";

// TODO: поставить иконку

export default function Header() {
  const { started, finished } = useGameSessionStore();
  const [accent, setAccent] = useState<string>("text-text");
  const [visible, setVisible] = useState<string>("opacity-100");

  useEffect(() => {
    setAccent(started && !finished ? "text-sub" : "text-text");
  }, [started, finished, setAccent]);

  useEffect(() => {
    setVisible(started && !finished ? "opacity-0" : "opacity-100");
  }, [started, finished, setVisible]);

  return (
    <header className="flex justify-between py-8">
      <div className="flex">
        <h1
          className={` text-3xl font-bold transition-text duration-300 ${accent}`}
        >
          TypePulse
        </h1>
      </div>
      <div className={`text-sub transition-opacity duration-300 ${visible}`}>
        account
      </div>
    </header>
  );
}
