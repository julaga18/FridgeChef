# FridgeChef
### Turn the contents of your fridge into a delicious dish! Fridge Chef is a smart web application that uses AI to recognize ingredients from a photo of your refrigerator and suggests recipes you can cook.

## Features
- AI Ingredient Recognition: Upload a photo, and Google's Gemini AI will identify the food items inside your fridge.
- Interactive Ingredient List: Easily add, remove, or reset the AI-detected ingredients to ensure the list is perfect.
- Recipe Suggestions: Get a list of relevant recipe ideas from the Spoonacular API based on your verified ingredients.
- Detailed Recipe View: Select a recipe to see a step-by-step instructions and a complete shopping list for any items you're missing.

## How to Use the App (User Flow)
The application guides you through a simple, step-by-step process:
**Step 1: Upload a Photo**
Click the upload area to select a photo of the inside of your fridge.
The app will display a preview and automatically send the image to the backend for analysis.
![image](https://github.com/user-attachments/assets/caa66090-d20f-4027-ba15-f54f2cba7aec)
![image](https://github.com/user-attachments/assets/055f7862-483d-4c57-940b-22299b3a10ce)


**Step 2: Verify Ingredients**
Once the AI analysis is complete, a list of detected ingredients will appear.
Review the list. You can:
Remove any incorrectly identified items by clicking the 'X' button.
Add any missing ingredients using the input field.
Reset the list back to the original AI-detected version if you make a mistake.
![image](https://github.com/user-attachments/assets/ee55612a-c4ee-443f-81c6-e6bf8e2ccd5e)

**Step 3: Get Recipes**
When you're happy with the ingredient list, click the "Suggest Recipes" button.
The app will fetch a list of recipes that you can make with what you have.

**Step 4: Choose a Recipe**
A grid of recipe cards will be displayed. Each card shows a photo and the title of a dish.
Click on any recipe card that looks interesting.
![image](https://github.com/user-attachments/assets/e21d5ba3-bb4b-49fb-943c-9b9778f0fcde)

**Step 5: Cook!**
You will be taken to a detailed view of the selected recipe.
This view includes:
A large, high-quality photo of the dish.
A "Shopping List" showing only the ingredients you need to buy.
A list of ingredients you already have that will be used.
A list of your ingredients that will not be used in this recipe.
Clear, numbered, step-by-step cooking instructions.
![image](https://github.com/user-attachments/assets/e2b5fe59-3b69-4606-9cf5-717effa8fd27)


## Tech Stack
Backend:
Framework: FastAPI
Language: Python
AI Model: Google Gemini 1.5 Flash
Recipe Data: Spoonacular API
Server: Uvicorn
Frontend:
Library: React
Styling: Tailwind CSS
API Communication: Axios
Icons: Lucide React

## Installation Instructions

1. Clone the repository
```
git clone https://github.com/your-username/fridgechef.git
cd fridgechef
```
2. Install dependencies
***Frontend***:
```
cd fridge-chef-frontend
npm install
```
***Backend***:
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
4. Set enviroment variables
Create a .env file in the project directory:
```
SPOONACULAR_API_KEY=your_spoonacular_api_key
GOOGLE_API_KEY=your_gemini_api_key
```
6. Run the app locally




  
