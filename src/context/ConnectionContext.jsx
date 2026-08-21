import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { connectionApi } from '../api/connectionApi';
import { showToast } from '../config/toastConfig';

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
    const [connections, setConnections] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRequests = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await connectionApi.viewPending();
            const recv = response.data.receivedRequests || response.data.requests || response.data.connections || [];
            const sent = response.data.sentRequests || [];
            setReceivedRequests(recv.filter(Boolean));
            setSentRequests(sent.filter(Boolean));
            return { received: recv, sent };
        } catch (error) {
            // Silently handle or toast on error
            return { received: [], sent: [] };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchConnections = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await connectionApi.viewAll();
            setConnections(response.data.connections || []);
            return response.data.connections || [];
        } catch (error) {
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshAll = useCallback(async () => {
        await Promise.all([fetchConnections(), fetchRequests()]);
    }, [fetchConnections, fetchRequests]);

    const sendRequest = async (receiverId) => {
        try {
            setIsLoading(true);
            const res = await connectionApi.sendRequest(receiverId);
            showToast('success', 'Invitation Sent', 'Connection request has been delivered.');
            await fetchRequests();
            return { success: true, data: res.data };
        } catch (error) {
            showToast('error', 'Failed', error.response?.data?.message || 'Could not send invitation');
            return { success: false, error: error.response?.data?.message };
        } finally {
            setIsLoading(false);
        }
    };

    const updateConnection = async (senderId, status) => {
        try {
            setIsLoading(true);
            await connectionApi.updateRequest(senderId, status);
            await refreshAll();
            showToast('success', status === 'accepted' ? 'Connection Established' : 'Request Declined');
            return { success: true };
        } catch (error) {
            showToast('error', error.response?.data?.message || 'An error occurred');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    const cancelRequest = async (receiverId) => {
        try {
            setIsLoading(true);
            await connectionApi.cancelRequest(receiverId);
            await fetchRequests();
            showToast('info', 'Request Cancelled', 'Connection invitation has been withdrawn.');
            return { success: true };
        } catch (error) {
            showToast('error', error.response?.data?.message || 'Could not cancel request');
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    return (
        <ConnectionContext.Provider
            value={{
                connections,
                requests: receivedRequests,
                receivedRequests,
                sentRequests,
                isLoading,
                fetchRequests,
                fetchConnections,
                refreshAll,
                sendRequest,
                updateConnection,
                cancelRequest,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
};

export const useConnection = () => useContext(ConnectionContext);
