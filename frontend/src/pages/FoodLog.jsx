import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import FoodEntryCard from '../components/food/FoodEntryCard';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import FoodForm from '../components/food/FoodForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
const mealConfig = {
  breakfast: { label: 'Breakfast', emoji: '🌅', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  lunch: { label: 'Lunch', emoji: '☀️', bg: 'bg-green-50 dark:bg-green-900/20' },
  dinner: { label: 'Dinner', emoji: '🌙', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  snack: { label: 'Snack', emoji: '🍿', bg: 'bg-purple-50 dark:bg-purple-900/20' }
};

const FoodLog = () => {
  const { foods = [], foodTotals = {}, goals = {}, loading, loadFoods, addFood, updateFood, deleteFood } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });

  useEffect(() => {
    loadFoods(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (days) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const groupedFoods = mealOrder.reduce((acc, meal) => {
    acc[meal] = (foods || []).filter(f => f.mealType === meal);
    return acc;
  }, {});

  const handleAddFood = async (foodData) => {
    await addFood({ ...foodData, date: selectedDate });
    setIsModalOpen(false);
  };

  const handleEditFood = async (foodData) => {
    await updateFood(editingFood._id, foodData);
    setIsModalOpen(false);
    setEditingFood(null);
  };

  const handleDeleteFood = (id, name) => {
    setDeleteConfirm({ show: true, id, name: name || 'this entry' });
  };

  const confirmDelete = async () => {
    await deleteFood(deleteConfirm.id);
    setDeleteConfirm({ show: false, id: null, name: '' });
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Food Log</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your daily meals</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Food
        </button>
      </div>

      {/* Date Navigator */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => handleDateChange(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(selectedDate)}</p>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="text-sm text-emerald-600 hover:underline"
              >
                Go to today
              </button>
            )}
          </div>
          <button
            onClick={() => handleDateChange(1)}
            disabled={isToday}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-lg font-bold text-gray-900 dark:text-white">{foodTotals?.calories || 0}</p>
            <p className="text-xs text-gray-500">Calories</p>
            <p className="text-xs text-gray-400">/ {goals?.calorieGoal || 2000}</p>
          </div>
          <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <p className="text-lg font-bold text-emerald-600">{foodTotals?.protein || 0}g</p>
            <p className="text-xs text-gray-500">Protein</p>
            <p className="text-xs text-gray-400">/ {goals?.proteinGoal || 150}g</p>
          </div>
          <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-lg font-bold text-amber-600">{foodTotals?.carbs || 0}g</p>
            <p className="text-xs text-gray-500">Carbs</p>
            <p className="text-xs text-gray-400">/ {goals?.carbsGoal || 250}g</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{foodTotals?.fats || 0}g</p>
            <p className="text-xs text-gray-500">Fats</p>
            <p className="text-xs text-gray-400">/ {goals?.fatsGoal || 65}g</p>
          </div>
        </div>
      </div>

      {/* Meals */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-4">
          {mealOrder.map((meal) => {
            const config = mealConfig[meal];
            const mealFoods = groupedFoods[meal] || [];
            const mealCalories = mealFoods.reduce((acc, f) => acc + f.calories, 0);

            return (
              <div key={meal} className={`card p-4 ${config.bg}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.emoji}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{config.label}</h3>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{mealCalories} kcal</span>
                </div>
                
                {mealFoods.length > 0 ? (
                  <div className="space-y-2">
                    {mealFoods.map((food) => (
                      <FoodEntryCard
                        key={food._id}
                        food={food}
                        onEdit={(f) => { setEditingFood(f); setIsModalOpen(true); }}
                        onDelete={(id) => handleDeleteFood(id, food.name)}
                      />
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-emerald-500 hover:border-emerald-300 transition-colors text-sm"
                  >
                    + Add {config.label.toLowerCase()}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingFood(null); }} title={editingFood ? 'Edit Food' : 'Add Food'}>
        <FoodForm
          food={editingFood}
          onSubmit={editingFood ? handleEditFood : handleAddFood}
          onCancel={() => { setIsModalOpen(false); setEditingFood(null); }}
          isLoading={loading}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Delete Entry"
        message={`Remove "${deleteConfirm.name}" from your food log?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default FoodLog;
