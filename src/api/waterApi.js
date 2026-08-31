import apiClient from './apiClient';

export const waterApi = {
  getWater: (date) =>
    apiClient.get('/water', { params: date ? { date } : {} }),

  addWater: (waterIntake, intakeTarget = 2500) =>
    apiClient.put('/water', { waterIntake, intakeTarget }),

  deleteWaterLog: (logId, date) =>
    apiClient.delete(`/water/log/${logId}`, { params: date ? { date } : {} }),

  getWaterHistory: () =>
    apiClient.get('/water/history'),
};

export default waterApi;
