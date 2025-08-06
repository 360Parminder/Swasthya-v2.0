// src/screens/connections/Connection.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import AddMedication from '../../components/model/Medication/AddMedication';
import { COLORS } from '../../components/ui/colors';
import { medicationApi } from '../../api/medicationApi';
import GeneralModal from '../../components/common/GeneralModal';

const Medication = () => {
  const [modalType, setModalType] = useState(null); // null | 'add' | 'view'
  const [medications, setMedications] = useState([]);

  // Fetch medications from API
  const fetchMedications = async () => {
    try {
      const response = await medicationApi.getAllMedications();
      console.log('Fetched medications:', response.data);
      const meds = response?.data?.medications ?? [];
      setMedications(meds);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  // On component mount, fetch medications
  useEffect(() => {
    fetchMedications();
  }, []);

  // Close modal handler
  const closeModal = () => setModalType(null);

  // Render a single medication record
  const renderRecord = ({ item: record }) => (
    <View style={styles.recordItem}>
      <Text style={styles.medicineName}>{record.medicine_name}</Text>
      <Text style={styles.medicineDetails}>
        {record.strength} {record.unit} - {record.forms}
      </Text>
      <Text style={styles.frequency}>
        Frequency: {record.frequency.type}
        {record.frequency.interval > 1 ? ` every ${record.frequency.interval} days` : ''}
      </Text>
      <View style={styles.timesList}>
        {record.times.map((timeItem, idx) => {
          const formattedTime = new Date(timeItem.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <Text key={idx} style={styles.timeItem}>
              {formattedTime} - {timeItem.dose} dose
            </Text>
          );
        })}
      </View>
    </View>
  );

  // Render medication card with list of records
  const renderMedication = ({ item: medication }) => (
    <View style={styles.medicationCard}>
      <FlatList
        data={medication.record}
        renderItem={renderRecord}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Add Medication Button */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setModalType('add')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Add Medication</Text>
      </TouchableOpacity>

      {/* Action Buttons Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, styles.buttonGreen]}
          onPress={() => setModalType('view')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>View My Medications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, styles.buttonOrange]}
          onPress={() => {
            // TODO: Implement view connection medications functionality
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>View Connection Medications</Text>
        </TouchableOpacity>
      </View>

      {/* View Medications Modal */}
      <GeneralModal
        visible={modalType === 'view'}
        onClose={closeModal}
        title="My Medications"
      >
        <View style={styles.modalContainer}>
          {medications.length > 0 ? (
            <FlatList
              style={{ width: '100%', height: '100%' }}
              contentContainerStyle={{ paddingBottom: 20 }}

              data={medications}
              renderItem={renderMedication}
              keyExtractor={item => item._id}
            />
          ) : (
            <Text style={styles.noMedicationsText}>No medications found.</Text>
          )}
        </View>
      </GeneralModal>

      {/* Add Medication Modal */}
      <AddMedication
        isVisible={modalType === 'add'}
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
  },
  buttonGreen: {
    backgroundColor: '#34C759',
  },
  buttonOrange: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  
  modalContainer: {
    maxHeight: '80%',
    paddingHorizontal: 10,
  },
  medicationCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 5,
  },
  recordItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4057',
    marginBottom: 4,
  },
  medicineDetails: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 4,
  },
  frequency: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#34495E',
    marginBottom: 6,
  },
  timesList: {
    marginTop: 6,
    paddingLeft: 12,
  },
  timeItem: {
    fontSize: 13,
    color: '#7B8D93',
    marginBottom: 2,
  },
  noMedicationsText: {
    textAlign: 'center',
    color: '#7B8D93',
    fontSize: 18,
    paddingVertical: 40,
    fontWeight: '600',
  },
});

export default Medication;
