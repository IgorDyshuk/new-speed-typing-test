"use client";

import { Earth, Check } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LANGUAGES } from "@/lib/formatLanguage";

export function LangChoice({
  onCloseFucusTyping,
}: {
  onCloseFucusTyping?: () => void;
}) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const selectedLanguage = useLanguageStore((state) => state.language);
  const setSelectedLanguage = useLanguageStore((state) => state.setLanguage);

  const activeLanguageCode = selectedLanguage ?? LANGUAGES[0].code;

  const activeLanguage =
    LANGUAGES.find((lang) => lang.code === activeLanguageCode) ?? LANGUAGES[0];

  useEffect(() => {
    if (i18n.language !== activeLanguage.code) {
      i18n.changeLanguage(activeLanguage.code);
    }
  }, [i18n, activeLanguage]);

  const handleSelect = (lang: { label: string; code: string }) => {
    setSelectedLanguage(lang.code);
    i18n.changeLanguage(lang.code);
    setOpen(false);
    onCloseFucusTyping?.();
  };

  return (
    <div className={"flex justify-center text-main"}>
      <button
        onClick={() => setOpen(true)}
        className={
          "flex items-center justify-center gap-3 text-lg font-medium" +
          " hover:cursor-pointer"
        }
      >
        <Earth className={"w-5"} /> {activeLanguage.label}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput autoFocus placeholder="Choose language..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {LANGUAGES.map((lang) => {
              const isSelectedLanguage = activeLanguage.code === lang.label;
              return (
                <CommandItem
                  key={lang.code}
                  onSelect={() => handleSelect(lang)}
                  className="flex items-center gap-2"
                >
                  {isSelectedLanguage ? (
                    <Check className="w-4 h-4 shrink-0 text-main" />
                  ) : (
                    <span className="w-4 h-4" />
                  )}
                  {lang.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
