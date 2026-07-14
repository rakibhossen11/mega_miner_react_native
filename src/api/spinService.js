import apiClient from './apiClient';

export const spinService = {
  getSpinStatus: async () => {
    const response = await apiClient.get('/spin/status');
    return response.data;
  },
  playSpin: async () => {
    const response = await apiClient.post('/spin/play');
    return response.data;
  }
};