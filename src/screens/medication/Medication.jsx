import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import AddMedication from '../../components/model/Medication/AddMedication';
import { COLORS } from '../../components/ui/colors';
import { medicationApi } from '../../api/medicationApi';
import GeneralModal from '../../components/common/GeneralModal';
import ViewMedications from '../../components/model/Medication/ViewMedications';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Medication = () => {
  const [modalType, setModalType] = useState(null);
  const [medications, setMedications] = useState([]);

  const fetchMedications = async () => {
    try {
      const response = await medicationApi.getAllMedications();
      setMedications(response?.data?.medications ?? []);
    } catch (error) {
      console.error('Error fetching medications:', error);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const closeModal = () => setModalType(null);

  return (
    <View style={styles.container}>
      
      <View style={styles.buttonRow}>
       

        <TouchableOpacity style={styles.card} onPress={() => setModalType('view')}>
          <Image source={require('../../../assets/images/medical-report.png')} style={styles.cardImage} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardHeader}>View My Medications</Text>
            <Text style={styles.cardSubheading}>Manage your personal medications</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Image source={require('../../../assets/images/nursing-home.png')} style={styles.cardImage} />
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardHeader}>View Connection Medications</Text>
            <Text style={styles.cardSubheading}>Manage medications for your connections</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{
          backgroundColor:COLORS.primary,
          borderRadius:8,
          flexDirection:'row',
          alignItems:'center',
          padding:12,
          justifyContent:'center',
          gap:8
          }} onPress={() => setModalType('add')}>
          {/* <Image source={require('../../../assets/images/appointment.png')} style={styles.cardImage} /> */}
          {/* <View style={styles.cardTextContainer}> */}
            <Text style={{color:COLORS.text,fontSize:16,fontWeight:'600'}}>Add Medication</Text>
          <Icon name="plus" size={18} color={COLORS.text} />
            {/* <Text style={styles.cardSubheading}>Add a new medication to your list</Text> */}
          {/* </View> */}
        </TouchableOpacity>
      </View>

      {/* View Medications Modal */}
      <GeneralModal
        visible={modalType === 'view'}
        onClose={closeModal}
        title="My Medications"
      >
        <View style={styles.modalContainer}>
          <ViewMedications medications={medications} />
        </View>
      </GeneralModal>

      {/* Add Medication Modal */}
      <AddMedication isVisible={modalType === 'add'} onClose={closeModal} />
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
    shadowColor: '#000',
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
  cardTextContainer: {
    flex: 1,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardSubheading: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
  modalContainer: {
    height: '100%',
  },
});

export default Medication;
