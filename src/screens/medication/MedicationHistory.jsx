import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { 
    ArrowLeft01Icon, Search02Icon, MoreVerticalIcon, Tick02Icon
} from '@hugeicons/core-free-icons';
import { useThemeColors } from '../../components/ui/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- Dummy Data ---
const DATES = [
    { day: 'MON', date: '16' },
    { day: 'TUE', date: '17' },
    { day: 'WED', date: '18' },
    { day: 'THU', date: '19', active: true },
    { day: 'FRI', date: '20' },
    { day: 'SAT', date: '21' },
];

const HISTORY_TIMELINE = [
    {
        group: 'TODAY, OCT 19',
        items: [
            {
                id: 1,
                name: 'Lisinopril',
                status: 'TAKEN',
                doseInfo: '10mg • Daily Dose',
                timeInfo: 'Logged at 08:05 AM',
                iconType: 'taken',
            },
            {
                id: 2,
                name: 'Vitamin D3',
                status: 'MISSED',
                doseInfo: '2000 IU • Supplement',
                timeInfo: 'Scheduled for 09:00 AM',
                iconType: 'missed',
            },
            {
                id: 3,
                name: 'Ibuprofen',
                status: 'SKIPPED',
                doseInfo: '400mg • As needed',
                timeInfo: '"Pain subsided"',
                iconType: 'skipped',
                isNote: true
            }
        ]
    },
    {
        group: 'YESTERDAY, OCT 18',
        items: [
            {
                id: 4,
                name: 'Metformin',
                status: 'TAKEN',
                doseInfo: '500mg • With dinner',
                timeInfo: 'Logged at 07:30 PM',
                iconType: 'taken',
            }
        ]
    }
];

const MedicationHistory = () => {
    const COLORS = useThemeColors();
    const navigation = useNavigation();

    // Theming values matching the image
    const TEAL = '#006A6A'; // Main Teal UI
    const DARK_TEAL = '#004D40'; // Deep Card Background
    const PAGE_BG = COLORS.background === '#121212' ? '#121212' : '#F9FAFB'; // Outer rim background
    const CARD_BG = COLORS.cardBackground;
    
    const styles = useMemo(() => getStyles(COLORS, TEAL, DARK_TEAL, PAGE_BG, CARD_BG), [COLORS, TEAL, DARK_TEAL, PAGE_BG, CARD_BG]);

    const renderTimelineIcon = (type) => {
        if (type === 'taken') {
            return (
                <View style={[styles.timelineIconWrapper, { backgroundColor: '#D1FAE5' }]}>
                    <HugeiconsIcon icon={Tick02Icon} size={14} color="#047857" variant="solid" />
                </View>
            );
        } else if (type === 'missed') {
            return (
                <View style={[styles.timelineIconWrapper, { backgroundColor: '#FEE2E2' }]}>
                    <MaterialIcon name="alert-circle" size={14} color="#DC2626" />
                </View>
            );
        } else if (type === 'skipped') {
            return (
                <View style={[styles.timelineIconWrapper, { backgroundColor: '#FEF3C7' }]}>
                    <MaterialIcon name="cancel" size={14} color="#D97706" />
                </View>
            );
        }
    };

    const getBadgeStyle = (status) => {
        switch(status) {
            case 'TAKEN': return { bg: '#D1FAE5', text: '#047857' };
            case 'MISSED': return { bg: '#FEE2E2', text: '#DC2626' };
            case 'SKIPPED': return { bg: '#FEF3C7', text: '#D97706' };
            default: return { bg: '#E5E7EB', text: '#374151' };
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* Custom Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color={TEAL} strokeWidth={2.5} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Medication History</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <HugeiconsIcon icon={Search02Icon} size={22} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <HugeiconsIcon icon={MoreVerticalIcon} size={22} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Optional divider matching the design under header */}
                <View style={styles.headerDivider} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    
                    {/* Adherence Header Section */}
                    <View style={styles.adherenceMainCard}>
                        <View style={styles.adherenceLeftCol}>
                            <Text style={styles.adherenceLabel}>Weekly Adherence</Text>
                            <Text style={styles.adherencePercent}>92%</Text>
                            <View style={styles.adherenceBadge}>
                                <Text style={styles.adherenceBadgeText}>+4% from last week</Text>
                            </View>
                        </View>
                        <View style={styles.adherenceRightCol}>
                            {/* A subtle mock bar chart rendering */}
                            <MaterialIcon name="chart-bar" size={64} color="rgba(255,255,255,0.15)" />
                        </View>
                    </View>

                    {/* Stats Split Cards */}
                    <View style={styles.statsRow}>
                        <View style={styles.statMiniCard}>
                            <View style={styles.statMiniHeader}>
                                <HugeiconsIcon icon={Tick02Icon} size={14} color="#047857" variant="solid" />
                                <Text style={styles.statMiniLabel}>TAKEN</Text>
                            </View>
                            <Text style={styles.statMiniValueBlack}>24</Text>
                        </View>
                        <View style={styles.statMiniCard}>
                            <View style={styles.statMiniHeader}>
                                <MaterialIcon name="close" size={16} color="#DC2626" />
                                <Text style={styles.statMiniLabel}>MISSED</Text>
                            </View>
                            <Text style={styles.statMiniValueRed}>2</Text>
                        </View>
                    </View>

                    {/* Date Selector Row */}
                    <View style={styles.dateSelectorHeader}>
                        <Text style={styles.currentMonthText}>October 2023</Text>
                        <View style={styles.dateArrows}>
                            <TouchableOpacity style={styles.dateArrowBtn}>
                                <MaterialIcon name="chevron-left" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                            <View style={{ width: 16 }} />
                            <TouchableOpacity style={styles.dateArrowBtn}>
                                <MaterialIcon name="chevron-right" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarScrollView}>
                        {DATES.map((item, idx) => (
                            <View key={idx} style={[styles.dateItem, item.active && styles.dateItemActive]}>
                                <Text style={[styles.dayText, item.active && styles.dayTextActive]}>{item.day}</Text>
                                <Text style={[styles.dateText, item.active && styles.dateTextActive]}>{item.date}</Text>
                                {item.active && <View style={styles.activeDot} />}
                            </View>
                        ))}
                    </ScrollView>

                    {/* Timeline List Section */}
                    <View style={styles.timelineSectionWrapper}>
                        {/* The continuous vertical line matching design */}
                        <View style={styles.timelineLine} />

                        {HISTORY_TIMELINE.map((group, gIdx) => (
                            <View key={gIdx} style={styles.timelineGroup}>
                                <Text style={styles.timelineGroupHeader}>{group.group}</Text>
                                
                                {group.items.map((entry, eIdx) => {
                                    const badgeStyles = getBadgeStyle(entry.status);
                                    return (
                                        <View key={entry.id} style={styles.timelineItemRow}>
                                            <View style={styles.timelineIconCol}>
                                                {renderTimelineIcon(entry.iconType)}
                                            </View>
                                            <View style={styles.timelineContentCard}>
                                                <View style={styles.timelineCardHeader}>
                                                    <Text style={styles.timelineCardTitle}>{entry.name}</Text>
                                                    <View style={[styles.timelineBadge, { backgroundColor: badgeStyles.bg }]}>
                                                        <Text style={[styles.timelineBadgeText, { color: badgeStyles.text }]}>{entry.status}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.timelineCardSubtitle}>{entry.doseInfo}</Text>
                                                <View style={styles.timelineCardFooter}>
                                                    <MaterialIcon 
                                                        name={entry.isNote ? "note-text-outline" : "clock-outline"} 
                                                        size={14} 
                                                        color="#9CA3AF" 
                                                    />
                                                    <Text style={styles.timelineCardFooterText}>{entry.timeInfo}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>

                    <View style={{ height: 60 }} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const getStyles = (COLORS, TEAL, DARK_TEAL, PAGE_BG, CARD_BG) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: PAGE_BG,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 10 : 16,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        padding: 6,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: TEAL,
        marginLeft: 10,
    },
    headerDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        width: '100%',
    },
    scrollContent: {
        paddingTop: 16,
        paddingHorizontal: 20,
    },
    // Main Adherence Card
    adherenceMainCard: {
        backgroundColor: TEAL,
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: TEAL,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    adherenceLeftCol: {
        flex: 1,
    },
    adherenceLabel: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    adherencePercent: {
        color: '#FFFFFF',
        fontSize: 42,
        fontWeight: '800',
        marginBottom: 8,
    },
    adherenceBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    adherenceBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    adherenceRightCol: {
        backgroundColor: 'rgba(0,0,0,0.1)', // Subtle shadow box containing the chart map
        padding: 10,
        borderRadius: 14,
    },
    // Mini Stats Row
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
    },
    statMiniCard: {
        flex: 1,
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 1,
    },
    statMiniHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statMiniLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4B5563',
        marginLeft: 6,
        letterSpacing: 1,
    },
    statMiniValueBlack: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.healthCardText,
    },
    statMiniValueRed: {
        fontSize: 24,
        fontWeight: '800',
        color: '#DC2626',
    },
    // Calendar Picker Header
    dateSelectorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    currentMonthText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.healthCardText,
    },
    dateArrows: {
        flexDirection: 'row',
    },
    dateArrowBtn: {
        padding: 4,
    },
    // Calendar Scroll
    calendarScrollView: {
        flexGrow: 0,
        marginBottom: 24,
    },
    dateItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        width: 52,
        marginRight: 10,
        borderRadius: 12,
    },
    dateItemActive: {
        backgroundColor: TEAL,
        shadowColor: TEAL,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    },
    dayText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
        marginBottom: 4,
    },
    dayTextActive: {
        color: 'rgba(255,255,255,0.85)',
    },
    dateText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4B5563',
    },
    dateTextActive: {
        color: '#FFFFFF',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        marginTop: 6,
    },
    // Timeline section
    timelineSectionWrapper: {
        position: 'relative',
        paddingLeft: 10,
    },
    timelineLine: {
        position: 'absolute',
        left: 26,
        top: 24,
        bottom: 0,
        width: 1,
        backgroundColor: '#E5E7EB', // Line color matching image grey baseline
    },
    timelineGroup: {
        marginBottom: 20,
    },
    timelineGroupHeader: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 1,
        marginBottom: 16,
        marginLeft: 42, 
    },
    timelineItemRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    timelineIconCol: {
        width: 32,
        alignItems: 'center',
        marginTop: 18,
    },
    timelineIconWrapper: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: PAGE_BG,
    },
    timelineContentCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginLeft: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    timelineCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    timelineCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.healthCardText,
    },
    timelineBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    timelineBadgeText: {
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    timelineCardSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 10,
    },
    timelineCardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timelineCardFooterText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginLeft: 6,
    }
});

export default MedicationHistory;
