import api from './api';

const goalService = {
  get: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  update: async (data) => {
    const response = await api.put('/goals', data);
    return response.data;
  }
};

export default goalService;
