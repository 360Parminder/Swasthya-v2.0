import apiClient from "./apiClient";

export const connectionApi = {
    find: (id) => apiClient.get(`/connection/findUser?id=${id}`),
    sendRequest: (receiverId) => apiClient.post(`/connection`, { receiverId }),
    viewAll: () => apiClient.get(`/connection`),
    viewPending: () => apiClient.get(`/connection/allRequest`),
};