import { useQuery} from "@tanstack/react-query";
import WordList from "@/components/WordList";
import { useState } from "react";
import {translateWords} from "@/api/translateApi.ts";
import {LangChoice} from "@/components/LangChoice.tsx";

export default function GamePage() {
    const [selectedLang, setSelectedLang] = useState('en');

    const {data: words = [], isLoading} = useQuery<string[], Error>({
        queryKey: ["translatedWords", selectedLang],
        queryFn: () => translateWords(selectedLang),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })

    return (
        <div className={"px-30"}>
            <LangChoice setSelectedLang={setSelectedLang} />
            <WordList words={words} isLoading={isLoading} />
        </div>
    );
}
