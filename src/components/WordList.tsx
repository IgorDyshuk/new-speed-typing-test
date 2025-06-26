import {Skeleton} from "@/components/ui/skeleton.tsx";

export default function WordList({words, isLoading}: {words: string[], isLoading: boolean}) {
    const getRandomWords = (arr:string[], count:number) =>
        Array.from({length:count}, () => arr[Math.floor(Math.random() * arr.length)]);


    if (isLoading) {
        return (
            <div className="flex flex-wrap gap-2 overflow-hidden max-h-[12rem] py-3">
                {Array.from({length: 35}).map((_, i) => (
                    <Skeleton
                        key={i}
                        className="inline-block mx-[0.4em] my-[0.58em] h-8.5 rounded bg-muted"
                        style={{width: `${Math.floor(Math.random() * 60) + 90}px`}}
                    />
                ))}
            </div>
        );
    }

    const randomWords = getRandomWords(words, 50)
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