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
    Platform,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { COLORS } from '../../ui/colors';

const AddMedication = ({ isVisible, onClose, onMedicationAdded }) => {
    // Form state
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        form: '',
        strength: '',
        unit: '',
        dosage: '1',
        time: new Date(),
        startDate: new Date(),
        notes: '',
        forWhom: 'myself',
        relativeId: null,
    });
    console.log('Form Data:', formData);
    

    // Picker states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Data options
    const relatives = [
        { label: 'Father', value: 'father' },
        { label: 'Mother', value: 'mother' },
        { label: 'Spouse', value: 'spouse' },
        { label: 'Child', value: 'child' },
    ];

    const medicationForms = [
        'Tablet', 'Capsule', 'Liquid', 'Injection', 'Inhaler',
        'Topical', 'Drops', 'Suppository', 'Patch'
    ];

    const units = ['mg', 'mcg', 'g', 'ml', '%'];

    // Handler functions
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleInputChange('startDate', selectedDate);
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            handleInputChange('time', selectedTime);
        }
    };

    const resetForm = () => {
        setCurrentStep(0);
        setFormData({
            name: '',
            form: '',
            strength: '',
            unit: '',
            dosage: '1',
            time: new Date(),
            startDate: new Date(),
            notes: '',
            forWhom: 'myself',
            relativeId: null,
        });
    };

    const handleSubmit = async () => {
        try {
            // Validate required fields
            if (!formData.name || !formData.form || !formData.strength || !formData.unit) {
                Alert.alert('Error', 'Please fill all required fields');
                return;
            }

            // Here you would typically call your API to save the medication
            console.log('Submitting medication:', formData);

            // On success:
            Alert.alert('Success', 'Medication added successfully');
            onMedicationAdded();
            resetForm();
            onClose();

        } catch (error) {
            Alert.alert('Error', 'Failed to add medication');
            console.error('Error adding medication:', error);
        }
    };

    // Form steps
    const steps = [
        // Step 1: Basic Information
        {
            title: 'Medication Details',
            content: (
                <View style={styles.stepContainer}>
                    <Text style={styles.label}>Medication Name*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Ibuprofen"
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                    />

                    <Text style={styles.label}>Who is this for?*</Text>
                    <View style={styles.pickerContainer}>
                        <RNPickerSelect
                            onValueChange={(value) => handleInputChange('forWhom', value)}
                            items={[
                                { label: 'Myself', value: 'myself' },
                                { label: 'Family Member', value: 'relative' },
                            ]}
                            value={formData.forWhom}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
                        />
                    </View>

                    {formData.forWhom === 'relative' && (
                        <>
                            <Text style={styles.label}>Select Family Member*</Text>
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    onValueChange={(value) => handleInputChange('relativeId', value)}
                                    items={relatives}
                                    value={formData.relativeId}
                                    style={pickerSelectStyles}
                                    useNativeAndroidPickerStyle={false}
                                    placeholder={{ label: 'Select...', value: null }}
                                />
                            </View>
                        </>
                    )}

                    <Text style={styles.label}>Notes (Optional)</Text>
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Any additional notes"
                        value={formData.notes}
                        onChangeText={(text) => handleInputChange('notes', text)}
                        multiline
                    />
                </View>
            ),
            validate: () => formData.name && (formData.forWhom === 'myself' || formData.relativeId)
        },

        // Step 2: Form and Strength
        {
            title: 'Medication Type',
            content: (
                <View style={styles.stepContainer}>
                    <Text style={styles.label}>Form*</Text>
                    <View style={styles.optionsGrid}>
                        {medicationForms.map((form) => (
                            <TouchableOpacity
                                key={form}
                                style={[
                                    styles.optionButton,
                                    formData.form === form.toLowerCase() && styles.optionSelected
                                ]}
                                onPress={() => handleInputChange('form', form.toLowerCase())}
                            >
                               <Image
                                   source={formData.form === form.toLowerCase() ? require('../../../../assets/images/jar.png') : require('../../../../assets/images/purple.png')}
                                   style={styles.icon}
                               />
                                {/* <Icon name={`medkit-outline`} size={24} color={formData.form === form.toLowerCase() ? 'white' : '#333'} /> */}
                                <Text style={[
                                    styles.optionText,
                                    formData.form === form.toLowerCase() && styles.optionTextSelected
                                ]}>
                                    {form}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.label}>Strength*</Text>
                    <View style={styles.strengthContainer}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="e.g. 500"
                            value={formData.strength}
                            onChangeText={(text) => handleInputChange('strength', text)}
                            keyboardType="numeric"
                        />

                        <View style={styles.unitsContainer}>
                            {units.map((unit) => (
                                <TouchableOpacity
                                    key={unit}
                                    style={[
                                        styles.unitButton,
                                        formData.unit === unit && styles.unitSelected
                                    ]}
                                    onPress={() => handleInputChange('unit', unit)}
                                >
                                    <Text style={[
                                        styles.unitText,
                                        formData.unit === unit && styles.unitTextSelected
                                    ]}>
                                        {unit}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <Text style={styles.label}>Dosage*</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. 1"
                        value={formData.dosage}
                        onChangeText={(text) => handleInputChange('dosage', text)}
                        keyboardType="numeric"
                    />
                </View>
            ),
            validate: () => formData.form && formData.strength && formData.unit && formData.dosage
        },

        // Step 3: Schedule
        {
            title: 'Medication Schedule',
            content: (
                <View style={styles.stepContainer}>
                    <Text style={styles.label}>Time to Take*</Text>
                    <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Icon name="time-outline" size={20} color="#555" />
                        <Text style={styles.timeText}>
                            {formData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>

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

                    {showTimePicker && (
                        <DateTimePicker
                            value={formData.time}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
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
                </View>
            ),
            validate: () => formData.time && formData.startDate
        }
    ];

    // Navigation functions
    const nextStep = () => {
        if (steps[currentStep].validate()) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        } else {
            Alert.alert('Error', 'Please complete all required fields');
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}

        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        {currentStep > 0 ? (
                            <TouchableOpacity onPress={prevStep} style={styles.backButton}>
                                <Icon name="chevron-back" size={24} color="#007AFF" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={onClose} style={styles.backButton}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        )}

                        <Text style={styles.headerTitle}>{steps[currentStep].title}</Text>

                        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
                    </View>

                    {/* Progress indicator */}
                    <View style={styles.progressContainer}>
                        {steps.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.progressDot,
                                    index <= currentStep && styles.progressDotActive
                                ]}
                            />
                        ))}
                    </View>

                    {/* Content */}
                    <ScrollView contentContainerStyle={styles.contentContainer}>
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
            </View>
        </Modal>
    );
};

// Styles
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalContainer: {
        width: '100%',
        height: '80%',
        // maxWidth: 400,
        backgroundColor: COLORS.cardBackground,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 8,
    },
    cancelText: {
        color: '#007AFF',
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    progressDotActive: {
        backgroundColor: '#007AFF',
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
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
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
        borderColor: '#ddd',
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    optionTextSelected: {
        color: 'white',
    },
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    unitsContainer: {
        flexDirection: 'row',
        marginLeft: 8,
    },
    unitButton: {
        padding: 8,
        marginLeft: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    unitSelected: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    unitText: {
        fontSize: 14,
        color: '#333',
    },
    unitTextSelected: {
        color: 'white',
    },
    timeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    timeText: {
        fontSize: 16,
        marginLeft: 8,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    nextButton: {
        backgroundColor: '#007AFF',
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
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    icon:{
        width:30,
        height:30,
    }
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: 'black',
        paddingRight: 30,
    },
});

export default AddMedication;