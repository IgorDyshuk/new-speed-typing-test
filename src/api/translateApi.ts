import axios from "axios";

interface TranslateResponse {
    original: string;
    translated: string[];
}

const translateApi = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-type': 'application/json',
    }
})

export const translateWords = async (lang: string,): Promise<string[]> => {
    const res = await translateApi.get<TranslateResponse>(`translate?lang=${lang}`);
    return res.data.translated;
}