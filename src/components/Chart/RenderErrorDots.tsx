import type { DotProps } from "recharts";
import "./animation.css";

const RenderErrorDot = ({
  cx,
  cy,
  payload,
}: DotProps & {
  payload?: { errors?: number; order?: number };
}): React.ReactElement<SVGElement> => {
  const errors = payload?.errors ?? 0;

  if (cx == null || cy == null || errors === 0) {
    return (<g />) as React.ReactElement<SVGElement>;
  }

  const order = payload?.order ?? 0;

  const size = 3;
  return (
    <g
      style={{
        opacity: 0,
        animation: "error-dot-fade 260ms ease forwards",
        animationDelay: `${order * 40}ms`, // если хочешь задержку по секунде
      }}
    >
      <line
        x1={cx - size}
        y1={cy - size}
        x2={cx + size}
        y2={cy + size}
        stroke="var(--color-error)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <line
        x1={cx - size}
        y1={cy + size}
        x2={cx + size}
        y2={cy - size}
        stroke="var(--color-error)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  ) as React.ReactElement<SVGElement>;
};

export default RenderErrorDot;
