import api from './api';

const searchService = {
  search: async (query) => {
    const response = await api.get('/search', { params: { query } });
    return response.data;
  }
};

export default searchService;
