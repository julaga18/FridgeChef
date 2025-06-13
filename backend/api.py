import uuid
import requests
from typing import List
from fastapi import File, UploadFile, HTTPException, Path, APIRouter
from backend.models import IngredientDetail, RecipeSummary, RecipeDetail, VerifyRequest
import re
from backend.services import analyze_image_with_gemini
from backend.configuration import SPOONACULAR_API_KEY
from backend.state import sessions

router = APIRouter()

@router.post("/upload", tags=["Step 1: Upload"])
async def upload_image_and_start_session(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    ingredients_text = analyze_image_with_gemini(image.file)
    initial_ingredients = [item.strip() for item in ingredients_text.strip().split('\n') if item.strip()]
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"initial_ingredients": initial_ingredients, "verified_ingredients": None}
    return {"session_id": session_id, "message": "Image analyzed. Please verify the ingredients.", "detected_ingredients": initial_ingredients}

@router.post("/verify-ingredients/{session_id}", tags=["Step 2: Verify"])
async def verify_ingredients(session_id: str = Path(...), payload: VerifyRequest = ...):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    sessions[session_id]["verified_ingredients"] = payload.verified_ingredients
    return {"session_id": session_id, "message": "Ingredients updated. You can now request recipes.", "your_ingredients": payload.verified_ingredients}


@router.get("/recipes/{session_id}", response_model=List[RecipeSummary], tags=["Step 3: Find Recipes"])
async def find_recipes(session_id: str = Path(...)):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    verified_ingredients = sessions[session_id].get("verified_ingredients")
    if not verified_ingredients:
        raise HTTPException(status_code=400, detail="Ingredients have not been verified yet.")

    url = "https://api.spoonacular.com/recipes/findByIngredients"
    params = {"apiKey": SPOONACULAR_API_KEY, "ingredients": ",".join(verified_ingredients), "number": 6, "ranking": 1, "ignorePantry": True}
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        found_recipes = response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error searching for recipes: {e}")

    summaries = []
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        found_recipes = response.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error searching for recipes: {e}")


    if isinstance(found_recipes, list):
        summaries = [
            RecipeSummary(
                id=recipe.get("id"),
                title=recipe.get("title"),
                image=recipe.get("image"),
                used_ingredients=[IngredientDetail(**item) for item in recipe.get("usedIngredients", [])],
                missed_ingredients=[IngredientDetail(**item) for item in recipe.get("missedIngredients", [])],
                unused_ingredients=[IngredientDetail(**item) for item in recipe.get("unusedIngredients", [])]
            )
            for recipe in found_recipes if recipe.get("image") 
        ]
    else:
        summaries = []

    return summaries[:6]

@router.get("/recipe-details/{recipe_id}", response_model=RecipeDetail, tags=["Step 4: Get Recipe Details"])
async def get_recipe_details(recipe_id: int = Path(..., description="The ID of the recipe you want details for.")):
    url = f"https://api.spoonacular.com/recipes/{recipe_id}/information"
    params = {"apiKey": SPOONACULAR_API_KEY, "includeNutrition": False}
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        details = response.json()

        if details.get("image") and isinstance(details["image"], str):
            details["image"] = re.sub(r'-\d+x\d+', '-636x393', details["image"])
        return RecipeDetail(**details)
        
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Recipe not found.")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error fetching recipe details: {e}")