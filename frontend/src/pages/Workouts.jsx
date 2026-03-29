import { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash2, Flame } from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import ConfirmModal from '../components/common/ConfirmModal';

const workoutTypes = [
  { value: 'running', label: 'Running', icon: '🏃', color: 'bg-blue-50 dark:bg-blue-900/20', caloriesPerMin: 10 },
  { value: 'walking', label: 'Walking', icon: '🚶', color: 'bg-green-50 dark:bg-green-900/20', caloriesPerMin: 3 },
  { value: 'cycling', label: 'Cycling', icon: '🚴', color: 'bg-yellow-50 dark:bg-yellow-900/20', caloriesPerMin: 8 },
  { value: 'swimming', label: 'Swimming', icon: '🏊', color: 'bg-cyan-50 dark:bg-cyan-900/20', caloriesPerMin: 9 },
  { value: 'weight_training', label: 'Weights', icon: '🏋️', color: 'bg-red-50 dark:bg-red-900/20', caloriesPerMin: 6 },
  { value: 'yoga', label: 'Yoga', icon: '🧘', color: 'bg-purple-50 dark:bg-purple-900/20', caloriesPerMin: 3 },
  { value: 'hiit', label: 'HIIT', icon: '⚡', color: 'bg-orange-50 dark:bg-orange-900/20', caloriesPerMin: 12 },
  { value: 'other', label: 'Other', icon: '💪', color: 'bg-gray-50 dark:bg-gray-800/50', caloriesPerMin: 5 }
];

const Workouts = () => {
  const { workouts = [], loading, loadWorkouts, addWorkout, deleteWorkout } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, name: '' });
  const [formData, setFormData] = useState({
    type: 'running',
    duration: 30
  });

  useEffect(() => {
    loadWorkouts(selectedDate);
  }, [selectedDate]);

  const totalCalories = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalDuration = workouts.reduce((acc, w) => acc + w.duration, 0);

  const selectedWorkoutType = workoutTypes.find(t => t.value === formData.type);
  const estimatedCalories = formData.duration * selectedWorkoutType?.caloriesPerMin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addWorkout({
      type: formData.type,
      duration: parseInt(formData.duration),
      date: new Date(selectedDate)
    });
    setIsModalOpen(false);
    setFormData({ type: 'running', duration: 30 });
  };

  const handleDelete = (id, type) => {
    const workout = workoutTypes.find(t => t.value === type);
    setDeleteConfirm({ show: true, id, name: workout?.label || 'workout' });
  };

  const confirmDelete = async () => {
    await deleteWorkout(deleteConfirm.id);
    setDeleteConfirm({ show: false, id: null, name: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workouts</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track your exercise</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Workout
        </button>
      </div>

      {/* Date Picker */}
      <div className="card p-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="input"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center border-l-4 border-l-orange-500">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">{totalCalories}</p>
          <p className="text-xs text-gray-500">Calories Burned</p>
        </div>
        <div className="card p-4 text-center border-l-4 border-l-emerald-500">
          <Dumbbell className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <p className="text-xl font-bold text-gray-900 dark:text-white">{workouts.length}</p>
          <p className="text-xs text-gray-500">Workouts</p>
        </div>
        <div className="card p-4 text-center border-l-4 border-l-blue-500">
          <p className="text-xl font-bold text-gray-900 dark:text-white">{totalDuration}</p>
          <p className="text-xs text-gray-500">Minutes</p>
        </div>
      </div>

      {/* Workout List */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Workout History</h3>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : workouts.length > 0 ? (
          <div className="space-y-3">
            {workouts.map((workout) => {
              const workoutType = workoutTypes.find(t => t.value === workout.type);
              return (
                <div key={workout._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl group">
                  <div className={`w-12 h-12 rounded-xl ${workoutType?.color || 'bg-gray-100'} flex items-center justify-center`}>
                    <span className="text-2xl">{workoutType?.icon || '💪'}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{workoutType?.label || workout.type}</h4>
                    <p className="text-sm text-gray-500">{workout.duration} minutes</p>
                  </div>
                  <div className="text-right mr-2">
                    <p className="font-semibold text-orange-500">{workout.caloriesBurned}</p>
                    <p className="text-xs text-gray-500">kcal burned</p>
                  </div>
                  <button
                    onClick={() => handleDelete(workout._id, workout.type)}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Dumbbell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">No workouts yet</p>
            <p className="text-sm text-gray-400 mt-1">Add your first workout</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Workout">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Workout Type</label>
            <div className="grid grid-cols-4 gap-2">
              {workoutTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`p-3 rounded-xl text-center transition-all ${
                    formData.type === type.value
                      ? 'bg-emerald-500 text-white'
                      : `${type.color} hover:ring-2 hover:ring-emerald-500`
                  }`}
                >
                  <span className="text-2xl block">{type.icon}</span>
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className="input text-center text-xl"
              min="1"
            />
          </div>

          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              Estimated: <span className="font-bold">{estimatedCalories} kcal</span> burned
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Workout
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Delete Workout"
        message={`Remove ${deleteConfirm.name} from your log?`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default Workouts;
