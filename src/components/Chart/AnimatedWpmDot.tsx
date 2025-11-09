import type { DotProps } from "recharts";
import "./animation.css";

const AnimatedWpmDot = ({
  cx,
  cy,
  payload,
}: DotProps & { payload?: { order?: number } }) => {
  if (cx == null || cy == null) return null;

  const order = payload?.order ?? 0;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="var(--color-sub)"
      stroke="var(--color-sub)"
      strokeWidth={2}
      style={{
        opacity: 0,
        transformOrigin: `${cx}px ${cy}px`,
        animation: "chart-dot-fade 260ms ease forwards",
        animationDelay: `${order * 40}ms`,
      }}
    />
  );
};

export default AnimatedWpmDot;
