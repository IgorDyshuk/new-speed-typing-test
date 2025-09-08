import { useLayoutEffect, useState, type RefObject } from "react";

//TODO: ревертнуть полследний коммит и добавить чтобы курсор появлялся только тогда когда начинают печатать(появлять его через опасити)
type CaretPos = { left: number; top: number; height: number } | null;

export default function TypingCaret({
  containerRef,
  deps = [],
  started = false,
  idle = false,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  deps?: readonly unknown[];
  started: boolean;
  idle?: boolean;
}) {
  const [pos, setPos] = useState<CaretPos>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const el = container.querySelector(
      '[data-current="true"]',
    ) as HTMLElement | null;
    if (!el) return setPos(null);
    const rect = el.getBoundingClientRect();
    const crect = container.getBoundingClientRect();
    const side = el.getAttribute("data-side") || "before"; // before|after
    const left = (side === "after" ? rect.right : rect.left) - crect.left - 1; // slight offset
    setPos({ left, top: rect.top - crect.top, height: rect.height });
  }, deps);

  if (!pos) return null;

  return (
    <span
      className={`typing-caret pointer-events-none absolute bg-caret z-10 ${!started ? "caret-blink" : ""} ${idle ? "blink-caret" : ""}`}
      style={{
        left: pos.left - 1.5,
        top: pos.top,
        height: pos.height,
        width: 3,
        borderRadius: 2,
        transition: "left 90ms ease, top 90ms ease, height 90ms ease",
        willChange: "left, top",
      }}
    />
  );
}
