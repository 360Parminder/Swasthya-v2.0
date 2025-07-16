import apiClient from "./apiClient";

export const connectionApi = {
    find: (userId) => apiClient.get(`/connection/${userId}`),
}