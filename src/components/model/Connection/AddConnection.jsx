import React, { useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity, TextInput,
    ScrollView, ActivityIndicator, Platform, FlatList, Image
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, Search02Icon, InformationCircleIcon } from '@hugeicons/core-free-icons';
import { useThemeColors } from '../../ui/colors';
import { connectionApi } from '../../../api/connectionApi';
import Toast from 'react-native-toast-message';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

const dummyContacts = [
    { id: '1', name: 'Jane Doe', subtitle: 'jane.doe@email.com', initials: 'JD' },
    { id: '2', name: 'Michael Robinson', subtitle: '(555) 012-3456', initials: 'MR', isPhone: true },
    { id: '3', name: 'Sarah Chen', subtitle: 'schen.design@email.com', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=FBD38D&color=fff' },
    { id: '4', name: 'Alex Wright', subtitle: 'alex.w@provider.net', initials: 'AW' }
];

const AddConnection = ({ isVisible, onClose }) => {
    const COLORS = useThemeColors();
    const TEAL = COLORS.background === '#121212' ? '#4DB6AC' : '#006C64';
    const GREEN = '#059669'; // Emerald green as per the design

    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    const styles = useMemo(() => getStyles(COLORS, TEAL, GREEN), [COLORS, TEAL, GREEN]);

    const handleSearch = async (text) => {
        setQuery(text);
        if (!text.trim()) {
            setSearchResults([]);
            setErrorMsg('');
            return;
        }
        setIsLoading(true);
        setErrorMsg('');
        try {
            const response = await connectionApi.find(text.trim());
            setSearchResults(response.data.user ? [response.data.user] : []);
            if (!response.data.user) setErrorMsg('No user found.');
        } catch (error) {
            setSearchResults([]);
            setErrorMsg(error.response?.data?.message || 'No user found.');
        }
        setIsLoading(false);
    };

    const sendRequest = async (receiverId) => {
        try {
            await connectionApi.sendRequest(receiverId);
            Toast.show({
                type: 'success',
                text1: 'Invitation Sent',
                text2: 'Connection request has been delivered.'
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed',
                text2: error.response?.data?.message || 'Could not send invitation'
            });
        }
    };

    const renderResultItem = ({ item }) => {
        // If it's a real API result
        if (item.userId || item._id) {
            return (
                <View style={styles.contactCard}>
                    <Image source={{ uri: item.avatar || DEFAULT_AVATAR }} style={styles.avatarImage} />
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{item.username}</Text>
                        <Text style={styles.contactSubtitle}>{item.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.inviteButton} onPress={() => sendRequest(item.userId || item._id)}>
                        <Text style={styles.inviteButtonText}>Connect</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        // Dummy item fallback
        return (
            <View style={styles.contactCard}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
                ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: item.isPhone ? '#1D4ED8' : '#DBEAFE' }]}>
                        <Text style={[styles.avatarFallbackText, { color: item.isPhone ? '#FFFFFF' : '#1E3A8A' }]}>
                            {item.initials}
                        </Text>
                    </View>
                )}
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
                </View>
                <TouchableOpacity style={styles.inviteButton} onPress={() => Toast.show({ type: 'info', text1: 'Not Implemented', text2: 'This is a suggested contact.' })}>
                    <Text style={styles.inviteButtonText}>Invite</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={COLORS.primary} strokeWidth={2.5} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Connections</Text>
                    <View style={styles.menuPlaceholder}>
                        {/* Placeholder for symmetry if needed, or 3-dots */}
                    </View>
                </View>

                {/* Main Content */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Text style={styles.mainHeading}>
                        Grow your{"\n"}
                        <Text style={styles.mainHeadingHighlight}>Care Circle</Text>
                    </Text>

                    <Text style={styles.descriptionText}>
                        Sharing your health journey is the first step toward better wellness. Invite family or caregivers to coordinate medication and track vitals together.
                    </Text>

                    {/* Search Input */}
                    <View style={styles.searchContainer}>
                        <HugeiconsIcon icon={Search02Icon} size={20} color={COLORS.healthCardSubtext} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Find by name or email address"
                            placeholderTextColor={COLORS.healthCardSubtext}
                            value={query}
                            onChangeText={handleSearch}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Results or Suggested */}
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionTitle}>
                            {query.length > 0 ? "Search Results" : "Suggested Contacts"}
                        </Text>
                        {!query && <Text style={styles.phonebookText}>FROM PHONEBOOK</Text>}
                    </View>

                    <View style={styles.listContainer}>
                        {isLoading ? (
                            <ActivityIndicator color={GREEN} style={{ marginTop: 20 }} />
                        ) : query.length > 0 ? (
                            searchResults.length > 0 ? (
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={item => (item.userId || item._id).toString()}
                                    renderItem={renderResultItem}
                                    scrollEnabled={false}
                                />
                            ) : (
                                <Text style={styles.errorText}>{errorMsg || 'No results found.'}</Text>
                            )
                        ) : (
                            <FlatList
                                data={dummyContacts}
                                keyExtractor={item => item.id}
                                renderItem={renderResultItem}
                                scrollEnabled={false}
                            />
                        )}
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconWrapper}>
                            <HugeiconsIcon icon={InformationCircleIcon} size={20} color={GREEN} variant="solid" />
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoTitle}>Collaboration benefits</Text>
                            <Text style={styles.infoText}>
                                Members of your circle can view shared medication schedules, receive alerts for missed doses, and monitor vital trends in real-time.
                            </Text>
                        </View>
                        <View style={styles.infoLeftBorder} />
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </Modal>
    );
};

const getStyles = (COLORS, TEAL, GREEN) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 20 : 16, // pageSheet doesn't need full notch padding
        paddingBottom: 12,
        backgroundColor: COLORS.background,
    },
    backButton: {
        padding: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
    menuPlaceholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    mainHeading: {
        fontSize: 34,
        fontWeight: '800',
        color: COLORS.healthCardText,
        lineHeight: 42,
        marginBottom: 16,
    },
    mainHeadingHighlight: {
        color: COLORS.primary,
    },
    descriptionText: {
        fontSize: 15,
        color: COLORS.healthCardSubtext,
        lineHeight: 22,
        marginBottom: 28,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground || '#F3F4F6',
        borderRadius: 24,
        paddingHorizontal: 16,
        height: 52,
        marginBottom: 32,
    },
    searchInput: {
        flex: 1,
        height: 52,
        marginLeft: 10,
        fontSize: 15,
        color: COLORS.healthCardText,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.healthCardText,
    },
    phonebookText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: 0.5,
    },
    listContainer: {
        marginBottom: 32,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 1,
    },
    avatarImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.inputBackground,
    },
    avatarFallback: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarFallbackText: {
        fontSize: 16,
        fontWeight: '700',
    },
    contactInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    contactName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.healthCardText,
        marginBottom: 2,
    },
    contactSubtitle: {
        fontSize: 13,
        color: COLORS.healthCardSubtext,
    },
    inviteButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
    },
    inviteButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    errorText: {
        color: COLORS.healthCardSubtext,
        textAlign: 'center',
        marginTop: 20,
        fontSize: 15,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#F0FDF4', // Very light green background
        borderRadius: 16,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    infoLeftBorder: {
        position: 'absolute',
        left: 0,
        top: 20,
        bottom: 20,
        width: 4,
        backgroundColor: GREEN,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
    },
    infoIconWrapper: {
        marginRight: 12,
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.healthCardText,
        marginBottom: 6,
    },
    infoText: {
        fontSize: 13,
        color: COLORS.healthCardSubtext,
        lineHeight: 20,
    }
});

export default AddConnection;
