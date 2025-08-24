// src/components/medication/AddMedication.js

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

import { COLORS } from '../../ui/colors';
import { useConnection } from '../../../context/ConnectionContext';
import { medicationApi } from '../../../api/medicationApi';
import { showToast } from '../../../utils/helpers';
import GeneralModal from '../../common/GeneralModal';
import Toast from 'react-native-toast-message';

const WEEK_DAYS = [
    { label: 'Mon', value: 'Monday' },
    { label: 'Tue', value: 'Tuesday' },
    { label: 'Wed', value: 'Wednesday' },
    { label: 'Thu', value: 'Thursday' },
    { label: 'Fri', value: 'Friday' },
    { label: 'Sat', value: 'Saturday' },
    { label: 'Sun', value: 'Sunday' },
];

const medicationForms = [
    'Tablet', 'Capsule', 'Liquid', 'Injection', 'Inhaler',
    'Topical', 'Drops', 'Suppository', 'Patch'
];

const formImages = {
    tablet: require('../../../../assets/images/tablet.png'),
    capsule: require('../../../../assets/images/capsule.png'),
    liquid: require('../../../../assets/images/liquid.png'),
    injection: require('../../../../assets/images/injection.png'),
    inhaler: require('../../../../assets/images/inhaler.png'),
    topical: require('../../../../assets/images/topical.png'),
    drops: require('../../../../assets/images/drops.png'),
    suppository: require('../../../../assets/images/suppository.png'),
    patch: require('../../../../assets/images/patch.png'),
};

const units = ['mg', 'mcg', 'g', 'ml', '%'];

const AddMedication = ({ isVisible, onClose }) => {
    const { connections } = useConnection();

    // Toast configuration
    const showToast = (type, title, message) => {
        Toast.show({
            type,
            text1: title,
            text2: message,
        });
    };

    // Form state
    const [currentStep, setCurrentStep] = useState(0);
    const initialFormState = {
        name: '',
        form: '',
        strength: '',
        unit: '',
        dosage: '1',
        notes: '',
        forWhom: 'myself',
        relativeId: null,
        startDate: new Date(),
        frequency: {
            type: 'As Needed',
            specificDays: [],
        },
        numTimes: 1,
        times: [new Date()],
    };
    const [formData, setFormData] = useState(initialFormState);

    // Picker states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [activeTimeIndex, setActiveTimeIndex] = useState(null);

    // Handlers
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (_, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) handleInputChange('startDate', selectedDate);
    };

    const handleShowTimePicker = (index) => {
        setActiveTimeIndex(index);
        setShowTimePicker(true);
    };

    const handleTimeChange = (_, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setFormData(prev => {
                const times = [...prev.times];
                times[activeTimeIndex] = selectedTime;
                return { ...prev, times };
            });
        }
    };

    const resetForm = () => {
        setCurrentStep(0);
        setFormData(initialFormState);
    };

    const validateSchedule = () => {
        if (formData.frequency.type === 'As Needed') {
            return !!formData.startDate;
        }
        if (formData.frequency.type === 'Daily') {
            return (
                !!formData.startDate &&
                formData.numTimes > 0 &&
                formData.times.length >= formData.numTimes
            );
        }
        if (formData.frequency.type === 'On specific days') {
            return (
                !!formData.startDate &&
                formData.numTimes > 0 &&
                formData.times.length >= formData.numTimes &&
                formData.frequency.specificDays.length > 0
            );
        }
        return false;
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.form || !formData.strength || !formData.unit) {
            showToast('info', 'Please fill all required fields.');
            return;
        }
        if (!validateSchedule()) {
            showToast('info', 'Please complete the schedule section.');
            return;
        }

        const timesArr = formData.frequency.type === 'As Needed'
            ? []
            : Array.from({ length: formData.numTimes }, (_, i) => ({
                dose: formData.dosage,
                reception_time: formData.times[i]
                    ? formData.times[i].toISOString()
                    : new Date().toISOString(),
            }));

        const payload = {
            medicine_name: formData.name,
            forms: formData.form,
            strength: formData.strength,
            unit: formData.unit,
            description: formData.notes,
            forWhom: formData.forWhom,
            relative_id: formData.relativeId,
            start_date: formData.startDate,
            frequency: {
                type: formData.frequency.type,
                ...(formData.frequency.type === 'On specific days'
                    ? { specificDays: formData.frequency.specificDays }
                    : {}),
            },
            times: timesArr,
        };

        try {
            const response = await medicationApi.addMedication(payload);
            if (response.status === 201) {
                showToast('success', 'Medication added successfully');
                resetForm();
                onClose();
            } else {
                showToast('error', 'Failed to add medication');
            }
        } catch (error) {
            showToast('error', error?.response?.data?.message || 'Failed to add medication');
        }
    };

    // Steps definition
    const steps = [
        {
            title: 'Medication Details',
            content: (
                <View style={styles.stepContainer}>
                    <Text style={styles.label}>Medication Name*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Ibuprofen"
                        value={formData.name}
                        onChangeText={text => handleInputChange('name', text)}
                        placeholderTextColor={COLORS.placeholder}
                    />

                    <Text style={styles.label}>Who is this for?*</Text>
                    <View style={styles.pickerContainer}>
                        <RNPickerSelect
                            onValueChange={value => handleInputChange('forWhom', value)}
                            items={[
                                { label: 'Myself', value: 'myself' },
                                { label: 'Connection', value: 'connection' },
                            ]}
                            value={formData.forWhom}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}

                        />
                    </View>

                    {formData.forWhom === 'connection' && (
                        <>
                            <Text style={styles.label}>Select Family Member*</Text>
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    onValueChange={value => handleInputChange('relativeId', value)}
                                    items={connections.map(conn => ({
                                        label: conn.username,
                                        value: conn.userId,
                                    }))}
                                    value={formData.relativeId}
                                    placeholder={{ label: 'Select...', value: null }}
                                    style={pickerSelectStyles}
                                    useNativeAndroidPickerStyle={false}
                                />
                            </View>
                        </>
                    )}

                    <Text style={styles.label}>Notes (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.notesInput]}
                        placeholder="Any additional notes"
                        value={formData.notes}
                        onChangeText={text => handleInputChange('notes', text)}
                        multiline
                    />
                </View>
            ),
            validate: () => formData.name && (formData.forWhom === 'myself' || formData.relativeId),
        },
        {
            title: 'Medication Type',
            content: (
                <View style={styles.stepContainer}>
                    <Text style={styles.label}>Form*</Text>
                    <View style={styles.optionsGrid}>
                        {medicationForms.map(form => {
                            const formKey = form.toLowerCase();
                            const selected = formData.form === formKey;
                            return (
                                <TouchableOpacity
                                    key={form}
                                    style={[styles.optionButton, selected && styles.optionSelected]}
                                    onPress={() => handleInputChange('form', formKey)}
                                >
                                    <Image source={formImages[formKey]} style={styles.icon} />
                                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                                        {form}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <Text style={styles.label}>Strength*</Text>
                    <View style={styles.strengthContainer}>
                        <TextInput
                            style={[styles.input, { marginBottom: 0,height: 40,padding: 8 }]}
                            placeholder="e.g. 500"
                            value={formData.strength}
                            onChangeText={text => handleInputChange('strength', text)}
                            keyboardType="numeric"
                        />
                        <View style={styles.unitsContainer}>
                            {units.map(unit => {
                                const selected = formData.unit === unit;
                                return (
                                    <TouchableOpacity
                                        key={unit}
                                        style={[styles.unitButton, selected && styles.unitSelected]}
                                        onPress={() => handleInputChange('unit', unit)}
                                    >
                                        <Text style={[styles.unitText, selected && styles.unitTextSelected]}>
                                            {unit}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <Text style={styles.label}>Dosage*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 1"
                        value={formData.dosage}
                        onChangeText={text => handleInputChange('dosage', text)}
                        keyboardType="numeric"
                    />
                </View>
            ),
            validate: () =>
                formData.form &&
                formData.strength &&
                formData.unit &&
                formData.dosage,
        },
        {
            title: 'Medication Schedule',
            content: (
                <View style={styles.stepContainer}>
                    <Text style={styles.label}>Start Date*</Text>
                    <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Icon name="calendar-outline" size={20} color="#555" />
                        <Text style={styles.timeText}>
                            {formData.startDate.toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.label}>How Often?*</Text>
                    <View style={styles.pickerContainer}>
                        <RNPickerSelect
                            onValueChange={value => {
                                setFormData(prev => ({
                                    ...prev,
                                    frequency: {
                                        ...prev.frequency,
                                        type: value,
                                        specificDays: value === 'On specific days' ? prev.frequency.specificDays : [],
                                    },
                                    numTimes: 1,
                                    times: [new Date()],
                                }));
                            }}
                            items={[
                                { label: 'As Needed', value: 'As Needed' },
                                { label: 'Daily', value: 'Daily' },
                                { label: 'On specific days', value: 'On specific days' },
                            ]}
                            value={formData.frequency.type}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>

                    {formData.frequency.type === 'On specific days' && (
                        <>
                            <Text style={styles.label}>Select Days*</Text>
                            <View style={styles.daysContainer}>
                                {WEEK_DAYS.map(day => {
                                    const selected = formData.frequency.specificDays.includes(day.value);
                                    return (
                                        <TouchableOpacity
                                            key={day.value}
                                            style={[
                                                styles.dayButton,
                                                selected && styles.daySelected,
                                            ]}
                                            onPress={() => {
                                                setFormData(prev => {
                                                    const updatedDays = prev.frequency.specificDays.includes(day.value)
                                                        ? prev.frequency.specificDays.filter(d => d !== day.value)
                                                        : [...prev.frequency.specificDays, day.value];
                                                    return {
                                                        ...prev,
                                                        frequency: { ...prev.frequency, specificDays: updatedDays },
                                                    };
                                                });
                                            }}
                                        >
                                            <Text style={[styles.dayLabel, selected && styles.dayLabelSelected]}>
                                                {day.label}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </>
                    )}

                    {(formData.frequency.type === 'Daily' || formData.frequency.type === 'On specific days') && (
                        <>
                            <Text style={styles.label}>How many times per day?*</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="e.g. 2"
                                value={formData.numTimes.toString()}
                                onChangeText={val => {
                                    const n = Math.max(1, Number(val) || 1);
                                    setFormData(prev => {
                                        const timesArr = prev.times.slice(0, n);
                                        while (timesArr.length < n) timesArr.push(new Date());
                                        return { ...prev, numTimes: n, times: timesArr };
                                    });
                                }}
                            />

                            <Text style={styles.label}>Set times for each dose*</Text>
                            {formData.times.slice(0, formData.numTimes).map((time, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.timeInput}
                                    onPress={() => handleShowTimePicker(idx)}
                                >
                                    <Icon name="time-outline" size={20} color="#555" />
                                    <Text style={styles.timeText}>
                                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </>
                    )}

                    {formData.frequency.type === 'As Needed' && (
                        <Text style={styles.noteText}>
                            No schedule, take as required.
                        </Text>
                    )}

                    {showDatePicker && (
                        <DateTimePicker
                            value={formData.startDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            value={formData.times[activeTimeIndex] || new Date()}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                </View>
            ),
            validate: validateSchedule,
        },
    ];

    // Navigation
    const nextStep = () => {
        if (steps[currentStep].validate()) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please complete all required fields',
            });
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    return (
        <GeneralModal
            onClose={onClose}
            visible={isVisible}
            title={<Text style={styles.headerTitle}>{steps[currentStep].title}</Text>}
        >
            <View style={{height: '100%',paddingBottom: 28}}>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    {steps.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressDot,
                                i <= currentStep && styles.progressDotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Content */}
                <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
                    {steps[currentStep].content}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    {currentStep < steps.length - 1 ? (
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={nextStep}
                            disabled={!steps[currentStep].validate()}
                        >
                            <Text style={styles.buttonText}>Next</Text>
                            <Icon name="chevron-forward" size={20} color="white" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            disabled={!steps[currentStep].validate()}
                        >
                            <Text style={styles.buttonText}>Add Medication</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </GeneralModal>
    );
};

const styles = StyleSheet.create({
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.iconBackground,
        marginHorizontal: 4,
    },
    progressDotActive: {
        backgroundColor: COLORS.primary,
        borderRadius: 100,
    },
    contentContainer: {
        flexGrow: 1,
        padding: 16,
    },
    stepContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: COLORS.text,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        color: COLORS.text,
        backgroundColor: COLORS.inputBackground,

    },
    notesInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
        backgroundColor: COLORS.inputBackground,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    optionButton: {
        width: '48%',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
    },
    optionSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.accent,
    },
    optionText: {
        fontSize: 16,
        color: COLORS.text,
    },
    optionTextSelected: {
        color: '#fff',
    },
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    unitsContainer: {
        flexDirection: 'row',
        marginLeft: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
        // justifyContent: 'space-between',
    },
    unitButton: {
        padding: 8,
        marginLeft: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.inputBackground,
        // height: 50,
    },
    unitSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    unitText: {
        fontSize: 14,
        color: COLORS.text,
    },
    unitTextSelected: {
        color: COLORS.textx,
    },
    icon: {
        width: 30,
        height: 30,
        marginBottom: 4,
    },
    timeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    timeText: {
        fontSize: 16,
        marginLeft: 8,
        color: COLORS.text,
    },
    daysContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },
    dayButton: {
        padding: 8,
        margin: 2,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.inputBackground,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        alignSelf: 'center',
    },
    daySelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    dayLabel: {
        color: COLORS.text,
        fontSize: 14,
        textAlign: 'center',
    },
    dayLabelSelected: {
        color: '#fff',
    },
    noteText: {
        color: COLORS.text,
        fontSize: 15,
        marginBottom: 16,
        textAlign: 'center',
    },
    footer: {
        paddingBottom: 16,
        // borderTopWidth: 1,
        // borderTopColor: COLORS.border,
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#34C759',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: COLORS.text,
        paddingRight: 30,
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: COLORS.text,
        paddingRight: 30,
        backgroundColor: COLORS.inputBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
});

export default AddMedication;
