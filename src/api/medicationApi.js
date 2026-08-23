import apiClient from "./apiClient";

export const medicationApi = {
    addMedication: (data) => apiClient.post('/medication', data),
    getMedication: (id) => apiClient.get('/medication', { params: { medication_id: id } }),
    getAllMedications: () => apiClient.get('/medication/all'),
    updateMedication: (data) => apiClient.put('/medication', data),
    updateMedicationStatus: (data) => apiClient.post('/medication/status', data),
    deleteMedication: (id) => apiClient.delete('/medication', { params: { medication_id: id } }),
    getHistoryByDate: (date) => apiClient.get(`/medication/bydate`, {
        params: {
            date
        }
    }),
    getRefillAlerts: () => apiClient.get('/medication/refills'),
    refillMedication: (data) => apiClient.post('/medication/refill', data),
};