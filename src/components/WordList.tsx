import {eng_words} from "@/assets/words.ts";

export default function WordList() {
    const getRandomWords = (arr:string[], count:number) =>
        Array.from({length:count}, () => arr[Math.floor(Math.random() * arr.length)]);

    const randomWords = getRandomWords(eng_words, 50)

    return (
            <div className="flex flex-wrap ">
                {randomWords.map((word, index) => (
                    <span key={index} className={"inline-block mx-[0.3em] my-[0.25em] text-[32px] font-[450] "}>
            {word}
          </span>
                ))}
            </div>
    )
}