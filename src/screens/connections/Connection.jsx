// src/screens/connections/Connection.js
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import GeneralModal from '../../components/common/GeneralModal';

const Connection = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [newConnectionEmail, setNewConnectionEmail] = useState('');

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  // Modal content components
  const SearchModalContent = () => (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search by name or email"
        value={searchInput}
        onChangeText={setSearchInput}
        autoFocus
      />
      <TouchableOpacity 
        style={styles.modalActionButton} 
        onPress={() => {
          console.log('Searching for:', searchInput);
          closeModal();
        }}
      >
        <Text style={styles.modalActionButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );

  const AddConnectionModalContent = () => (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        value={newConnectionEmail}
        onChangeText={setNewConnectionEmail}
        autoFocus
        keyboardType="email-address"
      />
      <TouchableOpacity 
        style={[styles.modalActionButton, { backgroundColor: '#34C759' }]} 
        onPress={() => {
          console.log('Adding connection:', newConnectionEmail);
          closeModal();
        }}
      >
        <Text style={styles.modalActionButtonText}>Send Request</Text>
      </TouchableOpacity>
    </View>
  );

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
          onPress={() => openModal('add')}
        >
          <Text style={styles.buttonText}>Add Connection</Text>
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
        visible={activeModal === 'add'}
        onClose={closeModal}
        title="Add New Connection"
      >
        <AddConnectionModalContent />
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