import React from 'react';
import { RotateCcw } from 'lucide-react';

function RecipeListView({ recipes, onRecipeSelect, onStartOver }) {
  // Ten filtr jest nadal przydatny, aby odsiać przepisy, które w ogóle nie mają linku.
  const recipesWithImages = recipes.filter(recipe => recipe && recipe.image);

  if (!recipesWithImages || recipesWithImages.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Nothing found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find any recipes for the ingredients you entered. Please try again.
        </p>
        <button
          onClick={onStartOver}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="w-5 h-5" />
          Start over
        </button>
      </div>
    );
  }
  
  // Function for handling image loading errors
  const handleImageError = (e) => {
    // prevent a loop if the placeholder image doesn't load either
    e.currentTarget.onerror = null; 
    e.currentTarget.src = "https://placehold.co/400x300?text=Image+Not+Available"; 
  };


  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-0">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Step 3: Choose a recipe</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipesWithImages.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105"
            onClick={() => onRecipeSelect(recipe)}
          >
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-48 object-cover" 
              // <<< ZMIANA: Dodajemy obsługę błędu onError
              onError={handleImageError}
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900">{recipe.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={onStartOver}
          className="px-4 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <RotateCcw className="w-5 h-5" />
          Start over
        </button>
      </div>
    </div>
  );
}

export default RecipeListView;