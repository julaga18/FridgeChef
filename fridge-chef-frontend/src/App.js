import React, { useState } from 'react';
import './App.css'; 
import UploadView from './components/UploadView';
import RecipeListView from './components/RecipeListView';
import RecipeDetailView from './components/RecipeDetailView';
import { ChefHat } from 'lucide-react'; 

function App() {
  const [view, setView] = useState('upload'); 
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleRecipesFound = (recipesData) => {
    setRecipes(recipesData);
    setView('list');
  };

  const handleRecipeSelect = (recipeSummary) => {
    setSelectedRecipe(recipeSummary);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedRecipe(null);
  };
  
  const handleStartOver = () => {
    setView('upload');
    setRecipes([]);
    setSelectedRecipe(null);
  };

  
  const renderView = () => {
    switch (view) {
      case 'list':
        return <RecipeListView recipes={recipes} onRecipeSelect={handleRecipeSelect} onStartOver={handleStartOver} />;
      case 'detail':
        return <RecipeDetailView recipeSummary={selectedRecipe} onBack={handleBackToList} />;
      case 'upload':
      default:
        return <UploadView onRecipesFound={handleRecipesFound} />;
    }
  };

  
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 sm:gap-4 mb-2">
            <ChefHat className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Fridge Chef
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Turn the contents of your fridge into a delicious dish!
          </p>
        </header>

        <main>
          {renderView()}
        </main>
        
        <footer className="text-center mt-16 text-sm text-gray-400">
            <p>This app is using Gemini AI and the Spoonacular API.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;