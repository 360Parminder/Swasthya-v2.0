import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { COLORS } from '../../../components/ui/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const ViewMedications = ({ medications }) => {
  const renderRecord = ({ item: record }) => (
  <View style={styles.recordContainer}>
     <View style={styles.recordLeftSection}>
    {
      record?.times.map((time, index) => (
        <View key={index} style={styles.timeContainer}>
          <Text style={styles.timeText}>{new Date(time.reception_time).toLocaleTimeString("en-GB", {
            timeZone: "UTC",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          })}</Text>
        </View>
      ))
    }
     <Image
      source={{ uri: record?.medicine_image || 'https://i.ibb.co/8DhKSn5F/tablet.png' }}
      style={styles.medicineImage}
      resizeMode="cover"
      />
    <View>
      <Text style={styles.medicineName}>{record.medicine_name}</Text>
      <View style={styles.medicineDetailsRow}>
        <Text style={styles.descriptionText}>{record.strength} {record.unit}</Text>
        <Text style={styles.descriptionText}>{record.description || 'No description'}</Text>
      </View>
    </View>
     </View>
    <View style={styles.checkIconContainer}>
      <Icon name="checkmark" size={24} color={COLORS.text} style={{ alignSelf: 'center', fontWeight: '600' }} />
    </View>
  </View>
  );

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

  if (!medications.length) {
  return (
    <View style={styles.emptyState}>
    <Text style={styles.noMedicationsText}>No medications found</Text>
    <Text style={styles.emptySubtext}>Add your first medication to get started</Text>
    </View>
  );
  }

  return (
  <FlatList
    style={styles.medicationsList}
    contentContainerStyle={styles.listContent}
    data={medications}
    renderItem={renderMedication}
    keyExtractor={item => item._id}
    showsVerticalScrollIndicator={false}
  />
  );
};

const styles = StyleSheet.create({
  medicationsList: {
  width: '100%',
  },
  emptyState: {
  alignItems: 'center',
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
  medicineImage: {
  width: 50,
  height: 50,
  borderRadius: 8,
  marginRight: 12,
  backgroundColor: COLORS.iconBackground
  },
  medicineName: {
  fontSize: 16,
  fontWeight: '600',
  color: COLORS.text,
  textTransform: 'capitalize',
  },
  recordContainer: {
  display: 'flex',
  marginTop: 10, 
  marginBottom: 10,
  flexDirection: 'row', 
  alignItems: 'center',
  backgroundColor: COLORS.cardBackground,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: COLORS.border,
  padding: 12,
  justifyContent: 'space-between'

  },
  recordLeftSection: {
  display: 'flex', 
  flexDirection: 'row', 
  alignItems: 'center',
  position: 'relative'
  },
  timeContainer: {
  marginRight: 12,
  position: 'absolute',
  top: -30,
  left: -10,
  zIndex: 100,
  backgroundColor: COLORS.cardBackground,
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 8
  },
  timeText: {
  color: COLORS.accent,
  textTransform: 'uppercase',
  fontWeight: '600'
  },
  medicineDetailsRow: {
  display: 'flex', 
  flexDirection: 'row', 
  gap: 8
  },
  descriptionText: {
  color: COLORS.text
  },
  checkIconContainer: {
  display: 'flex', 
  flexDirection: 'row', 
  gap: 8,
  backgroundColor: COLORS.iconBackground,
  padding: 4,
  borderRadius: 100
  },
  medicationCard: {
  // Added from existing styles
  },
});

export default ViewMedications;
