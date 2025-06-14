"use client"

import {
    CreditCard,
    Settings,
    User,
    Earth
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import {useState} from "react";

export function LangChoice() {
    const [open, setOpen] = useState(false)

    const handleClick = async () => {
        setOpen(true)
    }

    return (
        <div className={"flex justify-center"}>
            <button
                onClick={handleClick}
                className={"flex items-center justify-center gap-3 text-lg font-[500]" +
                    " hover: cursor-pointer"}
            >
                <Earth className={"w-5"}/> english
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..."/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem>
                            <span>English</span>
                        </CommandItem>
                        <CommandItem>
                            <span>Ukrainian</span>
                        </CommandItem>
                        <CommandItem>
                            <span>Russian</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator/>
                    <CommandGroup heading="Other languages:">
                        <CommandItem>
                            <User/>
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <CreditCard/>
                            <span>Billing</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                            <Settings/>
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    )
}
