// src/screens/connections/Connection.js
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AddMedication from '../../components/model/Medication/AddMedication'; // Import the AddMedication component
import { COLORS } from '../../components/ui/colors';
import { medicationApi } from '../../api/medicationApi';
import GeneralModal from '../../components/common/GeneralModal';

const Medication = () => {
  const [showModal, setModal] = useState(null);
  const [medications, setMedications] = useState([]);

  const closeModal = () => setModal(null);
  return (
    <View style={styles.container}>
      {/* Add Medication Button */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setModal('add')}
      >
        <Text style={styles.buttonText}>Add Medication</Text>
      </TouchableOpacity>

      {/* Action Buttons Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: '#34C759' }]}
          onPress={() => console.log('View My Medications pressed')}
        >
          <Text style={styles.buttonText}>View My Medications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: '#FF9500' }]}
          onPress={() => console.log('View Connection Medications pressed')}
        >
          <Text style={styles.buttonText}>View Connection Medications</Text>
        </TouchableOpacity>
      </View>

      {/* Add Medication Modal */}

      {/* <GeneralModal
        isVisible={showModal === 'view'}
        onClose={closeModal}
        title="Show My Medications"
      >
        <View style={{ padding: 20 }}>
          
        </View>
      </GeneralModal> */}

      <AddMedication
        isVisible={showModal === 'add'}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  mainButton: {
    padding: 16,
    backgroundColor: COLORS.primary,
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
    alignContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Medication;