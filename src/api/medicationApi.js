import apiClient from "./apiClient";

export const medicationApi = {

    addMedication: (data) => apiClient.post('/medication', data),
    getMedication: (id) => apiClient.get(`/medication/${id}`),
    getAllMedications: () => apiClient.get('/medication/all'),
    updateMedication: (id, data) => apiClient.put(`/medication/${id}`, data),
    deleteMedication: (id) => apiClient.delete(`/medication/${id}`),
}