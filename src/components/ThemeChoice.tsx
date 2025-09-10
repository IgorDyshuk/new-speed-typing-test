import { useEffect, useRef, useState } from "react";
import { Paintbrush, Check } from "lucide-react";
import { useTheme } from "@/components/themeProvider";
import type { Theme } from "@/components/themeProvider";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

function labelize(name: string) {
  return name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function applyDomTheme(name: Theme) {
  document.documentElement.setAttribute("data-theme", name);
}

function Palette({ name }: { name: Theme }) {
  return (
    <span
      data-theme={name}
      className="relative inline-flex gap-0.5 h-5 w-14 items-center justify-between rounded-full px-1 ml-auto"
      style={{ background: "var(--bg-color)" }}
      aria-hidden
    >
      <span
        className="h-3 w-3 rounded-full"
        style={{ background: "var(--main-color)" }}
      />
      <span
        className="h-3 w-3 rounded-full"
        style={{ background: "var(--sub-color)" }}
      />
      <span
        className="h-3 w-3 rounded-full"
        style={{ background: "var(--text-color)" }}
      />
    </span>
  );
}

export function ThemeChoice({
  onCloseFucusTyping,
}: {
  onCloseFucusTyping?: () => void;
}) {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Theme>(theme);

  const listRef = useRef<HTMLDivElement | null>(null);
  const revertingRef = useRef(false);

  useEffect(() => {
    setSelected(theme);
  }, [theme]);

  const handleSelect = (name: Theme) => {
    setSelected(name);
    setTheme(name);
    setOpen(false);
    onCloseFucusTyping?.();
  };

  const preview = (name: Theme) => {
    if (revertingRef.current) return;
    applyDomTheme(name);
  };

  const revert = () => {
    revertingRef.current = true;
    applyDomTheme(selected);
    requestAnimationFrame(() => {
      revertingRef.current = false;
    });
  };

  const previewCurrentHighlighted = () => {
    const root = listRef.current;
    if (!root) return;
    const el =
      (root.querySelector('[data-selected="true"]') as HTMLElement | null) ||
      (root.querySelector('[aria-selected="true"]') as HTMLElement | null);
    const name = el?.getAttribute("data-theme-name") as Theme | null;
    if (name) preview(name);
  };

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(previewCurrentHighlighted);
  }, [open]);

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End", "PageDown", "PageUp"];
    if (keys.includes(e.key)) {
      requestAnimationFrame(previewCurrentHighlighted);
    }
  };

  return (
    <div className="mr-auto flex justify-end text-main">
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 text-lg font-[500] hover:cursor-pointer"
      >
        <Paintbrush className="w-5" />
        {labelize(selected)}
      </button>

      <CommandDialog
        open={open}
        onOpenChange={(v) => {
          if (!v) {
            revert();
            onCloseFucusTyping?.();
          }
          setOpen(v);
        }}
        modal={false}
      >
        <CommandInput placeholder="Choose theme..." />
        <CommandList
          ref={listRef}
          onMouseLeave={revert}
          onKeyDown={onListKeyDown}
        >
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {themes.map((name: Theme) => {
              const isSelected = selected === name;
              return (
                <CommandItem
                  key={name}
                  data-theme-name={name}
                  onSelect={() => handleSelect(name)}
                  onMouseEnter={() => preview(name)}
                  aria-selected={isSelected}
                  className="flex items-center gap-2"
                >
                  {isSelected ? (
                    <Check className="w-4 h-4 shrink-0 text-main" />
                  ) : (
                    <span className="w-4 h-4" />
                  )}
                  {labelize(name)}
                  <Palette name={name} />
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
