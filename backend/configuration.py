from dotenv import load_dotenv
import google.generativeai as genai
import os


load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")
if not GOOGLE_API_KEY or not SPOONACULAR_API_KEY:
    raise RuntimeError("API keys for Google and Spoonacular must be set in .env file")
genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-flash')