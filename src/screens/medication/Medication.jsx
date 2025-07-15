// src/screens/connections/Connection.js
import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import AddMedication from '../../components/model/Medication/AddMedication'; // Import the AddMedication component

const Medication = () => {
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);

  const handleMedicationAdded = () => {
    // You can add logic here to refresh the medication list
    console.log('New medication added');
  };

  return (
    <View style={styles.container}>
      {/* Add Medication Button */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setShowAddMedicationModal(true)}
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
      <AddMedication 
        isVisible={showAddMedicationModal}
        onClose={() => setShowAddMedicationModal(false)}
        onMedicationAdded={handleMedicationAdded}
      />
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