import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Switch,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  useColorScheme
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  PillsTabletIcon,
  ArrowLeft01Icon,
  Search01Icon,
  CubeIcon,
  Notification03Icon,
  RepeatIcon
} from '@hugeicons/core-free-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { medicationApi } from '../../../api/medicationApi';
import { notificationService } from '../../../services/notificationService';
import Toast from 'react-native-toast-message';
import { 
  DateWheelPickerCard, 
  TimeWheelPickerCard, 
  CircularOptionPickerCard,
  RulerPickerCard
} from '../../common/HealthPickers';

const AddMedication = ({ isVisible, onClose }) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const getNormalizedTime = (hour = 8, minute = 0) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  const formatDateString = (dateObj) => {
    const d = dateObj ? new Date(dateObj) : new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    forWhom: 'myself',
    relativeId: null,
    name: '',
    description: '',
    form: 'Tablet',
    strength: '',
    unit: 'mg',
    dosage: '1',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days default
    frequency: 'Daily',
    timesPerDay: 2,
    times: [
      { dose: '1', reception_time: getNormalizedTime(8, 0) },
      { dose: '1', reception_time: getNormalizedTime(20, 0) }
    ],
    quantityOnHand: '30',
    threshold: '5',
    remindRefill: true,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateTimesCount = (increment) => {
    let newCount = formData.timesPerDay + increment;
    if (newCount < 1) newCount = 1;
    if (newCount > 6) newCount = 6;

    const newTimes = [...formData.times];
    if (newCount > formData.timesPerDay) {
      newTimes.push({ dose: formData.dosage || '1', reception_time: getNormalizedTime(12, 0) });
    } else if (newCount < formData.timesPerDay) {
      newTimes.pop();
    }
    setFormData(prev => ({ ...prev, timesPerDay: newCount, times: newTimes }));
  };

  const handleSubmit = async () => {
    if (!formData.name?.trim() || !formData.strength?.trim() || !formData.dosage?.trim()) {
      Toast.show({ 
        type: 'info', 
        text1: 'Required Fields', 
        text2: 'Please enter medication name, strength, and dosage.' 
      });
      return;
    }

    const timesArr = formData.times.slice(0, formData.timesPerDay).map(t => ({
      dose: t.dose || '1',
      reception_time: t.reception_time
    }));

    const payload = {
      medicine_name: formData.name.trim(),
      forms: formData.form.toLowerCase(),
      strength: formData.strength,
      unit: formData.unit,
      description: formData.description,
      forWhom: formData.forWhom,
      relative_id: formData.relativeId,
      start_date: formData.startDate,
      end_date: formData.endDate,
      frequency: { type: formData.frequency },
      times: timesArr,
      stock: {
        quantity: parseInt(formData.quantityOnHand, 10) || 0,
        threshold: parseInt(formData.threshold, 10) || 0,
        remind: formData.remindRefill
      },
    };

    setIsLoading(true);
    try {
      const response = await medicationApi.addMedication(payload);
      if (response.status === 201 || response.status === 200) {
        notificationService.syncMedicationReminders([payload]);
        Toast.show({ type: 'success', text1: 'Medication Added 🎉', text2: 'Schedule updated successfully.' });
        onClose();
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to add medication' });
      }
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Error', 
        text2: error.response?.data?.message || 'Failed to add medication. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[styles.modalRoot, theme.modalRoot]} edges={['top', 'bottom']}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={isDark ? '#000000' : '#F9FAFB'} 
        />

        {/* Top Header */}
        <View style={[styles.header, theme.header]}>
          <TouchableOpacity onPress={onClose} style={[styles.backButton, theme.backButton]} activeOpacity={0.8}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={isDark ? '#FFFFFF' : '#111827'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, theme.headerTitle]}>Add Medication</Text>
          <TouchableOpacity 
            style={[styles.saveButton, theme.saveButton]} 
            onPress={handleSubmit} 
            disabled={isLoading}
            activeOpacity={0.88}
          >
            {isLoading ? (
              <ActivityIndicator color={isDark ? '#000000' : '#FFFFFF'} size="small" />
            ) : (
              <Text style={[styles.saveButtonText, theme.saveButtonText]}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Body */}
        <KeyboardAvoidingView style={styles.flexOne} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Who is this for? */}
            <Text style={[styles.sectionLabel, theme.sectionLabel]}>WHO IS THIS FOR?</Text>
            <View style={[styles.segmentContainer, theme.segmentContainer]}>
              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  formData.forWhom === 'myself' ? theme.segmentActive : theme.segmentInactive
                ]}
                onPress={() => handleInputChange('forWhom', 'myself')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText,
                  formData.forWhom === 'myself' ? theme.segmentTextActive : theme.segmentTextInactive
                ]}>
                  Myself
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentButton,
                  formData.forWhom === 'connection' ? theme.segmentActive : theme.segmentInactive
                ]}
                onPress={() => handleInputChange('forWhom', 'connection')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText,
                  formData.forWhom === 'connection' ? theme.segmentTextActive : theme.segmentTextInactive
                ]}>
                  Connection
                </Text>
              </TouchableOpacity>
            </View>

            {formData.forWhom === 'connection' && (
              <View style={styles.fieldContainer}>
                <View style={[styles.inputWrapper, theme.inputWrapper]}>
                  <HugeiconsIcon icon={Search01Icon} size={20} color={isDark ? '#A1A1AA' : '#6B7280'} style={styles.fieldIcon} />
                  <TextInput
                    style={[styles.textInput, theme.textInput]}
                    placeholder="Search connection (e.g. Sarah M.)"
                    placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
                  />
                </View>
              </View>
            )}

            {/* Medication Name */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.sectionLabel, theme.sectionLabel]}>MEDICATION NAME</Text>
              <View style={[styles.inputWrapper, theme.inputWrapper]}>
                <TextInput
                  style={[styles.textInput, theme.textInput]}
                  placeholder="e.g. Lisinopril"
                  value={formData.name}
                  onChangeText={v => handleInputChange('name', v)}
                  placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.sectionLabel, theme.sectionLabel]}>DESCRIPTION (OPTIONAL)</Text>
              <View style={[styles.inputWrapper, theme.inputWrapper]}>
                <TextInput
                  style={[styles.textInput, theme.textInput]}
                  placeholder="e.g. For heart health & blood pressure"
                  value={formData.description}
                  onChangeText={v => handleInputChange('description', v)}
                  placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
                />
              </View>
            </View>

            {/* Medication Form with Circular Wheel Option Picker */}
            <CircularOptionPickerCard
              title="Medication Form"
              icon={PillsTabletIcon}
              options={['Tablet', 'Capsule', 'Liquid', 'Injection', 'Inhaler', 'Topical', 'Drops', 'Syrup', 'Spray']}
              value={formData.form}
              onChange={v => handleInputChange('form', v)}
            />

            {/* Medication Strength Horizontal Ruler Scroll Picker */}
            <RulerPickerCard
              title="Medication Strength"
              icon={PillsTabletIcon}
              unit={formData.unit}
              selectedUnit={formData.unit}
              units={['mg', 'mcg', 'g', 'ml']}
              min={1}
              max={1000}
              value={parseInt(formData.strength, 10) || 10}
              onChange={(val) => handleInputChange('strength', val.toString())}
              onUnitChange={(u) => handleInputChange('unit', u)}
            />

            {/* Dosage Stepper Card */}
            <View style={[styles.twoToneCard, theme.twoToneCard]}>
              <View style={styles.stepperRow}>
                <View>
                  <Text style={[styles.stepperTitle, theme.stepperTitle]}>Dose Quantity</Text>
                  <Text style={[styles.cardSubText, theme.cardSubText]}>Taken per intake ({formData.form || 'Tablet'})</Text>
                </View>
                <View style={[styles.stepperControls, theme.stepperControls]}>
                  <TouchableOpacity 
                    style={[styles.stepBtn, theme.stepBtn]} 
                    onPress={() => {
                      const cur = parseInt(formData.dosage, 10) || 1;
                      if (cur > 1) handleInputChange('dosage', (cur - 1).toString());
                    }} 
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stepBtnTxt, theme.stepBtnTxt]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.stepCountTxt, theme.stepCountTxt]}>{formData.dosage || '1'}</Text>
                  <TouchableOpacity 
                    style={[styles.stepBtn, theme.stepBtn]} 
                    onPress={() => {
                      const cur = parseInt(formData.dosage, 10) || 1;
                      if (cur < 20) handleInputChange('dosage', (cur + 1).toString());
                    }} 
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stepBtnTxt, theme.stepBtnTxt]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Custom Interactive Date Wheel Pickers */}
            <DateWheelPickerCard
              title="Start Date"
              value={formatDateString(formData.startDate)}
              onChange={(dateStr) => handleInputChange('startDate', new Date(dateStr))}
            />

            <DateWheelPickerCard
              title="End Date"
              value={formatDateString(formData.endDate)}
              onChange={(dateStr) => handleInputChange('endDate', new Date(dateStr))}
            />

            {/* Frequency with Circular Wheel Option Picker */}
            <CircularOptionPickerCard
              title="Frequency"
              icon={RepeatIcon}
              options={['Daily', 'As Needed', 'Weekly', 'Every 2 Days', 'Twice a Day', 'Monthly']}
              value={formData.frequency}
              onChange={v => handleInputChange('frequency', v)}
            />

            {/* Schedule Section Card */}
            <View style={[styles.twoToneCard, theme.twoToneCard]}>
              {/* Times per Day Stepper */}
              <View style={styles.stepperRow}>
                <Text style={[styles.stepperTitle, theme.stepperTitle]}>Doses per Day</Text>
                <View style={[styles.stepperControls, theme.stepperControls]}>
                  <TouchableOpacity style={[styles.stepBtn, theme.stepBtn]} onPress={() => updateTimesCount(-1)} activeOpacity={0.7}>
                    <Text style={[styles.stepBtnTxt, theme.stepBtnTxt]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.stepCountTxt, theme.stepCountTxt]}>{formData.timesPerDay}</Text>
                  <TouchableOpacity style={[styles.stepBtn, theme.stepBtn]} onPress={() => updateTimesCount(1)} activeOpacity={0.7}>
                    <Text style={[styles.stepBtnTxt, theme.stepBtnTxt]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Custom Interactive Time Wheel Pickers for each Dose */}
            <Text style={[styles.sectionLabel, theme.sectionLabel]}>SCHEDULED DOSE TIMES</Text>
            {formData.times.slice(0, formData.timesPerDay).map((timeItem, index) => (
              <TimeWheelPickerCard
                key={index}
                title={`Dose ${index + 1} Time`}
                value={timeItem.reception_time}
                onChange={(normalizedIso) => {
                  const newTimes = [...formData.times];
                  newTimes[index] = { ...newTimes[index], reception_time: normalizedIso };
                  handleInputChange('times', newTimes);
                }}
              />
            ))}

            {/* Current Stock Section Card */}
            <View style={[styles.twoToneCard, theme.twoToneCard, styles.marginBottomLarge]}>
              <View style={styles.cardHeaderArea}>
                <HugeiconsIcon icon={CubeIcon} size={18} color={isDark ? '#93C5FD' : '#2563EB'} />
                <Text style={[styles.cardHeaderTitle, theme.cardHeaderTitle]}>Current Stock & Refills</Text>
              </View>

              <View style={styles.twoColumnRow}>
                <View style={styles.flexOne}>
                  <Text style={[styles.cardInnerLabel, theme.cardInnerLabel]}>QUANTITY ON HAND</Text>
                  <View style={[styles.innerBoxRow, theme.innerBoxRow]}>
                    <TextInput
                      style={[styles.textInput, theme.textInput]}
                      value={formData.quantityOnHand}
                      onChangeText={v => handleInputChange('quantityOnHand', v)}
                      keyboardType="numeric"
                      placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
                    />
                  </View>
                </View>

                <View style={styles.flexOne}>
                  <Text style={[styles.cardInnerLabel, theme.cardInnerLabel]}>THRESHOLD</Text>
                  <View style={[styles.innerBoxRow, theme.innerBoxRow]}>
                    <Text style={[styles.thresholdPrefix, theme.thresholdPrefix]}>Low at: </Text>
                    <TextInput
                      style={[styles.textInput, theme.textInput, styles.flexOne]}
                      value={formData.threshold}
                      onChangeText={v => handleInputChange('threshold', v)}
                      keyboardType="numeric"
                      placeholderTextColor={isDark ? '#71717A' : '#9CA3AF'}
                    />
                    <HugeiconsIcon icon={Notification03Icon} size={16} color={isDark ? '#A1A1AA' : '#6B7280'} />
                  </View>
                </View>
              </View>

              <View style={styles.refillOptRow}>
                <View style={styles.refillOptCol}>
                  <Text style={[styles.refillOptTitle, theme.refillOptTitle]}>Remind me to refill</Text>
                  <Text style={[styles.refillOptSub, theme.refillOptSub]}>Push notifications when stock drops below threshold</Text>
                </View>
                <Switch
                  trackColor={{ false: isDark ? '#272730' : '#E5E7EB', true: '#2563EB' }}
                  thumbColor="#FFFFFF"
                  onValueChange={v => handleInputChange('remindRefill', v)}
                  value={formData.remindRefill}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default AddMedication;

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  modalRoot: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    height: 56,
    paddingHorizontal: 16,
  },
  fieldIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    height: '100%',
    paddingLeft: 6,
  },
  shortInput: {
    flex: 0.6,
  },
  noPaddingRight: {
    paddingRight: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '31%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    gap: 6,
  },
  gridText: {
    fontSize: 13,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  unitPickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pickerSelectText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pickerSelectTextFull: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  dosageFormBadge: {
    fontSize: 13,
    fontWeight: '600',
  },
  twoToneCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeaderArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardInnerLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  innerBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  fieldMarginTop: {
    marginBottom: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnTxt: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepCountTxt: {
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '800',
  },
  thresholdPrefix: {
    fontSize: 13,
    fontWeight: '500',
  },
  refillOptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  refillOptCol: {
    flex: 1,
    marginRight: 12,
  },
  refillOptTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  refillOptSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  marginBottomLarge: {
    marginBottom: 36,
  },
});

// Dark Theme Variants
const darkTheme = StyleSheet.create({
  modalRoot: { backgroundColor: '#000000' },
  header: {
    backgroundColor: '#000000',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerTitle: { color: '#FFFFFF' },
  saveButton: { backgroundColor: '#FFFFFF' },
  saveButtonText: { color: '#000000' },
  sectionLabel: { color: '#A1A1AA' },
  segmentContainer: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  segmentActive: { backgroundColor: '#1E1E28' },
  segmentInactive: { backgroundColor: 'transparent' },
  segmentTextActive: { color: '#FFFFFF' },
  segmentTextInactive: { color: '#71717A' },
  inputWrapper: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInput: { color: '#FFFFFF' },
  gridItem: {},
  gridItemSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
  },
  gridItemUnselected: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  gridTextSelected: { color: '#93C5FD', fontWeight: '700' },
  gridTextUnselected: { color: '#A1A1AA', fontWeight: '500' },
  unitPickerWrapper: { backgroundColor: '#1A1A24' },
  pickerSelectText: { color: '#FFFFFF' },
  dosageFormBadge: { color: '#A1A1AA' },
  twoToneCard: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeaderTitle: { color: '#FFFFFF' },
  cardInnerLabel: { color: '#71717A' },
  innerBoxRow: {
    backgroundColor: '#1A1A22',
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  stepperTitle: { color: '#E4E4E7' },
  cardSubText: { color: '#71717A' },
  stepperControls: {
    backgroundColor: '#1A1A22',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  stepBtn: { backgroundColor: '#22222D' },
  stepBtnTxt: { color: '#FFFFFF' },
  stepCountTxt: { color: '#FFFFFF' },
  thresholdPrefix: { color: '#71717A' },
  refillOptTitle: { color: '#FFFFFF' },
  refillOptSub: { color: '#71717A' },
});

// Light Theme Variants
const lightTheme = StyleSheet.create({
  modalRoot: { backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: { color: '#111827' },
  saveButton: { backgroundColor: '#111827' },
  saveButtonText: { color: '#FFFFFF' },
  sectionLabel: { color: '#4B5563' },
  segmentContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  segmentActive: {
    backgroundColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  segmentInactive: { backgroundColor: 'transparent' },
  segmentTextActive: { color: '#111827' },
  segmentTextInactive: { color: '#6B7280' },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  textInput: { color: '#111827' },
  gridItem: {},
  gridItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  gridItemUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  gridTextSelected: { color: '#2563EB', fontWeight: '700' },
  gridTextUnselected: { color: '#4B5563', fontWeight: '500' },
  unitPickerWrapper: { backgroundColor: '#F3F4F6' },
  pickerSelectText: { color: '#111827' },
  dosageFormBadge: { color: '#6B7280' },
  twoToneCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderTitle: { color: '#111827' },
  cardInnerLabel: { color: '#6B7280' },
  innerBoxRow: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  stepperTitle: { color: '#111827' },
  cardSubText: { color: '#6B7280' },
  stepperControls: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  stepBtn: { backgroundColor: '#FFFFFF' },
  stepBtnTxt: { color: '#111827' },
  stepCountTxt: { color: '#111827' },
  thresholdPrefix: { color: '#6B7280' },
  refillOptTitle: { color: '#111827' },
  refillOptSub: { color: '#6B7280' },
});
