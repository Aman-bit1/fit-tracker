const CalorieRing = ({ current, goal }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 100) return '#10B981';
    if (percentage >= 75) return '#F59E0B';
    return '#3B82F6';
  };

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          className="text-gray-200 dark:text-dark-border"
        />
        <circle
          cx="80"
          cy="80"
          r="45"
          stroke={getColor()}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{current}</span>
        <span className="text-sm text-gray-500">/ {goal} kcal</span>
      </div>
    </div>
  );
};

export default CalorieRing;
