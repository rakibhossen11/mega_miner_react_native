import apiClient from './apiClient';

export const dailyService = {
  getCheckInStatus: async () => {
    console.log('server hit status');
    const response = await apiClient.get('/daily/status');
    console.log('server hit status',response);
    return response.data;
  },
  claimTodayReward: async () => {
    console.log('server hit claim');
    const response = await apiClient.post('/daily/claim');
    return response.data;
  }
};