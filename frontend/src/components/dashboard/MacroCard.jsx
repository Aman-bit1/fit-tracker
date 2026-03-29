const MacroCard = ({ label, current, goal, color, unit = 'g' }) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="card text-center">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {current}<span className="text-sm font-normal text-gray-500">/{goal}{unit}</span>
      </p>
      <div className="progress-bar mt-3">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{Math.round(percentage)}%</p>
    </div>
  );
};

export default MacroCard;
