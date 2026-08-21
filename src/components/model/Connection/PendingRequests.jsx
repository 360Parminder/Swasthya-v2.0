import React, { useMemo } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity, Image,
    ScrollView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, MoreVerticalIcon, LockKeyIcon } from '@hugeicons/core-free-icons';
import { useThemeColors } from '../../ui/colors';


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
    const TEAL = COLORS.primary;
    const LIGHT_TEAL = COLORS.primarySoft;

    const styles = useMemo(() => getStyles(COLORS, TEAL, LIGHT_TEAL), [COLORS, TEAL, LIGHT_TEAL]);

    return (
        <Modal visible={isVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={COLORS.primary} strokeWidth={2.5} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Invitations & Requests</Text>
                    <View style={styles.menuPlaceholder} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Received Invitations Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Received Invitations</Text>
                            {receivedRequests.length > 0 && (
                                <View style={[styles.totalBadge, styles.newBadge]}>
                                    <Text style={[styles.totalBadgeText, styles.newBadgeText]}>{receivedRequests.length} New</Text>
                                </View>
                            )}
                        </View>

                        {receivedRequests.length > 0 ? (
                            receivedRequests.map((item, index) => {
                                const targetId = item.senderId || item.id || item._id;
                                return (
                                    <View key={targetId || `recv-${index}`} style={styles.requestCard}>
                                        <Image source={{ uri: item.avatar || DEFAULT_AVATAR }} style={styles.requestAvatar} />

                                        <View style={styles.requestInfo}>
                                            <Text style={styles.requestName} numberOfLines={1}>
                                                {item.name || item.username || 'User'}
                                            </Text>
                                            <Text style={styles.requestSubtitle} numberOfLines={1}>
                                                {item.email || `@${item.username}`}
                                            </Text>
                                            <View style={styles.statusRow}>
                                                <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
                                                <Text style={[styles.statusText, { color: TEAL }]}>NEW INVITATION</Text>
                                            </View>
                                        </View>

                                        <View style={styles.actionButtonsCol}>
                                            <TouchableOpacity
                                                style={styles.acceptBtn}
                                                onPress={() => onAccept && onAccept(targetId)}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.acceptBtnText}>Accept</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.declineBtn}
                                                onPress={() => onDecline && onDecline(targetId)}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.declineBtnText}>Decline</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyCardTitle}>No Pending Invitations</Text>
                                <Text style={styles.emptyCardSubtitle}>You have responded to all received circle invites.</Text>
                            </View>
                        )}
                    </View>

                    {/* Sent Invitations Section */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Sent Invitations</Text>
                            {sentRequests.length > 0 && (
                                <View style={styles.totalBadge}>
                                    <Text style={styles.totalBadgeText}>{sentRequests.length} Sent</Text>
                                </View>
                            )}
                        </View>

                        {sentRequests.length > 0 ? (
                            sentRequests.map((item, index) => {
                                const targetId = item.receiverId || item.id || item._id;
                                return (
                                    <View key={targetId || `sent-${index}`} style={[styles.requestCard, styles.sentRequestCard]}>
                                        <Image source={{ uri: item.avatar || DEFAULT_AVATAR }} style={styles.requestAvatar} />
                                        <View style={styles.requestInfo}>
                                            <Text style={[styles.requestName,{textTransform:"capitalize"}]} numberOfLines={1}>
                                                {item.name || item.username || 'User'}
                                            </Text>
                                            <Text style={styles.requestSubtitle} numberOfLines={1}>
                                                {item.email || `@${item.username}`}
                                            </Text>
                                            <View style={styles.statusRow}>
                                                <View style={styles.statusDot} />
                                                <Text style={styles.statusText}>AWAITING RESPONSE</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.cancelBtn}
                                            onPress={() => onCancel && onCancel(targetId)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.cancelBtnText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyCardTitle}>No Outgoing Requests</Text>
                                <Text style={styles.emptyCardSubtitle}>You don't have any sent invites pending confirmation.</Text>
                            </View>
                        )}
                    </View>

                    {/* Privacy & Security Card */}
                    <View style={styles.privacyCard}>
                        <View style={styles.privacyHeader}>
                            <View style={styles.lockIconContainer}>
                                <HugeiconsIcon icon={LockKeyIcon} size={18} color={COLORS.primaryHover} variant="solid" />
                            </View>
                            <Text style={styles.privacyTitle}>Privacy & Security</Text>
                        </View>
                        <Text style={styles.privacyDescription}>
                            Invitations allow trusted circle members to coordinate reminders and health updates. You can cancel or revoke connections at any time.
                        </Text>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};

const getStyles = (COLORS, TEAL, LIGHT_TEAL) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 20 : 16,
        paddingBottom: 16,
        backgroundColor: COLORS.background,
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
        backgroundColor: COLORS.border,
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
        backgroundColor: COLORS.success + '33', // Light green mapping closely to mock
    },
    newBadgeText: {
        color: COLORS.success, // Deeper green text
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
        marginBottom: 2,
    },
    requestSubtitle: {
        fontSize: 13,
        color: COLORS.healthCardSubtext,
        marginBottom: 4,
    },
    emptyCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    emptyCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.healthCardText,
        marginBottom: 4,
    },
    emptyCardSubtitle: {
        fontSize: 13,
        color: COLORS.healthCardSubtext,
        textAlign: 'center',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.textSecondary,
        marginRight: 6,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '700',
        color: COLORS.textSecondary,
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
        color: COLORS.buttonText,
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
        color: COLORS.danger, // Red
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
        backgroundColor: COLORS.primarySoft, // light teal/blue background for the icon
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
