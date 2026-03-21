import apiClient from "./apiClient";

export const dashboardApi = {
    getDashboardData: () => apiClient.get('/dashboard'),
    getHealthMetrics: () => apiClient.get('/health-metrics'),
    getMedications: () => apiClient.get('/medications'),
}