import React, { createContext, use, useContext, useEffect, useState } from 'react';
import { connectionApi } from '../api/connectionApi';
import { showToast } from '../config/toastConfig'; // Make sure you have this utility

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
    const [connections, setConnections] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await connectionApi.viewPending();
            setRequests((response.data.connections || []).filter(Boolean));
        } catch (error) {
            showToast('error', error.response?.data?.message || 'Failed to fetch requests');
        } finally {
            setIsLoading(false);
        }
    };

    const sendRequest = async (receiverId) => {
        try {
            setIsLoading(true);
            await connectionApi.sendRequest(receiverId);
            showToast('success', 'Connection Request Sent');
        } catch (error) {
            showToast('error', error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const updateConnection = async (senderId, status) => {
        try {
            setIsLoading(true);
            await connectionApi.updateRequest(senderId, status);
            await fetchRequests();
            showToast('success', 'Connection Updated');
        } catch (error) {
            showToast('error', error.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConnections = async () => {
        try {
            setIsLoading(true);
            const response = await connectionApi.viewAll();
            setConnections(response.data.connections || []);
        } catch (error) {
            showToast('error', error.response?.data?.message || 'Failed to fetch connections');
        } finally {
            setIsLoading(false);
        }
    };
    console.log('ConnectionContext initialized with connections:', connections);
    useEffect(() => {
        fetchConnections();
    }, []);

    return (
        <ConnectionContext.Provider
            value={{
                connections,
                requests,
                isLoading,
                fetchRequests,
                sendRequest,
                updateConnection,
                fetchConnections,
            }}
        >
            {children}
        </ConnectionContext.Provider>
    );
};

export const useConnection = () => useContext(ConnectionContext);
