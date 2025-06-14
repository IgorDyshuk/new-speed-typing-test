from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from translate import Translator
import os

app = FastAPI()

# Разрешаем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/translate")
def translate_words(to_lang: str = Query(..., alias="lang")):
    try:
        # Получаем путь к words.txt в той же папке, что и этот файл
        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, "words.txt")

        with open(file_path, "r", encoding="utf-8") as file:
            words = file.read()
            translator = Translator(to_lang=to_lang)
            translation = translator.translate(words)
            return {
                "original": words,
                "translated": translation.split()
            }

    except Exception as e:
        return {"error": str(e)}
