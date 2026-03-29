import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Flame, TrendingUp, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import FoodEntryCard from '../components/food/FoodEntryCard';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';
import FoodForm from '../components/food/FoodForm';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const { foods = [], foodTotals = {}, goals = {}, workouts = [], weeklyFoodStats = [], loading, addFood, deleteFood } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });

  const todayCalories = foodTotals?.calories || 0;
  const goalCalories = goals?.calorieGoal || user?.calorieGoal || 2000;
  const burnedToday = (workouts || []).reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);
  const netCalories = todayCalories - burnedToday;
  const progressPercent = Math.min(Math.round((todayCalories / goalCalories) * 100), 100);

  const recentFoods = (foods || []).slice(0, 5);

  const chartData = (weeklyFoodStats || []).map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: day.calories || 0
  }));

  const handleAddFood = async (foodData) => {
    await addFood(foodData);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's your daily overview</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Food
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-4 border-l-4 border-l-orange-500">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Calories</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayCalories}</p>
          <p className="text-xs text-gray-400">of {goalCalories} goal</p>
        </div>
        
        <div className="card p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Protein</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{foodTotals?.protein || 0}g</p>
          <p className="text-xs text-gray-400">of {goals?.proteinGoal || 150}g</p>
        </div>
        
        <div className="card p-4 border-l-4 border-l-amber-500">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Carbs</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{foodTotals?.carbs || 0}g</p>
          <p className="text-xs text-gray-400">of {goals?.carbsGoal || 250}g</p>
        </div>
        
        <div className="card p-4 border-l-4 border-l-blue-500">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fats</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{foodTotals?.fats || 0}g</p>
          <p className="text-xs text-gray-400">of {goals?.fatsGoal || 65}g</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Progress</span>
          <span className="text-sm font-semibold text-emerald-600">{progressPercent}%</span>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{todayCalories} kcal consumed</span>
          <span>{Math.max(0, goalCalories - todayCalories)} kcal remaining</span>
        </div>
      </div>

      {/* Charts and Summary */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Overview</h3>
            <Link to="/analytics" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {chartData.length > 0 && chartData.some(d => d.calories > 0) ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={24}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px] flex flex-col items-center justify-center text-gray-400">
              <TrendingUp className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">Start tracking to see trends</p>
            </div>
          )}
        </div>

        {/* Today's Summary */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Today</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Consumed</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{todayCalories} kcal</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Burned</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{burnedToday} kcal</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg">📊</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{netCalories} kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Meals */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Meals</h3>
          <Link to="/food" className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentFoods.length > 0 ? (
          <div className="space-y-3">
            {recentFoods.map((food) => (
              <FoodEntryCard
                key={food._id}
                food={food}
                onEdit={(f) => { setEditingFood(f); setIsModalOpen(true); }}
                onDelete={(id) => handleDeleteFood(id, food.name)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🍽️</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No meals logged yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first meal to get started</p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary mt-4">
              Add Food
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingFood(null); }} title={editingFood ? 'Edit Food' : 'Add Food'}>
        <FoodForm
          food={editingFood}
          onSubmit={handleAddFood}
          onCancel={() => { setIsModalOpen(false); setEditingFood(null); }}
          isLoading={loading}
          initialMealType="snack"
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

export default Dashboard;
