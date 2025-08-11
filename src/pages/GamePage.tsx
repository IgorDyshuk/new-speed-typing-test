import WordList from "@/components/WordList";
import {LangChoice} from "@/components/LangChoice.tsx";

export default function GamePage() {
    
    return (
        <div className={"px-30"}>
            <LangChoice />
            <WordList />
        </div>
    );
}
