import { createContext, useContext, useState, useCallback } from 'react';
import foodService from '../services/foods';
import goalService from '../services/goals';
import workoutService from '../services/workouts';
import searchService from '../services/search';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user, loadUser } = useAuth();
  const [foods, setFoods] = useState([]);
  const [foodTotals, setFoodTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [goals, setGoals] = useState({ calorieGoal: 2000, proteinGoal: 150, carbsGoal: 250, fatsGoal: 65 });
  const [workouts, setWorkouts] = useState([]);
  const [weeklyFoodStats, setWeeklyFoodStats] = useState([]);
  const [weeklyWorkoutStats, setWeeklyWorkoutStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFoods = useCallback(async (date) => {
    if (!user) return;
    setLoading(true);
    try {
      const params = date ? { date } : {};
      const res = await foodService.getAll(params);
      setFoods(res.data || []);
      setFoodTotals(res.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load foods');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addFood = async (foodData) => {
    setLoading(true);
    try {
      const res = await foodService.create(foodData);
      setFoods(prev => [res.data, ...(Array.isArray(prev) ? prev : [])]);
      setFoodTotals(prev => ({
        calories: (prev?.calories || 0) + (foodData.calories || 0),
        protein: (prev?.protein || 0) + (foodData.protein || 0),
        carbs: (prev?.carbs || 0) + (foodData.carbs || 0),
        fats: (prev?.fats || 0) + (foodData.fats || 0),
      }));
      return res;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add food');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFood = async (id, foodData) => {
    setLoading(true);
    try {
      const res = await foodService.update(id, foodData);
      setFoods(prev => (Array.isArray(prev) ? prev : []).map(f => f._id === id ? res.data : f));
      await loadFoods();
      return res;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update food');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFood = async (id) => {
    try {
      await foodService.delete(id);
      // Remove from local state
      setFoods(prev => {
        const arr = Array.isArray(prev) ? prev : [];
        return arr.filter(f => f._id !== id);
      });
      // Update totals by recalculating
      setFoodTotals(prev => {
        const current = foods.find(f => f._id === id);
        if (!current) return prev;
        return {
          calories: Math.max(0, (prev?.calories || 0) - (current.calories || 0)),
          protein: Math.max(0, (prev?.protein || 0) - (current.protein || 0)),
          carbs: Math.max(0, (prev?.carbs || 0) - (current.carbs || 0)),
          fats: Math.max(0, (prev?.fats || 0) - (current.fats || 0)),
        };
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete food');
      throw err;
    }
  };

  const loadGoals = useCallback(async () => {
    if (!user) return;
    try {
      const res = await goalService.get();
      setGoals(res.data || { calorieGoal: 2000, proteinGoal: 150, carbsGoal: 250, fatsGoal: 65 });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load goals');
    }
  }, [user]);

  const updateGoals = async (goalData) => {
    try {
      const res = await goalService.update(goalData);
      setGoals(res.data || goalData);
      await loadUser();
      return res;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update goals');
      throw err;
    }
  };

  const loadWorkouts = useCallback(async (date) => {
    if (!user) return;
    setLoading(true);
    try {
      const params = date ? { date } : {};
      const res = await workoutService.getAll(params);
      setWorkouts(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addWorkout = async (workoutData) => {
    setLoading(true);
    try {
      const res = await workoutService.create(workoutData);
      setWorkouts(prev => [res.data, ...(Array.isArray(prev) ? prev : [])]);
      return res;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (id) => {
    setLoading(true);
    try {
      await workoutService.delete(id);
      setWorkouts(prev => (Array.isArray(prev) ? prev : []).filter(w => w._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete workout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadWeeklyStats = useCallback(async () => {
    if (!user) return;
    try {
      const [foodRes, workoutRes] = await Promise.all([
        foodService.getWeekly(),
        workoutService.getStats()
      ]);
      setWeeklyFoodStats(foodRes.data || []);
      setWeeklyWorkoutStats(workoutRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load stats');
    }
  }, [user]);

  const searchFoods = async (query) => {
    try {
      const res = await searchService.search(query);
      return res.data || [];
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
      return [];
    }
  };

  const value = {
    foods,
    foodTotals,
    goals,
    workouts,
    weeklyFoodStats,
    weeklyWorkoutStats,
    loading,
    error,
    loadFoods,
    addFood,
    updateFood,
    deleteFood,
    loadGoals,
    updateGoals,
    loadWorkouts,
    addWorkout,
    deleteWorkout,
    loadWeeklyStats,
    searchFoods,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
