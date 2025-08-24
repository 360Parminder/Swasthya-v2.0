// src/components/common/GeneralModal.js
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../ui/colors';
import { BlurView } from '@react-native-community/blur';

const GeneralModal = ({ 
  visible, 
  onClose, 
  title, 
  children,
  closeButtonPosition = 'top-left' // can be 'top-right' or 'top-left'
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView
        blurType="dark"
        blurAmount={5}
        style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header with Close Button */}
          <View style={styles.modalHeader}>
            {closeButtonPosition === 'top-left' && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="chevron-back" color={COLORS.text} size={24} />
              </TouchableOpacity>
            )}
            <Text style={styles.modalTitle}>{title}</Text>
            
            <TouchableOpacity style={styles.closeButton}>
              <Icon name="ellipsis-horizontal-circle-outline" color={COLORS.text} size={24} />
            </TouchableOpacity>
          </View>
          {/* Modal Content - Accepts any children */}
          {/* <Text style={styles.modalTitle}>
            {title}
          </Text> */}
          <View style={styles.modalContent}>
            {children}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)', // Reduced opacity for blur
    paddingHorizontal: 2,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalContainer: {
    width: '100%',
    height: '90%',
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  modalTitle: {
    // height: 10,
    fontSize: 24,
    fontWeight: '600',
    // flex: 1,
    // textAlign: 'center',
    color: COLORS.text,
    // paddingLeft: 30,
    // marginBottom: 10,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
  },
  modalContent: {
    padding: 20,
  },
});

export default GeneralModal;