import { useEffect } from 'react';
import { BarChart3, TrendingUp, Flame, Target } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { user } = useAuth();
  const { weeklyFoodStats = [], weeklyWorkoutStats = [], goals = {}, loadWeeklyStats } = useData();

  useEffect(() => {
    loadWeeklyStats();
  }, []);

  const chartData = weeklyFoodStats.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: day.calories || 0,
    protein: day.protein || 0,
    carbs: day.carbs || 0,
    fats: day.fats || 0
  }));

  const workoutChartData = weeklyWorkoutStats.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    burned: day.calories || 0
  }));

  const avgCalories = weeklyFoodStats.length > 0
    ? Math.round(weeklyFoodStats.reduce((acc, d) => acc + (d.calories || 0), 0) / weeklyFoodStats.length)
    : 0;

  const avgWorkout = weeklyWorkoutStats.length > 0
    ? Math.round(weeklyWorkoutStats.reduce((acc, d) => acc + (d.calories || 0), 0) / 7)
    : 0;

  const goalCalories = goals.calorieGoal || user?.calorieGoal || 2000;
  const daysOnTrack = weeklyFoodStats.filter(d => {
    const cal = d.calories || 0;
    return cal >= goalCalories * 0.9 && cal <= goalCalories * 1.1;
  }).length;

  const macroData = [
    { name: 'Protein', value: weeklyFoodStats.reduce((acc, d) => acc + (d.protein || 0), 0), color: '#10b981' },
    { name: 'Carbs', value: weeklyFoodStats.reduce((acc, d) => acc + (d.carbs || 0), 0), color: '#f59e0b' },
    { name: 'Fats', value: weeklyFoodStats.reduce((acc, d) => acc + (d.fats || 0), 0), color: '#3b82f6' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your weekly progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="card p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-500">Avg Calories</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgCalories}</p>
          <p className="text-xs text-gray-400">kcal/day</p>
        </div>

        <div className="card p-4 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-gray-500">Avg Burned</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgWorkout}</p>
          <p className="text-xs text-gray-400">kcal/day</p>
        </div>

        <div className="card p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">Days On Track</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{daysOnTrack}/7</p>
          <p className="text-xs text-gray-400">this week</p>
        </div>

        <div className="card p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">Total Burned</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {weeklyWorkoutStats.reduce((acc, d) => acc + (d.calories || 0), 0)}
          </p>
          <p className="text-xs text-gray-400">kcal this week</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Calorie Intake</h3>
          {chartData.some(d => d.calories > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={28}>
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
                />
                <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">No data</div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Calories Burned</h3>
          {workoutChartData.some(d => d.burned > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={workoutChartData}>
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
                />
                <Line type="monotone" dataKey="burned" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">No workout data</div>
          )}
        </div>
      </div>

      {/* Macros and Daily Breakdown */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Macro Distribution</h3>
          {macroData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {macroData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-500">{item.name}</span>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">{Math.round(item.value)}g</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">No macro data</div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Daily Breakdown</h3>
          {chartData.length > 0 ? (
            <div className="space-y-3">
              {chartData.map((day, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-10">{day.date}</span>
                  <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                      style={{ width: `${Math.min((day.calories / goalCalories) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-16 text-right">{day.calories} kcal</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
