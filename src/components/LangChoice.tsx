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

export function LangChoice() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("English");

  const languages = [
    // European languages
    { label: "English", code: "en" },
    { label: "German", code: "de" },
    { label: "French", code: "fr" },
    { label: "Spanish", code: "es" },
    { label: "Italian", code: "it" },
    { label: "Portuguese", code: "pt" },
    { label: "Dutch", code: "nl" },
    { label: "Polish", code: "pl" },
    { label: "Russian", code: "ru" },
    { label: "Ukrainian", code: "uk" },
    { label: "Czech", code: "cs" },
    { label: "Hungarian", code: "hu" },

    // Asian languages
    { label: "Chinese", code: "zh" },
    { label: "Japanese", code: "ja" },
    { label: "Korean", code: "ko" },

    // Additional languages
    { label: "Swedish", code: "sv" },
    { label: "Turkish", code: "tr" },
    { label: "Arabic", code: "ar" },
    { label: "Hindi", code: "hi" },
    { label: "Romanian", code: "ro" },
  ];

  useEffect(() => {
    const current =
      languages.find((l) => l.code === i18n.language) || languages[0];
    setSelected(current.label);
  }, [i18n.language]);

  const handleSelect = (lang: { label: string; code: string }) => {
    setSelected(lang.label);
    i18n.changeLanguage(lang.code);
    setOpen(false);
  };

  return (
    <div className={"flex justify-center text-main"}>
      <button
        onClick={() => setOpen(true)}
        className={
          "flex items-center justify-center gap-3 text-lg font-[500]" +
          " hover:cursor-pointer"
        }
      >
        <Earth className={"w-5"} /> {selected}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Choose language..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {languages.map((lang) => {
              const isSelected = selected === lang.label;
              return (
                <CommandItem
                  key={lang.code}
                  onSelect={() => handleSelect(lang)}
                  className="flex items-center gap-2"
                >
                  {isSelected ? (
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
