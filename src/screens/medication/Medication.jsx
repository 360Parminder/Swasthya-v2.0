import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import AddMedication from '../../components/model/Medication/AddMedication';
import { useThemeColors } from '../../components/ui/colors';
import { medicationApi } from '../../api/medicationApi';
import GeneralModal from '../../components/common/GeneralModal';
import ViewMedications from '../../components/model/Medication/ViewMedications';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Toast from 'react-native-toast-message';
const Medication = () => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  const [modalType, setModalType] = useState(null);
  const [medications, setMedications] = useState([]);
  const showToast = (type, message, subMessage = '') => {
    Toast.show({
      type,
      text1: message,
      text2: subMessage,
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 10,
    });
  };

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
  }, [modalType]);

  const closeModal = () => setModalType(null);

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.card} onPress={() => setModalType('view')}>
          <View style={styles.cardIconContainer}>
            <Icon name="pills" size={24} color={COLORS.text} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardSubheading}>Manage your personal medications</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => showToast("info", "Comming soon", "Feature under progress")} >
          <View style={styles.cardIconContainer}>
            <Icon name="users" size={24} color={COLORS.text} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardSubheading}>Manage medications for your connections</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalType('add')}
      >
        <Text style={styles.addButtonText}>Add Medication</Text>
        <Icon name="plus" size={18} color={COLORS.text} />
      </TouchableOpacity>

      {/* View Medications Modal */}
      <GeneralModal
        visible={modalType === 'view'}
        onClose={closeModal}
        title="Medications"
      >
        <ViewMedications medications={medications} />
      </GeneralModal>
      <AddMedication isVisible={modalType === 'add'} onClose={closeModal} />
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  buttonRow: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    flexDirection: 'column',
    backgroundColor: COLORS.cardBackground,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.iconBackground,
    borderRadius: 100,
    marginBottom: 12,
  },
  cardTextContainer: {
    // flex: 1,
    width: '100%',
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardSubheading: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 4,
    fontWeight: '400',
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    height: '100%',
  },
});

export default Medication;
