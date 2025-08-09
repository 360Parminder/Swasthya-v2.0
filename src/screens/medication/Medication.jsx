// src/screens/connections/Connection.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
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
      <View style={styles.recordHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: record?.medicine_image || 'https://i.ibb.co/8DhKSn5F/tablet.png' }}
            style={styles.medicineImage}
            resizeMode="cover"
          />
          <View>
            <Text style={styles.medicineName}>{record.medicine_name}</Text>
            <Text style={styles.medicineDetails}>after food</Text>
          </View>
        </View>
        <View style={styles.dosageBadge}>
          <Text style={styles.dosageText}>
            {record.strength}{record.unit}
          </Text>
        </View>
      </View>
      {
        record.times.map((time, index) => (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', textAlign: 'center', backgroundColor: '#469d89',height: 70, padding: 10, }}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={{ color: COLORS.textSecondary,fontSize: 16 }}>Dose</Text>
              <Text style={{ color: COLORS.text, fontWeight: 'bold',fontSize: 14 }} > {record.strength} {record.unit}</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={{ color: COLORS.textSecondary }}>Reception time</Text>
              <Text style={{ color: COLORS.text }} > {new Date(time.reception_time).toLocaleString("en-GB", { timeZone: "UTC" })}</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={{ color: COLORS.textSecondary }}>Fills</Text>
              <Text style={{ color: COLORS.text }}>10 left</Text>
            </View>
          </View>
        ))
      }

    </View>
  );

  // Render medication card with list of records
  const renderMedication = ({ item: medication }) => (
    <View style={styles.medicationCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardPill} />
      </View>
      <FlatList
        data={medication.record}
        renderItem={renderRecord}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  );;

  return (
    <View style={styles.container}>
      {/* Add Medication Button */}

      {/* Action Buttons Row */}
      <View style={styles.buttonRow}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setModalType('add')}
        activeOpacity={0.7}
      >
        <Image
          source={require('../../../assets/images/appointment.png')}
          style={styles.cardImage}
        />
        <Text style={styles.buttonText}>Add Medication</Text>

      </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => setModalType('view')}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/appointment.png')}
            style={styles.cardImage}
          />
          <Text style={styles.buttonText}>View My Medications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            // TODO: Implement view connection medications functionality
          }}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/images/appointment.png')}
            style={styles.cardImage}
          />
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
              style={styles.medicationsList}
              contentContainerStyle={styles.listContent}
              data={medications}
              renderItem={renderMedication}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.noMedicationsText}>No medications found</Text>
              <Text style={styles.emptySubtext}>Add your first medication to get started</Text>
            </View>
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
  buttonRow: {
    width: '100%',
    marginTop: 20,
    gap: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    marginBottom: 15,
  },
    cardImage: {
    width: 64,
    height: 64,
    marginRight: 18,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },

  modalContainer: {
    height: '100%',
  },
  medicationsList: {
    width: '100%',
  },
  listContent: {
    // paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noMedicationsText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  medicationCard: {
    marginBottom: 16,
  },
  cardHeader: {
    position: 'relative',
    marginBottom: 12,
  },
  medicineImage: {
    backgroundColor: '#fff',
    // padding: 10,
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  cardPill: {
    position: 'absolute',
    left: -20,
    top: 0,
    height: '100%',
    width: 4,
    backgroundColor: '#6366F1', // Indigo color
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  recordItem: {
    marginBottom: 16,
    backgroundColor: '#248277',
    borderRadius: 12,
    overflow: 'hidden',
    // paddingBottom: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#F5F5F5',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  dosageBadge: {
    backgroundColor: '#ECFDF5', // Light green background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dosageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669', // Dark green text
  },
  medicineDetails: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Very light slate
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569', // Slate-600
  },
  doseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#94A3B8', // Slate-400
    marginHorizontal: 6,
  },
  doseText: {
    fontSize: 12,
    color: '#64748B', // Slate-500
  },
});

export default Medication;
