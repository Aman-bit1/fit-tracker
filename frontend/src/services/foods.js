import api from './api';

const foodService = {
  getAll: async (params = {}) => {
    const response = await api.get('/foods', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/foods', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/foods/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  },

  getWeekly: async () => {
    const response = await api.get('/foods/weekly');
    return response.data;
  }
};

export default foodService;
