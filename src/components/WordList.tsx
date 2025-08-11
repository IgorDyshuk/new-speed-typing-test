import { useTranslation } from "react-i18next";

export default function WordList() {
    const { t } = useTranslation()
    const getRandomWords = (arr:string[], count:number) =>
        Array.from({length:count}, () => arr[Math.floor(Math.random() * arr.length)]);

    const text = t("text").split(" ")
    const randomWords = getRandomWords(text, 100)
    return (
        <div className="flex flex-wrap overflow-hidden max-h-[12rem]">
            {randomWords.map((word, index) => (
                <span key={index} className={"inline-block mx-[0.3em] my-[0.25em] text-[32px] font-[450] "}>
                    {word}
                 </span>
            ))}
        </div>
    )
}