import {LangChoice} from "@/components/LangChoice.tsx";
import WordList from "@/components/WordList.tsx";

export default function GamePage() {

    return (
        <div className={"max-w-5/6 flex flex-col"}>
            <LangChoice/>
            <WordList/>

        </div>
    )
}