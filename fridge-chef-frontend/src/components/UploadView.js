import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Upload, X, Plus, Search, RotateCcw } from "lucide-react"; 

function UploadView({ onRecipesFound }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [initialIngredients, setInitialIngredients] = useState([]); 
  const [ingredients, setIngredients] = useState([]); 
  const [newIngredient, setNewIngredient] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetButton, setShowResetButton] = useState(false); 


  useEffect(() => {
    const initialSorted = [...initialIngredients].sort().join(',');
    const currentSorted = [...ingredients].sort().join(',');
    setShowResetButton(initialSorted !== currentSorted);
  }, [ingredients, initialIngredients]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (fileToUpload) => {
    setIsLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", fileToUpload);

    try {
      const response = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Zapisujemy listę do OBU stanów
      setInitialIngredients(response.data.detected_ingredients);
      setIngredients(response.data.detected_ingredients);
      setSessionId(response.data.session_id);
    } catch (err) {
      setError("Error while analyzing the photo. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient("");
    }
  };
  
  const handleResetIngredients = () => {
    setIngredients(initialIngredients);
  };

  const handleSuggestRecipes = async () => {
    if (!sessionId) {
      setError("No session. Try uploading the photo again.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      await axios.post(`/verify-ingredients/${sessionId}`, {
        verified_ingredients: ingredients,
      });
      const response = await axios.get(`/recipes/${sessionId}`);
      onRecipesFound(response.data);
    } catch (err) {
      setError("Couldn't find recipes. Try with other ingredients");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-0 space-y-8">
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Step 1: Upload a picture of your fridge</h2>
        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" id="file-upload" />
        <label
          htmlFor="file-upload"
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${
            preview ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {preview ? (
            <>
              <img src={preview} alt="Podgląd lodówki" className="w-full h-full object-contain rounded-lg" />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-800 font-semibold px-3 py-1.5 rounded-md shadow-md cursor-pointer hover:bg-white flex items-center gap-2 text-sm">
                <Upload className="w-4 h-4" />
                Change photo
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click here to upload a photo</p>
            </div>
          )}
        </label>
        {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      </section>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      )}

      {ingredients.length > 0 && !isLoading && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Step 2: Check ingredients</h2>
            {showResetButton && (
              <button onClick={handleResetIngredients} className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                <RotateCcw className="w-4 h-4" />
                Reset list
              </button>
            )}
          </div>
          <div className="mb-6">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md border">
                  <span className="text-gray-700">{ingredient}</span>
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    disabled={ingredients.length <= 1}
                    className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                    aria-label="Remove ingredient"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={handleAddIngredient} className="flex gap-2 mb-6">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add missing ingredient..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newIngredient}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:bg-gray-400"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>
          <button
            onClick={handleSuggestRecipes}
            disabled={isLoading || ingredients.length === 0}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
          >
            <Search className="w-5 h-5" />
            Suggest recipes
          </button>
        </section>
      )}
    </div>
  );
}

export default UploadView;