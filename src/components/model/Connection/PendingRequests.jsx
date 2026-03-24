import React, { useMemo } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity, Image,
    ScrollView, Platform
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, MoreVerticalIcon, LockKeyIcon } from '@hugeicons/core-free-icons';
import { useThemeColors } from '../../ui/colors';

const dummyReceived = [
    { id: 'r1', name: 'Dr. Michael C.', status: 'NEW CONNECTION REQUEST', avatar: 'https://ui-avatars.com/api/?name=Dr+Michael+C&background=random' }
];

const dummySent = [
    { id: 's1', name: 'Sarah K.', status: 'AWAITING RESPONSE', avatar: 'https://ui-avatars.com/api/?name=Sarah+K&background=random' },
    { id: 's2', name: 'Dr. Robert M.', status: 'AWAITING RESPONSE', avatar: 'https://ui-avatars.com/api/?name=Dr+Robert+M&background=random' },
    { id: 's3', name: 'Elena V.', status: 'AWAITING RESPONSE', avatar: 'https://ui-avatars.com/api/?name=Elena+V&background=random' }
];

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

const PendingRequests = ({
    isVisible,
    onClose,
    receivedRequests = [],
    sentRequests = [],
    onAccept,
    onDecline,
    onCancel
}) => {
    const COLORS = useThemeColors();
    const TEAL = COLORS.background === '#121212' ? '#006A6A' : '#006A6A';
    const LIGHT_TEAL = '#E0F2FE'; // For active badge/text

    const styles = useMemo(() => getStyles(COLORS, TEAL, LIGHT_TEAL), [COLORS, TEAL, LIGHT_TEAL]);

    // If arrays are empty, fall back to dummy data to mirror the design provided
    const displayReceived = receivedRequests.length > 0 ? receivedRequests : dummyReceived;
    const displaySent = sentRequests.length > 0 ? sentRequests : dummySent;

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={COLORS.primary} strokeWidth={2.5} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Connections</Text>
                    <View style={styles.menuPlaceholder}>
                        {/* Placeholder for symmetry if needed, or 3-dots */}
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Received Invitations Section */}
                    {displayReceived.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionTitle}>Received Invitations</Text>
                                <View style={[styles.totalBadge, styles.newBadge]}>
                                    <Text style={[styles.totalBadgeText, styles.newBadgeText]}>{displayReceived.length} New</Text>
                                </View>
                            </View>

                            {displayReceived.map((item, index) => (
                                <View key={item.id || item._id || `recv-${index}`} style={styles.requestCard}>
                                    <Image source={{ uri: item.avatar || DEFAULT_AVATAR }} style={styles.requestAvatar} />

                                    <View style={styles.requestInfo}>
                                        <Text style={styles.requestName}>{item.name || item.username}</Text>
                                        <View style={styles.statusRow}>
                                            <View style={[styles.statusDot, { backgroundColor: '#5EEAD4' }]} />
                                            <Text style={[styles.statusText, { color: TEAL }]}>NEW CONNECTION REQUEST</Text>
                                        </View>
                                    </View>

                                    <View style={styles.actionButtonsCol}>
                                        <TouchableOpacity
                                            style={styles.acceptBtn}
                                            onPress={() => onAccept && onAccept(item.id || item._id)}
                                        >
                                            <Text style={styles.acceptBtnText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.declineBtn}
                                            onPress={() => onDecline && onDecline(item.id || item._id)}
                                        >
                                            <Text style={styles.declineBtnText}>Decline</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Sent Invitations Section */}
                    {displaySent.length > 0 && (
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.sectionTitle}>Sent Invitations</Text>
                                <View style={styles.totalBadge}>
                                    <Text style={styles.totalBadgeText}>{displaySent.length} Sent</Text>
                                </View>
                            </View>

                            {displaySent.map((item, index) => (
                                <View key={item.id || item._id || `sent-${index}`} style={[styles.requestCard, styles.sentRequestCard]}>
                                    <Image source={{ uri: item.avatar || DEFAULT_AVATAR }} style={styles.requestAvatar} />
                                    <View style={styles.requestInfo}>
                                        <Text style={styles.requestName}>{item.name || item.username}</Text>
                                        <View style={styles.statusRow}>
                                            <View style={styles.statusDot} />
                                            <Text style={styles.statusText}>AWAITING RESPONSE</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.cancelBtn}
                                        onPress={() => onCancel && onCancel(item.id || item._id)}
                                    >
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Privacy & Security Card */}
                    <View style={styles.privacyCard}>
                        <View style={styles.privacyHeader}>
                            <View style={styles.lockIconContainer}>
                                <HugeiconsIcon icon={LockKeyIcon} size={18} color="#004D40" variant="solid" />
                            </View>
                            <Text style={styles.privacyTitle}>Privacy & Security</Text>
                        </View>
                        <Text style={styles.privacyDescription}>
                            Invitations expire automatically after 7 days if not accepted. You can manage your shared data permissions at any time from the <Text style={styles.privacyLink}>Security Settings</Text>.
                        </Text>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </Modal>
    );
};

const getStyles = (COLORS, TEAL, LIGHT_TEAL) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background || '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 20 : 16,
        paddingBottom: 16,
        backgroundColor: COLORS.background || '#F9FAFB',
    },
    iconBtn: {
        padding: 8,
    },
    menuPlaceholder: {
        width: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    // Sections
    sectionContainer: {
        marginBottom: 32,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: COLORS.healthCardText,
    },
    totalBadge: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
    },
    totalBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.healthCardSubtext,
    },
    newBadge: {
        backgroundColor: '#D1FAE5', // Light green mapping closely to mock
    },
    newBadgeText: {
        color: '#047857', // Deeper green text
    },
    // Cards
    requestCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 1,
    },
    sentRequestCard: {
        paddingVertical: 18,
    },
    requestAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    requestInfo: {
        flex: 1,
        marginLeft: 14,
        marginRight: 6,
    },
    requestName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.healthCardText,
        marginBottom: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4B5563', // gray-600
        marginRight: 6,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#4B5563',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    // Action Buttons
    actionButtonsCol: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    acceptBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        marginRight: 10,
    },
    acceptBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    declineBtn: {
        paddingHorizontal: 6,
        paddingVertical: 10,
    },
    declineBtnText: {
        color: COLORS.healthCardSubtext,
        fontSize: 13,
        fontWeight: '600',
    },
    cancelBtn: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    cancelBtnText: {
        color: '#DC2626', // Red
        fontSize: 14,
        fontWeight: '600',
    },
    // Privacy Card
    privacyCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20,
    },
    privacyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    lockIconContainer: {
        backgroundColor: '#E0F2FE', // light teal/blue background for the icon
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    privacyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.healthCardText,
    },
    privacyDescription: {
        fontSize: 13,
        color: COLORS.healthCardSubtext,
        lineHeight: 20,
    },
    privacyLink: {
        color: COLORS.primary,
        fontWeight: '600',
    }
});

export default PendingRequests;
