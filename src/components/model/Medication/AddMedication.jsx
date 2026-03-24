import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity, TextInput,
    ScrollView, ActivityIndicator, Switch, Platform, KeyboardAvoidingView
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    PillsTabletIcon, PillIcon, MedicineBottle01Icon, VaccineIcon, SprayCanIcon, TestTube01Icon,
    ArrowLeft01Icon, Search01Icon, ArrowDown01Icon, Calendar01Icon, Clock01Icon, CubeIcon, Notification03Icon
} from '@hugeicons/core-free-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { useThemeColors } from '../../ui/colors';
import { useConnection } from '../../../context/ConnectionContext';
import { medicationApi } from '../../../api/medicationApi';
import Toast from 'react-native-toast-message';

const medicationForms = [
    { label: 'Tablet', icon: PillsTabletIcon },
    { label: 'Capsule', icon: PillIcon },
    { label: 'Liquid', icon: MedicineBottle01Icon },
    { label: 'Injection', icon: VaccineIcon },
    { label: 'Inhaler', icon: SprayCanIcon },
    { label: 'Topical', icon: TestTube01Icon }
];

const AddMedication = ({ isVisible, onClose }) => {
    const COLORS = useThemeColors();
    const TEAL = COLORS.background === '#121212' ? '#4DB6AC' : '#006C64';
    const { connections } = useConnection();

    const getNormalizedTime = (dateObj = new Date()) => {
        const d = new Date(dateObj);
        // Use a fixed date to ensure the "date" component is not functionally set
        return new Date(2000, 0, 1, d.getHours(), d.getMinutes(), 0, 0).toISOString();
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
        frequency: 'Daily',
        timesPerDay: 2,
        times: [{
            dose: '1',
            reception_time: getNormalizedTime(),
        }, {
            dose: '1',
            reception_time: getNormalizedTime(),
        }],
        quantityOnHand: '30',
        threshold: '5',
        remindRefill: true,
        stock: {
            quantity: 0,
            threshold: 0,
            remind: true
        }
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState({ show: false, index: 0 });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTimeChange = (_, selectedTime) => {
        const { index } = showTimePicker;
        setShowTimePicker({ show: false, index: 0 });
        if (selectedTime) {
            const newTimes = [...formData.times];
            newTimes[index] = { ...newTimes[index], reception_time: getNormalizedTime(selectedTime) };
            handleInputChange('times', newTimes);
        }
    };

    const updateTimesCount = (increment) => {
        let newCount = formData.timesPerDay + increment;
        if (newCount < 1) newCount = 1;
        if (newCount > 6) newCount = 6;

        const newTimes = [...formData.times];
        if (newCount > formData.timesPerDay) {
            newTimes.push({ dose: formData.dosage || '1', reception_time: getNormalizedTime() });
        } else if (newCount < formData.timesPerDay) {
            newTimes.pop();
        }
        setFormData(prev => ({ ...prev, timesPerDay: newCount, times: newTimes }));
    };

    const handleSubmit = async () => {
        console.log("running ");

        setFormData(prev => ({ ...prev, stock: { quantity: parseInt(formData.quantityOnHand) || 0, threshold: parseInt(formData.threshold) || 0, remind: formData.remindRefill } }));
        if (!formData.name || !formData.strength || !formData.dosage) {
            Toast.show({ type: 'info', text1: 'Validation', text2: 'Please fill name, strength, and dosage.' });
            return;
        }
        console.log("running 2");

        const timesArr = formData.times.slice(0, formData.timesPerDay).map(t => ({
            dose: t.dose,
            reception_time: t.reception_time
        }));
        console.log("running 3");


        const payload = {
            medicine_name: formData.name,
            forms: formData.form.toLowerCase(),
            strength: formData.strength,
            unit: formData.unit,
            description: formData.description,
            forWhom: formData.forWhom,
            relative_id: formData.relativeId,
            start_date: formData.startDate,
            frequency: { type: formData.frequency },
            times: timesArr,
            stock: {
                quantity: parseInt(formData.quantityOnHand) || 0,
                threshold: parseInt(formData.threshold) || 0,
                remind: formData.remindRefill
            },

        };
        console.log("running 4");


        setIsLoading(true);
        try {
            const response = await medicationApi.addMedication(payload);
            console.log("running 5");
            console.log(response);

            if (response.status === 201) {
                Toast.show({ type: 'success', text1: 'Success', text2: 'Medication added successfully' });
                onClose();
            } else {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to add medication' });
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to add medication' });
        } finally {
            setIsLoading(false);
        }
    };
    console.log(formData);


    const styles = useMemo(() => getStyles(COLORS, TEAL), [COLORS, TEAL]);

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={TEAL} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add Medication</Text>
                    <TouchableOpacity style={[styles.saveButton, { backgroundColor: TEAL }]} onPress={() => handleSubmit()} disabled={isLoading}>
                        {isLoading ? <ActivityIndicator color={COLORS.white} size="small" /> : <Text style={styles.saveButtonText}>Save</Text>}
                    </TouchableOpacity>
                </View>

                {/* Body Content */}
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* Who is this for? */}
                        <Text style={styles.sectionLabel}>WHO IS THIS FOR?</Text>
                        <View style={styles.segmentContainer}>
                            <TouchableOpacity
                                style={[styles.segmentButton, formData.forWhom === 'myself' && styles.segmentActive]}
                                onPress={() => handleInputChange('forWhom', 'myself')}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.segmentText, formData.forWhom === 'myself' && { color: TEAL }]}>Self</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segmentButton, formData.forWhom === 'connection' && styles.segmentActive]}
                                onPress={() => handleInputChange('forWhom', 'connection')}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.segmentText, formData.forWhom === 'connection' && { color: TEAL }]}>Connection</Text>
                            </TouchableOpacity>
                        </View>

                        {formData.forWhom === 'connection' && (
                            <View style={styles.connectionSearchContainer}>
                                <View style={styles.inputBoxBordered}>
                                    <View style={styles.inputLeftIcon}>
                                        <HugeiconsIcon icon={Search01Icon} size={20} color={COLORS.placeholder} />
                                    </View>
                                    <TextInput
                                        style={styles.textInputBase}
                                        placeholder="Search connection (e.g. Sarah M.)"
                                        placeholderTextColor={COLORS.placeholder}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Medication Info */}
                        <Text style={styles.sectionLabel}>MEDICATION NAME</Text>
                        <View style={styles.inputBoxBordered}>
                            <TextInput
                                style={styles.textInputBase}
                                placeholder="e.g. Lisinopril"
                                value={formData.name}
                                onChangeText={v => handleInputChange('name', v)}
                                placeholderTextColor={COLORS.placeholder}
                            />
                        </View>

                        <Text style={styles.sectionLabel}>DESCRIPTION (OPTIONAL)</Text>
                        <View style={styles.inputBoxBordered}>
                            <TextInput
                                style={styles.textInputBase}
                                placeholder="e.g. For heart health"
                                value={formData.description}
                                onChangeText={v => handleInputChange('description', v)}
                                placeholderTextColor={COLORS.placeholder}
                            />
                        </View>

                        {/* Medication Form */}
                        <Text style={styles.sectionLabel}>MEDICATION FORM</Text>
                        <View style={styles.gridContainer}>
                            {medicationForms.map(item => {
                                const isSelected = formData.form === item.label;
                                return (
                                    <TouchableOpacity
                                        key={item.label}
                                        style={[styles.gridItem, isSelected && { borderColor: TEAL, backgroundColor: TEAL + '20' }]}
                                        onPress={() => handleInputChange('form', item.label)}
                                    >
                                        <HugeiconsIcon icon={item.icon} size={28} color={isSelected ? TEAL : COLORS.healthCardSubtext} />
                                        <Text style={[styles.gridText, isSelected && { color: TEAL, fontWeight: '700' }]}>{item.label}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Strength & Dosage */}
                        <Text style={styles.sectionLabel}>STRENGTH</Text>
                        <View style={styles.rowInputContainer}>
                            <TextInput
                                style={[styles.textInputBase, { flex: 1, borderRightWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12 }]}
                                placeholder="10"
                                keyboardType="numeric"
                                value={formData.strength}
                                onChangeText={v => handleInputChange('strength', v)}
                                placeholderTextColor={COLORS.placeholder}
                            />
                            <View style={styles.unitPickerContainer}>
                                <RNPickerSelect
                                    onValueChange={(v) => handleInputChange('unit', v || 'mg')}
                                    items={[
                                        { label: 'mg', value: 'mg' },
                                        { label: 'mcg', value: 'mcg' },
                                        { label: 'g', value: 'g' },
                                        { label: 'ml', value: 'ml' },
                                    ]}
                                    value={formData.unit}
                                    useNativeAndroidPickerStyle={false}
                                    style={{
                                        inputAndroid: styles.pickerInputStyle,
                                        inputIOS: styles.pickerInputStyle,
                                    }}
                                />
                                <View style={styles.dropdownAbsoluteIcon}>
                                    <HugeiconsIcon icon={ArrowDown01Icon} size={16} color={COLORS.healthCardSubtext} />
                                </View>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>DOSAGE</Text>
                        <View style={styles.inputBoxBordered}>
                            <TextInput
                                style={styles.textInputBase}
                                placeholder="1"
                                keyboardType="numeric"
                                value={formData.dosage}
                                onChangeText={v => handleInputChange('dosage', v)}
                                placeholderTextColor={COLORS.placeholder}
                            />
                            <Text style={styles.dosageUnitTextRight}>{formData.form}(s)</Text>
                        </View>

                        {/* Schedule Card */}
                        <View style={styles.cardBoxOutline}>
                            <View style={styles.cardHeaderArea}>
                                <HugeiconsIcon icon={Calendar01Icon} size={20} color={TEAL} />
                                <Text style={[styles.cardTitleBold, { color: TEAL }]}>Schedule</Text>
                            </View>

                            <Text style={styles.cardLabelText}>START DATE</Text>
                            <TouchableOpacity style={styles.inputBoxBordered} onPress={() => setShowDatePicker(true)}>
                                <Text style={styles.inputTextValuePlaceholder}>{formData.startDate.toLocaleDateString()}</Text>
                                <HugeiconsIcon icon={Calendar01Icon} size={20} color={COLORS.placeholder} />
                            </TouchableOpacity>

                            <Text style={styles.cardLabelText}>FREQUENCY</Text>
                            <View style={styles.inputBoxBordered}>
                                <RNPickerSelect
                                    onValueChange={(v) => handleInputChange('frequency', v || 'Daily')}
                                    items={[
                                        { label: 'Daily', value: 'Daily' },
                                        { label: 'As Needed', value: 'As Needed' },
                                        { label: 'Weekly', value: 'Weekly' }
                                    ]}
                                    value={formData.frequency}
                                    useNativeAndroidPickerStyle={false}
                                    style={{
                                        inputAndroid: [styles.textInputBase, { width: '100%', paddingRight: 30 }],
                                        inputIOS: [styles.textInputBase, { width: '100%', paddingRight: 30 }]
                                    }}
                                />
                                <View style={{ position: 'absolute', right: 12 }}>
                                    <HugeiconsIcon icon={ArrowDown01Icon} size={20} color={COLORS.placeholder} />
                                </View>
                            </View>

                            <View style={styles.timesPerDayRowFlex}>
                                <Text style={styles.timesPerDayLabelBold}>Times per Day</Text>
                                <View style={styles.stepperContainerBg}>
                                    <TouchableOpacity style={styles.stepperItemBtn} onPress={() => updateTimesCount(-1)}>
                                        <Text style={styles.stepperItemTxt}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.stepperItemValueTxt}>{formData.timesPerDay}</Text>
                                    <TouchableOpacity style={styles.stepperItemBtn} onPress={() => updateTimesCount(1)}>
                                        <Text style={styles.stepperItemTxt}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.timesPillList}>
                                {formData.times.map((timeItem, index) => {
                                    const timeDate = timeItem.reception_time ? new Date(timeItem.reception_time) : new Date();
                                    return (
                                        <View key={index} style={styles.timePillObj}>
                                            <TouchableOpacity
                                                onPress={() => setShowTimePicker({ show: true, index })}
                                                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                                            >
                                                <HugeiconsIcon icon={Clock01Icon} size={14} color={TEAL} />
                                                <Text style={styles.timePillInnerTxt}>
                                                    {timeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </TouchableOpacity>

                                            <View style={{ width: 1, height: 14, backgroundColor: COLORS.border, marginHorizontal: 2 }} />

                                            <TextInput
                                                style={{ fontSize: 13, fontWeight: '600', color: COLORS.healthCardText, minWidth: 20, textAlign: 'center', padding: 0, margin: 0 }}
                                                value={timeItem.dose ? timeItem.dose.toString() : ''}
                                                onChangeText={(val) => {
                                                    const newTimes = [...formData.times];
                                                    newTimes[index] = { ...newTimes[index], dose: val };
                                                    handleInputChange('times', newTimes);
                                                }}
                                                keyboardType="numeric"
                                                placeholder="1"
                                                placeholderTextColor={COLORS.placeholder}
                                                selectTextOnFocus
                                            />
                                            <Text style={{ fontSize: 13, color: COLORS.healthCardSubtext, marginLeft: -2 }}>dose</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Current Stock Card */}
                        <View style={[styles.cardBoxOutline, { marginBottom: 40 }]}>
                            <View style={styles.cardHeaderArea}>
                                <HugeiconsIcon icon={CubeIcon} size={20} color={TEAL} />
                                <Text style={[styles.cardTitleBold, { color: TEAL }]}>Current Stock</Text>
                            </View>

                            <View style={styles.twoColumnGrid}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardLabelText}>QUANTITY ON HAND</Text>
                                    <View style={styles.inputBoxBordered}>
                                        <TextInput
                                            style={styles.textInputBase}
                                            value={formData.quantityOnHand}
                                            onChangeText={v => handleInputChange('quantityOnHand', v)}
                                            keyboardType="numeric"
                                            placeholderTextColor={COLORS.placeholder}
                                        />
                                    </View>
                                </View>
                                <View style={{ width: 12 }} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.cardLabelText}>THRESHOLD</Text>
                                    <View style={styles.inputBoxBordered}>
                                        <View style={styles.thresholdInnerWrap}>
                                            <Text style={styles.thresholdLowAtTxt}>Low at: </Text>
                                            <TextInput
                                                style={[styles.textInputBase, { flex: 1 }]}
                                                value={formData.threshold}
                                                onChangeText={v => handleInputChange('threshold', v)}
                                                keyboardType="numeric"
                                                placeholderTextColor={COLORS.placeholder}
                                            />
                                        </View>
                                        <HugeiconsIcon icon={Notification03Icon} size={20} color={COLORS.healthCardSubtext} />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.refillOptRow}>
                                <View style={styles.refillOptCol}>
                                    <Text style={styles.refillOptTitle}>Remind me to refill</Text>
                                    <Text style={styles.refillOptSub}>Notification will be sent when stock is low</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: COLORS.border, true: TEAL }}
                                    thumbColor={"#f4f3f4"}
                                    onValueChange={v => handleInputChange('remindRefill', v)}
                                    value={formData.remindRefill}
                                />
                            </View>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>

                {showDatePicker && (
                    <DateTimePicker
                        value={formData.startDate}
                        mode="date"
                        display="default"
                        onChange={(e, date) => {
                            setShowDatePicker(false);
                            if (date) handleInputChange('startDate', date);
                        }}
                    />
                )}
                {showTimePicker.show && (
                    <DateTimePicker
                        value={formData.times[showTimePicker.index]?.reception_time ? new Date(formData.times[showTimePicker.index].reception_time) : new Date()}
                        mode="time"
                        display="default"
                        onChange={handleTimeChange}
                    />
                )}
            </View>
        </Modal>
    );
};

const getStyles = (COLORS, TEAL) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 10,
        paddingBottom: 8,
        backgroundColor: COLORS.healthCardBackground,
        borderBottomWidth: 0.5,
        borderBottomColor: COLORS.border,
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.healthCardText },
    saveButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
    saveButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 24 },
    sectionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, letterSpacing: 0.5 },
    segmentContainer: { flexDirection: 'row', backgroundColor: COLORS.cardBackground, borderRadius: 16, padding: 5, marginBottom: 24, marginHorizontal: 2 },
    segmentButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
    segmentActive: { backgroundColor: COLORS.healthCardBackground, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
    segmentText: { fontSize: 15, fontWeight: '600', color: COLORS.healthCardSubtext },
    inputBoxBordered: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.healthCardBackground, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, marginBottom: 24, minHeight: 48, paddingHorizontal: 12 },
    inputLeftIcon: { marginRight: 8 },
    textInputBase: { flex: 1, height: 48, fontSize: 15, color: COLORS.healthCardText },
    inputTextValuePlaceholder: { flex: 1, fontSize: 15, color: COLORS.healthCardText },
    connectionSearchContainer: { marginBottom: 10 },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
    gridItem: { width: '31%', aspectRatio: 1, backgroundColor: COLORS.healthCardBackground, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    gridText: { marginTop: 8, fontSize: 12, color: COLORS.healthCardText, fontWeight: '500' },
    rowInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.healthCardBackground, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, marginBottom: 24, height: 48 },
    unitPickerContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: COLORS.cardBackground, borderTopRightRadius: 12, borderBottomRightRadius: 12, height: '100%', width: 80, justifyContent: 'center' },
    pickerInputStyle: { fontSize: 15, fontWeight: '600', color: COLORS.healthCardText, width: 50 },
    dropdownAbsoluteIcon: { position: 'absolute', right: 12 },
    dosageUnitTextRight: { fontSize: 15, color: COLORS.healthCardSubtext, paddingHorizontal: 8 },
    cardBoxOutline: { backgroundColor: COLORS.background, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
    cardHeaderArea: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    cardTitleBold: { fontSize: 16, fontWeight: '700', marginLeft: 8 },
    cardLabelText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8 },
    timesPerDayRowFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    timesPerDayLabelBold: { fontSize: 14, fontWeight: '600', color: COLORS.healthCardText },
    stepperContainerBg: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBackground, borderRadius: 12 },
    stepperItemBtn: { paddingHorizontal: 16, paddingVertical: 8 },
    stepperItemTxt: { fontSize: 16, fontWeight: '600', color: COLORS.healthCardText },
    stepperItemValueTxt: { fontSize: 15, fontWeight: '700', color: COLORS.healthCardText, minWidth: 20, textAlign: 'center' },
    timesPillList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    timePillObj: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.healthCardBackground, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, gap: 6 },
    timePillInnerTxt: { fontSize: 13, fontWeight: '600', color: COLORS.healthCardText },
    twoColumnGrid: { flexDirection: 'row', marginBottom: 16 },
    thresholdInnerWrap: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    thresholdLowAtTxt: { fontSize: 14, color: COLORS.healthCardSubtext, fontWeight: '500' },
    refillOptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    refillOptCol: { flex: 1, paddingRight: 16 },
    refillOptTitle: { fontSize: 14, fontWeight: '600', color: COLORS.healthCardText, marginBottom: 4 },
    refillOptSub: { fontSize: 12, color: COLORS.healthCardSubtext },
});

export default AddMedication;
