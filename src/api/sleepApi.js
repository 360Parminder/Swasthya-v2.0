import apiClient from './apiClient';

export const sleepApi = {
  getCurrentSleep: () => apiClient.get('/sleep/current'),

  getSleepHistory: () => apiClient.get('/sleep/history'),

  getSleepSchedule: () => apiClient.get('/sleep/schedule'),

  updateSleepSchedule: (scheduleData) => apiClient.put('/sleep/schedule', scheduleData),

  logSleep: (sleepData) => apiClient.post('/sleep/log', sleepData),

  startSleep: () => apiClient.post('/sleep/sleep_duration/add'),

  endSleep: (sleep_id, sleepQuality) =>
    apiClient.post('/sleep/sleep_duration/end', { sleep_id, sleepQuality }),

  getWeeklyAvg: () => apiClient.get('/sleep/sleep/view/weekly_avg'),
};

export default sleepApi;
