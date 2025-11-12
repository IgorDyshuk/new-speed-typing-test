import { useGameSessionStore } from "@/store/useGameSessionStore";
import { useEffect, useState } from "react";
import Logo from "@/assets/logo.svg?react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const { started, finished, restart } = useGameSessionStore();
  const [visible, setVisible] = useState<string>("opacity-100");
  const navigate = useNavigate();
  const location = useLocation();

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

  const textAccent = started && !finished ? "text-sub" : "text-text";
  const logoAccent = started && !finished ? "text-sub" : "text-main";

  return (
    <header className="flex justify-between py-8">
      <button
        onClick={handleHeaderClick}
        className={`flex items-center hover:cursor-pointer `}
      >
        <span
          className={`flex h-8 w-8 items-center justify-center transition-text duration-300 ${logoAccent}`}
        >
          <Logo className="h-8 w-8" />
        </span>
        <h1
          className={` text-3xl font-bold transition-text duration-300 ${textAccent} `}
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
