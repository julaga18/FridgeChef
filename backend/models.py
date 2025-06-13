from typing import List, Optional
from pydantic import BaseModel, Field

class IngredientDetail(BaseModel):
    id: int
    name: str
    amount: float
    unit: str
    image: str
    original: str

class RecipeSummary(BaseModel):
    id: int
    title: str
    image: str
    used_ingredients: List[IngredientDetail]
    missed_ingredients: List[IngredientDetail]
    unused_ingredients: List[IngredientDetail]

class RecipeDetail(BaseModel):
    id: int
    title: str
    image: str
    instructions: Optional[str] = Field(None, description="Step-by-step cooking instructions. Can be HTML formatted.")
    sourceUrl: Optional[str] = Field(None, description="Link to the original recipe source.")
    readyInMinutes: Optional[int] = Field(None, description="Estimated cooking time.")

class VerifyRequest(BaseModel):
    verified_ingredients: List[str]