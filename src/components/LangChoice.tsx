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

//TODO: Добавить стейст-менеджер зюстанд и с помощью его запонминать какакя язык был выбран последний и вставлять его при повторном открытии страницы
export function LangChoice() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("english");

  const languages = [
    { label: "english", code: "en" },
    { label: "german", code: "de" },
    { label: "french", code: "fr" },
    { label: "spanish", code: "es" },
    { label: "italian", code: "it" },
    { label: "portuguese", code: "pt" },
    { label: "dutch", code: "nl" },
    { label: "polish", code: "pl" },
    { label: "russian", code: "ru" },
    { label: "ukrainian", code: "uk" },
    { label: "czech", code: "cs" },
    { label: "hungarian", code: "hu" },

    { label: "chinese", code: "zh" },
    { label: "japanese", code: "ja" },
    { label: "korean", code: "ko" },

    { label: "swedish", code: "sv" },
    { label: "turkish", code: "tr" },
    { label: "arabic", code: "ar" },
    { label: "hindi", code: "hi" },
    { label: "romanian", code: "ro" },
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
