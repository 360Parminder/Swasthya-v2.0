// src/components/common/GeneralModal.js
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../ui/colors';

const GeneralModal = ({ 
  visible, 
  onClose, 
  title, 
  children,
  closeButtonPosition = 'top-right' // can be 'top-right' or 'top-left'
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header with Close Button */}
          <View style={styles.modalHeader}>
            {closeButtonPosition === 'top-left' && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="close" color="#333" size={24} />
              </TouchableOpacity>
            )}
            
            <Text style={styles.modalTitle}>{title}</Text>
            
            {closeButtonPosition === 'top-right' && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                {/* <Icon name="close" color="#333" size={24} /> */}
                <Text style={{ fontSize: 18, color: COLORS.text }}>Close</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Modal Content - Accepts any children */}
          <View style={styles.modalContent}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '100%',
    height: '70%',
    // maxWidth: 400,
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    // backgroundColor: COLORS.buttonBackground,
   
  },
  modalContent: {
    padding: 20,
  },
});

export default GeneralModal;