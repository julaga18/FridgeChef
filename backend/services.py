from PIL import Image
from dotenv import load_dotenv
from fastapi import HTTPException
import google.generativeai as genai
from backend.configuration import  gemini_model


def analyze_image_with_gemini(image_stream):
    try:
        img = Image.open(image_stream)
        prompt = "You are a kitchen assistant. Your task is to identify all edible products in the image. Return only a list of the found ingredients, each on a new line. Do not add any extra descriptions. Respond in English."
        response = gemini_model.generate_content([prompt, img])
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during image analysis: {e}")