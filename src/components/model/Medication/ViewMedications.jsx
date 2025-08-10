import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { COLORS } from '../../../components/ui/colors';

const ViewMedications = ({ medications }) => {
  
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
            <Text style={styles.medicineDetails}>
              {record.description || 'No description'}
            </Text>
          </View>
        </View>
        <View style={styles.dosageBadge}>
          <Text style={styles.dosageText}>{record.strength} {record.unit}</Text>
        </View>
      </View>

      {record.times.map((time, index) => (
        <View key={index} style={styles.infoRow}>
          <View style={styles.column}>
            <Text style={styles.label}>Dose</Text>
            <Text style={styles.value}>{record.strength} {record.unit}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Reception time</Text>
            <Text style={styles.value}>
              {new Date(time.reception_time).toLocaleTimeString("en-GB", {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              })}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Fills</Text>
            <Text style={styles.value}>{record.fills}</Text>
          </View>
        </View>
      ))}
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
    backgroundColor: '#fff'
  },
  recordItem: {
    marginBottom: 16,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  dosageBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dosageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  medicineDetails: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    height: 70,
    padding: 10,
  },
  column: {
    alignItems: 'center',
  },
  label: {
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  value: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ViewMedications;
