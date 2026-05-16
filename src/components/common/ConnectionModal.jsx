// src/components/common/ConnectionModal.js
import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput } from "react-native";
import React from "react";
import { useThemeColors } from "../ui/colors";

export const ConnectionModal = ({ 
  visible, 
  onClose, 
  title, 
  showInput = false,
  inputPlaceholder = "",
  onInputChange,
  buttons 
}) => {
  const COLORS = useThemeColors();
  const styles = React.useMemo(() => getStyles(COLORS), [COLORS]);
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          {showInput && (
            <TextInput
              style={styles.input}
              placeholder={inputPlaceholder}
              onChangeText={onInputChange}
              autoFocus={true}
            />
          )}

          <View style={styles.modalButtonsContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.modalButton, button.style]}
                onPress={button.onPress}
              >
                <Text style={styles.modalButtonText}>{button.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBackground,
    color: COLORS.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: "48%",
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.buttonText,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
  },
  closeButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});