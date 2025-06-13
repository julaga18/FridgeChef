import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Loader2, Clock } from 'lucide-react';

function RecipeDetailView({ recipeSummary, onBack }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`/recipe-details/${recipeSummary.id}`);
        setDetails(response.data);
      } catch (err) {
        setError('Failed to retrieve recipe details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (recipeSummary?.id) {
        fetchDetails();
    }
  }, [recipeSummary.id]);

  const handleImageError = (e) => {
    e.currentTarget.onerror = null; 
    e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Available"; 
  };
  

  const handleIngredientImageError = (e) => {
    e.currentTarget.onerror = null; 
    e.currentTarget.src = "https://placehold.co/100x100?text=N/A";
  };

  const shoppingList = recipeSummary.missed_ingredients;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-0">
      <button
        onClick={onBack}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to list
      </button>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
      )}
      
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {details && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            {/* Layer 1: The Image */}
            <img 
              src={details.image} 
              alt={details.title} 
              className="w-full h-64 md:h-96 object-cover" 
              onError={handleImageError}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white shadow-lg mb-2">{details.title}</h2>
              {details.readyInMinutes && (
                <div className="flex items-center gap-2 text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
                  <Clock className="w-4 h-4" />
                  <span>Preparation time: {details.readyInMinutes} minutes</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="md:col-span-1">
                <h3 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Shopping List</h3>
                {shoppingList.length > 0 ? (
                  <ul className="space-y-3">
                    {shoppingList.map(item => (
                      <li key={item.id} className="flex items-center gap-4">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-contain bg-gray-100 p-1 rounded-md"
                          onError={handleIngredientImageError}
                        />
                        <span className="text-gray-800">{item.original}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Congratulations! You have all the ingredients you need.</p>
                )}
              </div>

              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Instructions</h3>
                {details.instructions ? (
                  <div 
                    className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: details.instructions }} 
                  />
                ) : (
                  <p className="text-gray-600">
                    No instructions available. Try searching for the recipe on the: 
                    <a href={details.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      original source
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeDetailView;