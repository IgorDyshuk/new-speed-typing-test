import {useQuery} from "@tanstack/react-query";
import WordList from "@/components/WordList";
import {useState} from "react";
import {translateWords} from "@/api/translateApi.ts";
import {LangChoice} from "@/components/LangChoice.tsx";
import {getWordsByLang} from "@/assets/words.ts";

export default function GamePage() {
    const [selectedLang, setSelectedLang] = useState('en');

    const {data: words = [], isLoading} = useQuery<string[], Error>({
        queryKey: ["translatedWords", selectedLang],
        queryFn: async () => {
            const fallbackLang = ["en", "ru", "uk"];

            if (fallbackLang.includes(selectedLang)) {
                return getWordsByLang(selectedLang);
            }

            try {
                return await translateWords(selectedLang)
            } catch (err) {
                console.log(err)
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })

    return (
        <div className={"px-30"}>
            <LangChoice setSelectedLang={setSelectedLang}/>
            <WordList words={words} isLoading={isLoading}/>
        </div>
    );
}
