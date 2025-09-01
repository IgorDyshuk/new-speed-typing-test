import { RotateCcw } from "lucide-react";
import "./RestartButtonStyles.css";

export default function RestartButton() {
  return (
    <button id="restart-btn">
      <RotateCcw strokeWidth={"3"} />
    </button>
  );
}
