import { Edit2, Trash2 } from 'lucide-react';

const mealTypeConfig = {
  breakfast: { label: 'Breakfast', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  lunch: { label: 'Lunch', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
  dinner: { label: 'Dinner', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  snack: { label: 'Snack', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
};

const FoodEntryCard = ({ food, onEdit, onDelete }) => {
  const mealConfig = mealTypeConfig[food.mealType] || mealTypeConfig.snack;

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">{food.name}</h4>
          <span className={`${mealConfig.bg} ${mealConfig.text} text-xs px-2 py-0.5 rounded-full font-medium`}>
            {mealConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium text-orange-600 dark:text-orange-400">{food.calories} kcal</span>
          <span>P: {food.protein}g</span>
          <span>C: {food.carbs}g</span>
          <span>F: {food.fats}g</span>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(food)}
          className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
        >
          <Edit2 className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => onDelete(food._id, food.name)}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default FoodEntryCard;
