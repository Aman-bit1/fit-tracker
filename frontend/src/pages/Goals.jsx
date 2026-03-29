import { useState, useEffect } from 'react';
import { Target, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Goals = () => {
  const { goals = {}, updateGoals } = useData();
  const { loadUser } = useAuth();
  const [formData, setFormData] = useState({
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 250,
    fatsGoal: 65
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (goals) {
      setFormData({
        calorieGoal: goals.calorieGoal || 2000,
        proteinGoal: goals.proteinGoal || 150,
        carbsGoal: goals.carbsGoal || 250,
        fatsGoal: goals.fatsGoal || 65
      });
    }
  }, [goals]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateGoals(formData);
      await loadUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save goals:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const presets = [
    { label: 'Weight Loss', calories: 1500, protein: 150, carbs: 150, fats: 50 },
    { label: 'Maintenance', calories: 2000, protein: 150, carbs: 250, fats: 65 },
    { label: 'Muscle Gain', calories: 2500, protein: 200, carbs: 300, fats: 80 },
    { label: 'Athlete', calories: 3000, protein: 220, carbs: 400, fats: 90 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Set your nutrition targets</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`btn-primary ${saved ? 'bg-emerald-600' : ''}`}
        >
          {isSaving ? 'Saving...' : saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Goals'}
        </button>
      </div>

      {/* Presets */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setFormData({
                calorieGoal: preset.calories,
                proteinGoal: preset.protein,
                carbsGoal: preset.carbs,
                fatsGoal: preset.fats
              })}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                formData.calorieGoal === preset.calories
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
              }`}
            >
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{preset.label}</p>
              <p className="text-xs text-gray-500">{preset.calories} kcal</p>
            </button>
          ))}
        </div>
      </div>

      {/* Calorie Goal */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Calorie Goal</h3>
        <div className="flex items-center gap-4">
          <input
            type="range"
            name="calorieGoal"
            value={formData.calorieGoal}
            onChange={handleChange}
            min="1000"
            max="5000"
            step="50"
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="w-32">
            <input
              type="number"
              name="calorieGoal"
              value={formData.calorieGoal}
              onChange={handleChange}
              className="input text-center text-xl font-bold"
              min="1000"
              max="5000"
            />
            <p className="text-xs text-center text-gray-500 mt-1">kcal/day</p>
          </div>
        </div>
      </div>

      {/* Macro Goals */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Macro Targets</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label text-emerald-600">Protein (g)</label>
            <input
              type="number"
              name="proteinGoal"
              value={formData.proteinGoal}
              onChange={handleChange}
              className="input text-center text-lg font-semibold"
              min="0"
            />
            <p className="text-xs text-gray-400 mt-1">For muscle building</p>
          </div>
          <div>
            <label className="label text-amber-600">Carbs (g)</label>
            <input
              type="number"
              name="carbsGoal"
              value={formData.carbsGoal}
              onChange={handleChange}
              className="input text-center text-lg font-semibold"
              min="0"
            />
            <p className="text-xs text-gray-400 mt-1">For energy</p>
          </div>
          <div>
            <label className="label text-blue-600">Fats (g)</label>
            <input
              type="number"
              name="fatsGoal"
              value={formData.fatsGoal}
              onChange={handleChange}
              className="input text-center text-lg font-semibold"
              min="0"
            />
            <p className="text-xs text-gray-400 mt-1">For hormone health</p>
          </div>
        </div>
      </div>

      {/* Reference */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Calorie Reference</h3>
        <div className="space-y-2 text-sm">
          {[
            { label: 'Sedentary (desk job)', range: '1,800 - 2,000 kcal' },
            { label: 'Lightly active (1-3 days/week)', range: '2,000 - 2,400 kcal' },
            { label: 'Moderately active (3-5 days/week)', range: '2,400 - 2,800 kcal' },
            { label: 'Very active (6-7 days/week)', range: '2,800 - 3,200 kcal' }
          ].map((item) => (
            <div key={item.label} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className="font-medium text-gray-900 dark:text-white">{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Goals;
