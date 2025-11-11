import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useEffect, useState } from "react";
import Logo from "@/assets/logo.svg?react";
import { useLocation, useNavigate } from "react-router-dom";

// TODO: поставить иконку

export default function Header() {
  const { started, finished, restart } = useGameSessionStore();
  const [accent, setAccent] = useState<string>("text-text");
  const [visible, setVisible] = useState<string>("opacity-100");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setAccent(started && !finished ? "text-sub" : "text-text");
  }, [started, finished, setAccent]);

  useEffect(() => {
    setVisible(started && !finished ? "opacity-0" : "opacity-100");
  }, [started, finished, setVisible]);

  const handleHeaderClick = () => {
    if (location.pathname === "/") {
      restart();
    } else {
      navigate("/", { replace: false });
    }
  };

  return (
    <header className="flex justify-between py-8">
      <button
        onClick={handleHeaderClick}
        className="flex items-center hover:cursor-pointer"
      >
        <span className="flex h-8 w-8 items-center justify-center text-main">
          <Logo className="h-8 w-8" />
        </span>
        <h1
          className={` text-3xl font-bold transition-text duration-300 ${accent}`}
        >
          TypePulse
        </h1>
      </button>
      <div className={`text-sub transition-opacity duration-300 ${visible}`}>
        account
      </div>
    </header>
  );
}
