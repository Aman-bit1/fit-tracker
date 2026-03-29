import { useState } from 'react';
import { Search as SearchIcon, Plus, Flame, Utensils } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';

const quickFoods = ['Dal', 'Rice', 'Roti', 'Paneer', 'Chicken', 'Egg', 'Omelette', 'Samosa'];

const Search = () => {
  const { searchFoods, addFood } = useData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mealType, setMealType] = useState('lunch');
  const [addedItems, setAddedItems] = useState(new Set());

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const data = await searchFoods(query);
      setResults(data || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = async (term) => {
    setQuery(term);
    setIsSearching(true);
    try {
      const data = await searchFoods(term);
      setResults(data || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFood = (food) => {
    setSelectedFood(food);
    setIsModalOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!selectedFood) return;
    
    await addFood({
      name: selectedFood.name,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fats: selectedFood.fats,
      mealType,
      date: new Date()
    });
    
    setAddedItems(prev => new Set([...prev, selectedFood.name]));
    setIsModalOpen(false);
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(selectedFood.name);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add Food</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Search and add foods to your log</p>
      </div>

      {/* Search Box */}
      <div className="card p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods..."
              className="input pl-10"
              autoFocus
            />
          </div>
          <button type="submit" disabled={!query.trim() || isSearching} className="btn-primary">
            {isSearching ? '...' : 'Search'}
          </button>
        </form>

        {/* Quick Search */}
        <div className="flex flex-wrap gap-2 mt-3">
          {quickFoods.map((term) => (
            <button
              key={term}
              onClick={() => handleQuickSearch(term)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                query.toLowerCase() === term.toLowerCase()
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isSearching ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 mt-4">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-sm text-gray-500 mb-3">{results.length} results for "{query}"</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {results.map((food, index) => (
              <div 
                key={index} 
                className={`card p-4 transition-all ${
                  addedItems.has(food.name) 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                    : 'hover:shadow-md cursor-pointer'
                }`}
                onClick={() => !addedItems.has(food.name) && handleAddFood(food)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{food.name}</h4>
                    <p className="text-xs text-gray-500">{food.servingSize}</p>
                  </div>
                  {addedItems.has(food.name) ? (
                    <span className="text-emerald-500 text-sm font-medium">✓ Added</span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddFood(food); }}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-emerald-600" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="font-semibold text-sm text-orange-600">{food.calories}</p>
                    <p className="text-xs text-gray-500">kcal</p>
                  </div>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="font-semibold text-sm text-emerald-600">{food.protein}g</p>
                    <p className="text-xs text-gray-500">P</p>
                  </div>
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="font-semibold text-sm text-amber-600">{food.carbs}g</p>
                    <p className="text-xs text-gray-500">C</p>
                  </div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-semibold text-sm text-blue-600">{food.fats}g</p>
                    <p className="text-xs text-gray-500">F</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <SearchIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">No results for "{query}"</p>
          <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Search for foods to add</p>
          <p className="text-sm text-gray-400 mt-1">Try the quick search buttons above</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add to Food Log">
        {selectedFood && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white">{selectedFood.name}</h3>
              <p className="text-sm text-gray-500">{selectedFood.servingSize}</p>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="font-semibold text-orange-600">{selectedFood.calories}</p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
                <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="font-semibold text-emerald-600">{selectedFood.protein}g</p>
                  <p className="text-xs text-gray-500">Protein</p>
                </div>
                <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="font-semibold text-amber-600">{selectedFood.carbs}g</p>
                  <p className="text-xs text-gray-500">Carbs</p>
                </div>
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-blue-600">{selectedFood.fats}g</p>
                  <p className="text-xs text-gray-500">Fats</p>
                </div>
              </div>
            </div>

            <div>
              <label className="label">Meal</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'breakfast', label: '🌅 Breakfast' },
                  { value: 'lunch', label: '☀️ Lunch' },
                  { value: 'dinner', label: '🌙 Dinner' },
                  { value: 'snack', label: '🍿 Snack' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMealType(option.value)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      mealType === option.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleConfirmAdd} className="btn-primary flex-1">
                Add to Log
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Search;
