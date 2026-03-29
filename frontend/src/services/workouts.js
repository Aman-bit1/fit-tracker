import api from './api';

const workoutService = {
  getAll: async (params = {}) => {
    const response = await api.get('/workouts', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/workouts', data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/workouts/stats');
    return response.data;
  }
};

export default workoutService;
