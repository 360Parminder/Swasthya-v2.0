// src/screens/connections/Connection.js
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import GeneralModal from '../../components/common/GeneralModal';
import axios from 'axios';
import endpoints from '../../api/endpoints';
import Toast from 'react-native-toast-message';
import apiClient from '../../api/apiClient';
import { connectionApi } from '../../api/connectionApi';
import { useAuth } from '../../context/AuthContext';
const Connection = () => {
   const { authState, logout } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [newConnectionEmail, setNewConnectionEmail] = useState('');
  const [connection, setConnection] = useState(null);
  const [requests, setRequests] = useState([]);

  const showToast = (type, message, subMessage = '') => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 50,
    });
  };


  const fetchRequests = async () => {
    try {
      // Replace with your actual API call
      const response = await connectionApi.viewPending();
      // Filter out nulls
      setRequests((response.data.connections || []).filter(Boolean));
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to fetch requests');
    }
  };

  const findConnection = async (userId) => {
    try {
      const response = await connectionApi.find(userId);
      console.log('Connection found:', response.data);
      console.log('Connection data:', response.data.user);
      setConnection(response.data.user);
      showToast('success', 'Connection Found', response.data.user.username);
    } catch (error) {
      console.error('Error finding connection:', error);
      showToast('error', 'Connection Not Found', error.message);
    }
  };

  const sendRequest = async (receiverId) => {
    console.log('Sending connection request to:', receiverId);
    
    try {
      const response = await connectionApi.sendRequest(receiverId);
      console.log('Connection request sent:', response.data);
      showToast('success', 'Connection Request Sent');
    } catch (error) {
      console.log('Error sending connection request:', error);
      showToast('error', error.response?.data?.message || 'An error occurred');
    }
  }

  const updateConnection = async (senderId,status) => {
    try {
      const response = await connectionApi.updateRequest(senderId, status);
      console.log('Connection updated:', response.data);
      await fetchRequests(); // Refresh requests after update
      showToast('success', 'Connection Updated');
    } catch (error) {
      console.log('Error updating connection:', error);
      showToast('error', error.response?.data?.message || 'An error occurred');
    }
  };

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  // Modal content components
  const SearchModalContent = () => (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search by User ID"
        value={searchInput}
        onChangeText={setSearchInput}
        autoFocus
      />
      <TouchableOpacity
        style={styles.modalActionButton}
        onPress={() => findConnection(searchInput)}
      >
        <Text style={styles.modalActionButtonText}>Search</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20 }}>
        {connection && (
          <View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 8, marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1 , elevation: 4 }}>
            <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: connection.avatar }}
                style={{ width: 50, height: 50, borderRadius: 15 }}
              />
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{connection.username}</Text>
            </View>
            <TouchableOpacity onPress={() => sendRequest(connection.userId)} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', padding: 10, borderRadius: 8 }}>
              <Text style={{ fontSize: 16, color: '#fff' }}>Send Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

 

  // Fetch requests when modal opens
  useEffect(() => {
    if (activeModal === 'request') {
      fetchRequests();
    }
  }, [activeModal]);

  const ViewRequestModalContent = () => {

    // Filter out requests where the user id matches the logged-in user
    const filteredRequests = requests.filter(req => req._id !== authState.user.id);

    return (
      <View>
        { filteredRequests.length === 0 ? (
          <Text>No connection requests found.</Text>
        ) : (
          filteredRequests.map((req) => (
            <View
              key={req._id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                backgroundColor: '#fff',
                borderRadius: 8,
                padding: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1,
                elevation: 2,
              }}
            >
              <Image
                source={{ uri: req.avatar }}
                style={{ width: 40, height: 40, borderRadius: 12, marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{req.username}</Text>
                <Text style={{ color: '#555', fontSize: 14 }}>{req.email}</Text>
              </View>
              <View style={{ marginLeft: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#007AFF',
                    borderRadius: 6,
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    marginBottom: 4,
                  }}
                  onPress={() => {
                    updateConnection(req._id, 'accepted');
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FF3B30',
                    borderRadius: 6,
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                  }}
                  onPress={() => {
                    updateConnection(req._id, 'rejected');
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  const ViewConnectionsModalContent = () => (
    <View>
      <TouchableOpacity
        style={styles.modalActionButton}
        onPress={() => console.log('View all connections')}
      >
        <Text style={styles.modalActionButtonText}>View All Connections</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modalActionButton, { marginTop: 12 }]}
        onPress={() => console.log('View pending connections')}
      >
        <Text style={styles.modalActionButtonText}>Pending Requests</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Connections Button */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => openModal('search')}
      >
        <Text style={styles.buttonText}>Search Connections</Text>
      </TouchableOpacity>

      {/* Action Buttons Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: '#34C759' }]}
          onPress={() => openModal('request')}
        >
          <Text style={styles.buttonText}>View Connection Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: '#FF9500' }]}
          onPress={() => openModal('view')}
        >
          <Text style={styles.buttonText}>View Connections</Text>
        </TouchableOpacity>
      </View>

      {/* Search Modal */}
      <GeneralModal
        visible={activeModal === 'search'}
        onClose={closeModal}
        title="Search Connections"
      >
        <SearchModalContent />
      </GeneralModal>

      {/* Add Connection Modal */}
      <GeneralModal
        visible={activeModal === 'request'}
        onClose={closeModal}
        title="Connection Requests"
      >
        <ViewRequestModalContent />
      </GeneralModal>

      {/* View Connections Modal */}
      <GeneralModal
        visible={activeModal === 'view'}
        onClose={closeModal}
        title="Your Connections"
      >
        <ViewConnectionsModalContent />
      </GeneralModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  mainButton: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalActionButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalActionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Connection;