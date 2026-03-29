import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Minus, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

const units = [
  { value: 'g', label: 'grams (g)', factor: 1 },
  { value: 'kg', label: 'kilograms (kg)', factor: 1000 },
  { value: 'ml', label: 'milliliters (ml)', factor: 1 },
  { value: 'l', label: 'liters (L)', factor: 1000 },
  { value: 'oz', label: 'ounces (oz)', factor: 28.35 },
  { value: 'lb', label: 'pounds (lb)', factor: 453.6 },
  { value: 'cup', label: 'cup', factor: 240 },
  { value: 'tbsp', label: 'tablespoon', factor: 15 },
  { value: 'tsp', label: 'teaspoon', factor: 5 },
  { value: 'piece', label: 'piece', factor: 1 },
  { value: 'serving', label: 'serving', factor: 1 },
];

const mealTypeOptions = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍿' }
];

const FoodForm = ({ food, onSubmit, onCancel, isLoading, initialMealType }) => {
  const { searchFoods } = useData();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    servingSize: '100',
    servingUnit: 'g',
    quantity: 1,
    mealType: initialMealType || 'snack',
    date: new Date().toISOString().split('T')[0]
  });

  const [selectedFood, setSelectedFood] = useState(null);
  const [baseNutrition, setBaseNutrition] = useState(null);

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || '',
        calories: food.calories?.toString() || '',
        protein: food.protein?.toString() || '',
        carbs: food.carbs?.toString() || '',
        fats: food.fats?.toString() || '',
        servingSize: food.servingSize?.replace(/[^0-9.]/g, '') || '100',
        servingUnit: food.servingSize?.includes('g') ? 'g' : 'serving',
        quantity: 1,
        mealType: food.mealType || initialMealType || 'snack',
        date: food.date ? new Date(food.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
      setSelectedFood(food);
      setBaseNutrition({
        calories: food.calories || 0,
        protein: food.protein || 0,
        carbs: food.carbs || 0,
        fats: food.fats || 0
      });
    }
  }, [food, initialMealType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedFood(null);
    
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchFoods(value);
      setSuggestions(results || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Search failed:', err);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuery(food.name);
    setShowSuggestions(false);
    
    const baseServing = parseFloat(food.servingSize?.replace(/[^0-9.]/g, '')) || 100;
    setFormData(prev => ({
      ...prev,
      name: food.name,
      servingSize: baseServing.toString()
    }));
    
    setBaseNutrition({
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      baseServing
    });
    
    calculateNutrition(1, baseServing, food);
  };

  const calculateNutrition = (quantity, servingSize, food = selectedFood) => {
    if (!food) return;
    
    const baseServing = parseFloat(baseNutrition?.baseServing || servingSize) || 100;
    const factor = (quantity * servingSize) / baseServing;
    
    setFormData(prev => ({
      ...prev,
      calories: Math.round((baseNutrition?.calories || food.calories) * factor).toString(),
      protein: Math.round((baseNutrition?.protein || food.protein) * factor * 10) / 10,
      carbs: Math.round((baseNutrition?.carbs || food.carbs) * factor * 10) / 10,
      fats: Math.round((baseNutrition?.fats || food.fats) * factor * 10) / 10
    }));
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(0.5, formData.quantity + delta);
    setFormData(prev => ({ ...prev, quantity: newQuantity }));
    if (selectedFood && baseNutrition) {
      calculateNutrition(newQuantity, parseFloat(formData.servingSize));
    }
  };

  const handleServingSizeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, servingSize: value }));
    if (selectedFood && baseNutrition) {
      calculateNutrition(formData.quantity, parseFloat(value));
    }
  };

  const handleUnitChange = (e) => {
    setFormData(prev => ({ ...prev, servingUnit: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      calories: parseInt(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fats: parseFloat(formData.fats) || 0,
      mealType: formData.mealType,
      date: new Date(formData.date)
    });
  };

  const handleClearSelection = () => {
    setSelectedFood(null);
    setBaseNutrition(null);
    setQuery('');
    setFormData(prev => ({
      ...prev,
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    }));
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Food Search */}
      <div ref={searchRef} className="relative">
        <label className="label">Search Food</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearch}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            className="input pl-10 pr-10"
            placeholder="Search for foods (e.g., Biryani, Dal, Chicken)"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSelection}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-card rounded-lg shadow-xl border dark:border-dark-border max-h-64 overflow-auto">
            {suggestions.map((food, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectFood(food)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-border border-b dark:border-dark-border last:border-0 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{food.name}</p>
                  <p className="text-xs text-gray-500">{food.servingSize}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-orange-500">{food.calories} kcal</p>
                  <p className="text-xs text-gray-400">
                    P:{food.protein}g C:{food.carbs}g F:{food.fats}g
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {showSuggestions && query.length >= 2 && suggestions.length === 0 && !isSearching && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-card rounded-lg shadow-xl border dark:border-dark-border p-4 text-center text-gray-500">
            No foods found. Add manually below.
          </div>
        )}
      </div>

      {/* Selected Food Info */}
      {selectedFood && (
        <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{selectedFood.name}</p>
              <p className="text-xs text-gray-500">Base: {selectedFood.servingSize}</p>
            </div>
            <button type="button" onClick={handleClearSelection} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quantity and Serving */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Quantity</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuantityChange(-0.5)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 1;
                setFormData(prev => ({ ...prev, quantity: val }));
                if (selectedFood && baseNutrition) {
                  calculateNutrition(val, parseFloat(formData.servingSize));
                }
              }}
              className="input text-center"
              min="0.5"
              step="0.5"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(0.5)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-border hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div>
          <label className="label">Serving Size</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.servingSize}
              onChange={handleServingSizeChange}
              className="input flex-1"
              min="1"
            />
            <select
              value={formData.servingUnit}
              onChange={handleUnitChange}
              className="input w-24"
            >
              {units.map(unit => (
                <option key={unit.value} value={unit.value}>{unit.value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Nutrition (Auto-calculated or Manual) */}
      <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
        <p className="text-xs font-medium text-gray-500 mb-2">Nutrition (per {formData.quantity} × {formData.servingSize}{formData.servingUnit})</p>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="text-xs text-orange-500 block mb-1">Calories</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value }))}
              className="input py-1 text-center text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-green-500 block mb-1">Protein (g)</label>
            <input
              type="number"
              value={formData.protein}
              onChange={(e) => setFormData(prev => ({ ...prev, protein: e.target.value }))}
              className="input py-1 text-center text-sm"
              placeholder="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="text-xs text-amber-500 block mb-1">Carbs (g)</label>
            <input
              type="number"
              value={formData.carbs}
              onChange={(e) => setFormData(prev => ({ ...prev, carbs: e.target.value }))}
              className="input py-1 text-center text-sm"
              placeholder="0"
              step="0.1"
            />
          </div>
          <div>
            <label className="text-xs text-blue-500 block mb-1">Fats (g)</label>
            <input
              type="number"
              value={formData.fats}
              onChange={(e) => setFormData(prev => ({ ...prev, fats: e.target.value }))}
              className="input py-1 text-center text-sm"
              placeholder="0"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Meal Type */}
      <div>
        <label className="label">Meal Type</label>
        <div className="grid grid-cols-4 gap-2">
          {mealTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mealType: option.value }))}
              className={`p-2 rounded-lg text-center transition-all ${
                formData.mealType === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-lg block">{option.emoji}</span>
              <span className="text-xs">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="label">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="input"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isLoading || !formData.name || !formData.calories} 
          className="btn-primary flex-1"
        >
          {isLoading ? 'Adding...' : 'Add to Log'}
        </button>
      </div>
    </form>
  );
};

export default FoodForm;
