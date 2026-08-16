import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    useColorScheme,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Tick02Icon,
    AlertCircleIcon,
    Cancel01Icon,
    Time02Icon,
    PillIcon,
    Medicine01Icon,
    MedicineBottle01Icon,
    InjectionIcon,
    Calendar01Icon,
    SparklesIcon,
    RefreshIcon,
    ChartBarBigIcon,
} from '@hugeicons/core-free-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { medicationApi } from '../../api/medicationApi';
import { useThemeColors } from '../../components/ui/colors';

// Helper for medicine form icon
const getIconForForm = (form) => {
    switch (form?.toLowerCase()) {
        case 'capsule':
        case 'tablet':
            return PillIcon;
        case 'liquid':
        case 'syrup':
        case 'drops':
            return MedicineBottle01Icon;
        case 'injection':
            return InjectionIcon;
        default:
            return Medicine01Icon;
    }
};

// Dynamic Date Generator (Last 30 Days)
const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push({
            dateObj: d,
            day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
            date: d.getDate().toString(),
            fullDate: d.toISOString().split('T')[0], // YYYY-MM-DD format for API
            isToday: i === 0,
            monthYear: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        });
    }
    return dates;
};

const DYNAMIC_DATES = generateDates();

// Circular Radial Progress Chart Component
const RadialAdherence = ({ percentage = 100, isDark }) => {
    const size = 78;
    const strokeWidth = 7;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const validPct = Math.min(100, Math.max(0, isNaN(percentage) ? 100 : percentage));
    const strokeDashoffset = circumference - (circumference * validPct) / 100;

    let strokeColor = '#3B82F6';
    if (validPct === 100) strokeColor = '#10B981';
    else if (validPct < 50) strokeColor = '#EF4444';
    else if (validPct < 80) strokeColor = '#F59E0B';

    return (
        <View style={radialStyles.wrapper}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={isDark ? '#262632' : '#E2E8F0'}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                    />
                </G>
            </Svg>
            <View style={radialStyles.centerContent}>
                <Text style={[radialStyles.percentText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                    {Math.round(validPct)}%
                </Text>
            </View>
        </View>
    );
};

const radialStyles = StyleSheet.create({
    wrapper: {
        width: 78,
        height: 78,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    centerContent: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentText: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
});

const MedicationHistory = () => {
    const COLORS = useThemeColors();
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    // State logic
    const [selectedDateObj, setSelectedDateObj] = useState(DYNAMIC_DATES[DYNAMIC_DATES.length - 1]);
    const [historyData, setHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // ScrollView reference for the horizontal date selector
    const dateScrollRef = useRef(null);

    const theme = isDark ? darkStyles : lightStyles;

    const formatTime = (timeInput) => {
        if (!timeInput) return '08:00 AM';
        try {
            const d = new Date(timeInput);
            if (isNaN(d.getTime())) return String(timeInput);
            return d.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        } catch (e) {
            return '08:00 AM';
        }
    };

    const transformHistoryData = useCallback((medicationsList, selectedDate) => {
        if (!medicationsList || !Array.isArray(medicationsList) || medicationsList.length === 0) return [];

        const items = [];
        const isToday = selectedDate.isToday;
        const now = new Date();

        medicationsList.forEach((med, mIdx) => {
            const formStr = med.forms ? (med.forms.charAt(0).toUpperCase() + med.forms.slice(1)) : 'Tablet';
            const scheduledTimes = (Array.isArray(med.times) && med.times.length > 0)
                ? med.times
                : [{ reception_time: med.start_date || new Date().toISOString(), dose: '1' }];

            scheduledTimes.forEach((timeItem, tIdx) => {
                const doseId = timeItem._id ? timeItem._id.toString() : `${med._id || mIdx}-time-${tIdx}`;
                const scheduledTimeStr = formatTime(timeItem.reception_time);

                // Find matching log for this specific dose or date
                const matchingLog = (med.logs || []).find((log) => {
                    if (log.dose_id) {
                        return log.dose_id.toString() === doseId;
                    }
                    if (scheduledTimes.length === 1) {
                        return true;
                    }
                    return false;
                });

                let status = 'SCHEDULED';
                let iconType = 'scheduled';
                let timeInfo = `Scheduled for ${scheduledTimeStr}`;

                if (matchingLog && matchingLog.status === 'taken') {
                    status = 'TAKEN';
                    iconType = 'taken';
                    const loggedTimeStr = formatTime(matchingLog.time);
                    timeInfo = `Logged at ${loggedTimeStr} • Scheduled ${scheduledTimeStr}`;
                } else if (matchingLog && matchingLog.status === 'skipped') {
                    status = 'SKIPPED';
                    iconType = 'skipped';
                    timeInfo = `Skipped by user • Scheduled ${scheduledTimeStr}`;
                } else {
                    const scheduledDate = new Date(timeItem.reception_time);
                    const isPast = !isToday || (scheduledDate.getHours() < now.getHours() || (scheduledDate.getHours() === now.getHours() && scheduledDate.getMinutes() <= now.getMinutes()));
                    if (isPast) {
                        status = 'MISSED';
                        iconType = 'missed';
                        timeInfo = `Missed • Scheduled for ${scheduledTimeStr}`;
                    } else {
                        status = 'SCHEDULED';
                        iconType = 'scheduled';
                        timeInfo = `Scheduled for ${scheduledTimeStr}`;
                    }
                }

                const totalDoses = scheduledTimes.length;
                const dosePrefix = totalDoses > 1 ? `Dose ${tIdx + 1} of ${totalDoses} • ` : '';
                const doseAmount = timeItem.dose ? `${timeItem.dose} ${formStr.toLowerCase()}${parseInt(timeItem.dose, 10) > 1 ? 's' : ''}` : `1 ${formStr.toLowerCase()}`;
                const strengthStr = (med.strength && med.unit) ? ` (${med.strength} ${med.unit})` : '';

                items.push({
                    id: `${med._id || mIdx}-${doseId}`,
                    name: med.medicine_name,
                    form: med.forms || 'tablet',
                    status: status,
                    doseInfo: `${dosePrefix}${doseAmount}${strengthStr}`,
                    timeInfo: timeInfo,
                    iconType: iconType,
                    scheduledTime: new Date(timeItem.reception_time).getTime(),
                });
            });
        });

        // Sort chronologically by scheduled time
        items.sort((a, b) => (a.scheduledTime || 0) - (b.scheduledTime || 0));

        const groupTitle = isToday
            ? `TODAY, ${selectedDate.day} ${selectedDate.date}`
            : `${selectedDate.day}, ${selectedDate.monthYear} ${selectedDate.date}`;

        return [{
            group: groupTitle,
            items,
        }];
    }, []);

    // Fetch data on date selection
    const fetchDayHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const response = await medicationApi.getHistoryByDate(selectedDateObj.fullDate);
            const meds = response?.data?.medication;

            if (Array.isArray(meds) && meds.length > 0) {
                const formatted = transformHistoryData(meds, selectedDateObj);
                setHistoryData(formatted);
            } else {
                setHistoryData([]);
            }
        } catch (error) {
            console.error('Error fetching history for date:', error);
            setHistoryData([]);
        } finally {
            setLoadingHistory(false);
        }
    }, [selectedDateObj, transformHistoryData]);

    useEffect(() => {
        fetchDayHistory();
    }, [fetchDayHistory]);

    // Auto scroll to latest date on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            if (dateScrollRef.current) {
                dateScrollRef.current.scrollToEnd({ animated: true });
            }
        }, 150);
        return () => clearTimeout(timer);
    }, []);

    // Calculate dynamic stats
    const allItems = useMemo(() => {
        return historyData.reduce((acc, g) => acc.concat(g.items || []), []);
    }, [historyData]);

    const takenCount = useMemo(() => allItems.filter(i => i.status === 'TAKEN').length, [allItems]);
    const missedCount = useMemo(() => allItems.filter(i => i.status === 'MISSED' || i.status === 'SKIPPED').length, [allItems]);
    const scheduledCount = useMemo(() => allItems.filter(i => i.status === 'SCHEDULED').length, [allItems]);
    const totalCount = allItems.length;

    const adherencePercentage = useMemo(() => {
        if (totalCount === 0) return 100;
        return Math.round((takenCount / totalCount) * 100);
    }, [takenCount, totalCount]);

    const renderTimelineNodeIcon = (type) => {
        switch (type) {
            case 'taken':
                return (
                    <View style={[styles.timelineIconWrapper, styles.nodeTaken]}>
                        <HugeiconsIcon icon={Tick02Icon} size={14} color="#10B981" variant="solid" />
                    </View>
                );
            case 'missed':
                return (
                    <View style={[styles.timelineIconWrapper, styles.nodeMissed]}>
                        <HugeiconsIcon icon={AlertCircleIcon} size={14} color="#EF4444" />
                    </View>
                );
            case 'skipped':
                return (
                    <View style={[styles.timelineIconWrapper, styles.nodeSkipped]}>
                        <HugeiconsIcon icon={Cancel01Icon} size={14} color="#F59E0B" />
                    </View>
                );
            default:
                return (
                    <View style={[styles.timelineIconWrapper, isDark ? styles.nodeScheduledDark : styles.nodeScheduledLight]}>
                        <HugeiconsIcon icon={Time02Icon} size={14} color="#3B82F6" />
                    </View>
                );
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'TAKEN':
                return {
                    bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
                    text: '#10B981',
                    border: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
                };
            case 'MISSED':
                return {
                    bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
                    text: '#EF4444',
                    border: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA',
                };
            case 'SKIPPED':
                return {
                    bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
                    text: '#F59E0B',
                    border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
                };
            default:
                return {
                    bg: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
                    text: '#3B82F6',
                    border: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
                };
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, theme.safeArea]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={isDark ? '#0F172A' : '#F8FAFC'}
            />

            {/* ── Header ── */}
            <View style={[styles.header, theme.header]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={[styles.iconBtn, theme.iconBtn]}
                        activeOpacity={0.7}
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={isDark ? '#FFFFFF' : '#0F172A'} strokeWidth={2.5} />
                    </TouchableOpacity>
                    <View>
                        <Text style={[styles.headerTitle, theme.headerTitle]}>Medication History</Text>
                        <Text style={[styles.headerSubtitle, theme.headerSubtitle]}>Detailed Log & Adherence</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.iconBtn, theme.iconBtn]}
                    onPress={fetchDayHistory}
                    activeOpacity={0.7}
                >
                    <HugeiconsIcon icon={RefreshIcon} size={18} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.mainScrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Date Navigator Strip ── */}
                <View style={styles.dateSelectorContainer}>
                    <View style={styles.dateSelectorHeader}>
                        <View style={styles.monthTagRow}>
                            <HugeiconsIcon icon={Calendar01Icon} size={15} color="#3B82F6" />
                            <Text style={[styles.currentMonthText, theme.currentMonthText]}>
                                {selectedDateObj.monthYear.toUpperCase()}
                            </Text>
                        </View>
                        {!selectedDateObj.isToday && (
                            <TouchableOpacity
                                style={[styles.todayJumpBtn, theme.todayJumpBtn]}
                                onPress={() => setSelectedDateObj(DYNAMIC_DATES[DYNAMIC_DATES.length - 1])}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.todayJumpBtnText}>Jump to Today</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView
                        ref={dateScrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.dateChipsContent}
                    >
                        {DYNAMIC_DATES.map((item, idx) => {
                            const isActive = item.fullDate === selectedDateObj.fullDate;
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => setSelectedDateObj(item)}
                                    activeOpacity={0.75}
                                    style={[
                                        styles.dateChip,
                                        isActive ? styles.dateChipActive : theme.dateChipInactive,
                                    ]}
                                >
                                    <Text style={[styles.chipDayText, isActive ? styles.chipDayTextActive : theme.chipDayTextInactive]}>
                                        {item.day}
                                    </Text>
                                    <Text style={[styles.chipDateText, isActive ? styles.chipDateTextActive : theme.chipDateTextInactive]}>
                                        {item.date}
                                    </Text>
                                    {isActive && <View style={styles.activePillIndicator} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* ── Hero Adherence Summary Card ── */}
                <View style={[styles.heroCard, theme.heroCard]}>
                    <View style={styles.heroCardTop}>
                        <RadialAdherence percentage={adherencePercentage} isDark={isDark} />

                        <View style={styles.heroInfoCol}>
                            <View style={styles.heroBadgeRow}>
                                <View style={[styles.liveDot, { backgroundColor: adherencePercentage >= 80 ? '#10B981' : '#F59E0B' }]} />
                                <Text style={styles.heroBadgeText}>
                                    {adherencePercentage === 100 ? 'OPTIMAL ADHERENCE' : adherencePercentage >= 50 ? 'ON TRACK' : 'NEEDS ATTENTION'}
                                </Text>
                            </View>

                            <Text style={[styles.heroMainTitle, theme.heroMainTitle]}>
                                {selectedDateObj.isToday ? 'Today\'s Progress' : selectedDateObj.day + ', ' + selectedDateObj.date}
                            </Text>

                            <Text style={[styles.heroSubDescription, theme.heroSubDescription]}>
                                {totalCount === 0
                                    ? 'No doses scheduled for this day'
                                    : `${takenCount} of ${totalCount} doses confirmed taken`}
                            </Text>
                        </View>
                    </View>

                    {/* Progress Bar Track */}
                    <View style={[styles.heroProgressTrack, theme.heroProgressTrack]}>
                        <View
                            style={[
                                styles.heroProgressFill,
                                {
                                    width: `${adherencePercentage}%`,
                                    backgroundColor: adherencePercentage === 100 ? '#10B981' : (adherencePercentage < 50 ? '#EF4444' : '#3B82F6'),
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* ── Metric Stat Cards Row ── */}
                <View style={styles.statsRow}>
                    {/* Taken */}
                    <View style={[styles.statCard, theme.statCard]}>
                        <View style={styles.statHeaderRow}>
                            <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
                                <HugeiconsIcon icon={Tick02Icon} size={14} color="#10B981" variant="solid" />
                            </View>
                            <Text style={styles.statLabel}>TAKEN</Text>
                        </View>
                        <Text style={[styles.statValue, { color: '#10B981' }]}>{takenCount}</Text>
                    </View>

                    {/* Missed / Skipped */}
                    <View style={[styles.statCard, theme.statCard]}>
                        <View style={styles.statHeaderRow}>
                            <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}>
                                <HugeiconsIcon icon={AlertCircleIcon} size={14} color="#EF4444" />
                            </View>
                            <Text style={styles.statLabel}>MISSED</Text>
                        </View>
                        <Text style={[styles.statValue, { color: '#EF4444' }]}>{missedCount}</Text>
                    </View>

                    {/* Scheduled / Pending */}
                    <View style={[styles.statCard, theme.statCard]}>
                        <View style={styles.statHeaderRow}>
                            <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
                                <HugeiconsIcon icon={Time02Icon} size={14} color="#3B82F6" />
                            </View>
                            <Text style={styles.statLabel}>PENDING</Text>
                        </View>
                        <Text style={[styles.statValue, { color: '#3B82F6' }]}>{scheduledCount}</Text>
                    </View>
                </View>

                {/* ── Timeline Section ── */}
                <View style={styles.timelineSectionContainer}>
                    <View style={styles.timelineSectionHeader}>
                        <Text style={[styles.timelineSectionTitle, theme.timelineSectionTitle]}>
                            DOSE TIMELINE
                        </Text>
                        <View style={[styles.timelineCountBadge, theme.timelineCountBadge]}>
                            <Text style={[styles.timelineCountBadgeText, theme.timelineCountBadgeText]}>
                                {totalCount} {totalCount === 1 ? 'DOSE' : 'DOSES'}
                            </Text>
                        </View>
                    </View>

                    {loadingHistory ? (
                        <View style={styles.loadingWrapper}>
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text style={[styles.loadingLabel, theme.loadingLabel]}>Loading dose history...</Text>
                        </View>
                    ) : historyData.length > 0 && allItems.length > 0 ? (
                        <View style={styles.timelineWrapper}>
                            {/* Continuous vertical connected timeline line */}
                            <View style={[styles.continuousLine, theme.continuousLine]} />

                            {allItems.map((item, idx) => {
                                const badge = getStatusBadge(item.status);
                                const MedicineIcon = getIconForForm(item.form);
                                const isLast = idx === allItems.length - 1;

                                return (
                                    <View key={item.id} style={[styles.timelineRow, isLast && styles.timelineRowLast]}>
                                        {/* Timeline Node Column */}
                                        <View style={styles.timelineNodeCol}>
                                            {renderTimelineNodeIcon(item.iconType)}
                                        </View>

                                        {/* Timeline Item Card */}
                                        <View style={[styles.doseCard, theme.doseCard]}>
                                            {/* Header with Title and Status Badge */}
                                            <View style={styles.doseCardHeader}>
                                                <View style={styles.doseCardTitleRow}>
                                                    <View style={[styles.formIconBadge, theme.formIconBadge]}>
                                                        <HugeiconsIcon icon={MedicineIcon} size={15} color="#3B82F6" />
                                                    </View>
                                                    <Text style={[styles.medicineName, theme.medicineName]} numberOfLines={1}>
                                                        {item.name}
                                                    </Text>
                                                </View>

                                                <View style={[styles.statusBadgePill, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                                                    <Text style={[styles.statusBadgePillText, { color: badge.text }]}>
                                                        {item.status}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* Dose Description */}
                                            <Text style={[styles.doseInfoText, theme.doseInfoText]}>
                                                {item.doseInfo}
                                            </Text>

                                            {/* Footer with Schedule / Log Timestamp */}
                                            <View style={[styles.doseFooterRow, theme.doseFooterRow]}>
                                                <HugeiconsIcon
                                                    icon={item.status === 'TAKEN' ? Tick02Icon : Time02Icon}
                                                    size={13}
                                                    color={item.status === 'TAKEN' ? '#10B981' : (isDark ? '#94A3B8' : '#64748B')}
                                                />
                                                <Text style={[
                                                    styles.doseFooterText,
                                                    theme.doseFooterText,
                                                    item.status === 'TAKEN' && { color: isDark ? '#A7F3D0' : '#065F46' },
                                                ]}>
                                                    {item.timeInfo}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        /* Empty State */
                        <View style={[styles.emptyCard, theme.emptyCard]}>
                            <View style={[styles.emptyIconCircle, theme.emptyIconCircle]}>
                                <HugeiconsIcon icon={Medicine01Icon} size={28} color="#3B82F6" />
                            </View>
                            <Text style={[styles.emptyTitle, theme.emptyTitle]}>No Doses Logged</Text>
                            <Text style={[styles.emptySub, theme.emptySub]}>
                                No medication intake was recorded or scheduled for this date.
                            </Text>
                            <TouchableOpacity
                                style={[styles.emptyActionBtn, theme.emptyActionBtn]}
                                onPress={() => navigation.navigate('Medication')}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.emptyActionBtnText}>View Active Schedule</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
};

// ─── Base Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 8 : 14,
        paddingBottom: 14,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.4,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 1,
    },
    mainScrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },

    // Date Selector
    dateSelectorContainer: {
        marginBottom: 18,
    },
    dateSelectorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 2,
    },
    monthTagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    currentMonthText: {
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    todayJumpBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
    },
    todayJumpBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#3B82F6',
    },
    dateChipsContent: {
        gap: 10,
        paddingRight: 10,
    },
    dateChip: {
        width: 56,
        height: 74,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        position: 'relative',
    },
    dateChipActive: {
        backgroundColor: '#2563EB',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
    },
    chipDayText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    chipDayTextActive: {
        color: 'rgba(255, 255, 255, 0.85)',
    },
    chipDateText: {
        fontSize: 18,
        fontWeight: '800',
    },
    chipDateTextActive: {
        color: '#FFFFFF',
    },
    activePillIndicator: {
        position: 'absolute',
        bottom: 6,
        width: 14,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    },

    // Hero Card
    heroCard: {
        borderRadius: 24,
        borderWidth: 1,
        padding: 18,
        marginBottom: 16,
    },
    heroCardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    heroInfoCol: {
        flex: 1,
    },
    heroBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    heroBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.6,
        color: '#3B82F6',
    },
    heroMainTitle: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.3,
    },
    heroSubDescription: {
        fontSize: 12,
        marginTop: 2,
    },
    heroProgressTrack: {
        height: 6,
        borderRadius: 3,
        marginTop: 14,
        overflow: 'hidden',
    },
    heroProgressFill: {
        height: '100%',
        borderRadius: 3,
    },

    // Stats Row
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 22,
    },
    statCard: {
        flex: 1,
        borderRadius: 18,
        borderWidth: 1,
        padding: 12,
    },
    statHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    statIconBadge: {
        width: 22,
        height: 22,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
        color: '#94A3B8',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },

    // Timeline Section
    timelineSectionContainer: {
        flex: 1,
    },
    timelineSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        paddingHorizontal: 2,
    },
    timelineSectionTitle: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    timelineCountBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
    },
    timelineCountBadgeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    timelineWrapper: {
        position: 'relative',
        paddingLeft: 4,
    },
    continuousLine: {
        position: 'absolute',
        left: 17,
        top: 20,
        bottom: 20,
        width: 2,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    timelineRowLast: {
        marginBottom: 0,
    },
    timelineNodeCol: {
        width: 28,
        alignItems: 'center',
        marginRight: 12,
        marginTop: 14,
        zIndex: 2,
    },
    timelineIconWrapper: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    nodeTaken: {
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
    },
    nodeMissed: {
        backgroundColor: '#FEF2F2',
        borderColor: '#EF4444',
    },
    nodeSkipped: {
        backgroundColor: '#FFFBEB',
        borderColor: '#F59E0B',
    },
    nodeScheduledDark: {
        backgroundColor: '#1E293B',
        borderColor: '#3B82F6',
    },
    nodeScheduledLight: {
        backgroundColor: '#EFF6FF',
        borderColor: '#3B82F6',
    },

    // Dose Card
    doseCard: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        padding: 15,
    },
    doseCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    doseCardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
        marginRight: 8,
    },
    formIconBadge: {
        width: 28,
        height: 28,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    medicineName: {
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: -0.3,
        flex: 1,
    },
    statusBadgePill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
    },
    statusBadgePillText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    doseInfoText: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 10,
    },
    doseFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingTop: 8,
        borderTopWidth: 1,
    },
    doseFooterText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Empty State
    emptyCard: {
        borderRadius: 22,
        borderWidth: 1,
        padding: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    emptyIconCircle: {
        width: 58,
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '800',
        marginBottom: 6,
    },
    emptySub: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 18,
        paddingHorizontal: 16,
    },
    emptyActionBtn: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 14,
    },
    emptyActionBtnText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },

    loadingWrapper: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    loadingLabel: {
        fontSize: 13,
        fontWeight: '600',
    },
    bottomSpacer: {
        height: 40,
    },
});

// ─── Dark Theme Tokens ─────────────────────────────────────────────
const darkStyles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#0B0F19',
    },
    header: {
        backgroundColor: '#0B0F19',
        borderBottomColor: '#1E293B',
    },
    iconBtn: {
        backgroundColor: '#161E2E',
        borderColor: '#26334D',
    },
    headerTitle: {
        color: '#F8FAFC',
    },
    headerSubtitle: {
        color: '#94A3B8',
    },
    currentMonthText: {
        color: '#94A3B8',
    },
    todayJumpBtn: {
        backgroundColor: '#161E2E',
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    dateChipInactive: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
        borderWidth: 1,
    },
    chipDayTextInactive: {
        color: '#64748B',
    },
    chipDateTextInactive: {
        color: '#F1F5F9',
    },
    heroCard: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
    },
    heroMainTitle: {
        color: '#F8FAFC',
    },
    heroSubDescription: {
        color: '#94A3B8',
    },
    heroProgressTrack: {
        backgroundColor: '#1E293B',
    },
    statCard: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
    },
    timelineSectionTitle: {
        color: '#94A3B8',
    },
    timelineCountBadge: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
    },
    timelineCountBadgeText: {
        color: '#94A3B8',
    },
    continuousLine: {
        backgroundColor: '#1E293B',
    },
    doseCard: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
    },
    formIconBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
    },
    medicineName: {
        color: '#F8FAFC',
    },
    doseInfoText: {
        color: '#94A3B8',
    },
    doseFooterRow: {
        borderTopColor: '#1E293B',
    },
    doseFooterText: {
        color: '#64748B',
    },
    emptyCard: {
        backgroundColor: '#131B2A',
        borderColor: '#1E293B',
    },
    emptyIconCircle: {
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
    },
    emptyTitle: {
        color: '#F8FAFC',
    },
    emptySub: {
        color: '#94A3B8',
    },
    emptyActionBtn: {
        backgroundColor: '#2563EB',
    },
    loadingLabel: {
        color: '#94A3B8',
    },
});

// ─── Light Theme Tokens ────────────────────────────────────────────
const lightStyles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E2E8F0',
    },
    iconBtn: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        color: '#0F172A',
    },
    headerSubtitle: {
        color: '#64748B',
    },
    currentMonthText: {
        color: '#64748B',
    },
    todayJumpBtn: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
    },
    dateChipInactive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
    },
    chipDayTextInactive: {
        color: '#94A3B8',
    },
    chipDateTextInactive: {
        color: '#0F172A',
    },
    heroCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    heroMainTitle: {
        color: '#0F172A',
    },
    heroSubDescription: {
        color: '#64748B',
    },
    heroProgressTrack: {
        backgroundColor: '#E2E8F0',
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    timelineSectionTitle: {
        color: '#64748B',
    },
    timelineCountBadge: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
    },
    timelineCountBadgeText: {
        color: '#64748B',
    },
    continuousLine: {
        backgroundColor: '#E2E8F0',
    },
    doseCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    formIconBadge: {
        backgroundColor: '#EFF6FF',
    },
    medicineName: {
        color: '#0F172A',
    },
    doseInfoText: {
        color: '#64748B',
    },
    doseFooterRow: {
        borderTopColor: '#F1F5F9',
    },
    doseFooterText: {
        color: '#64748B',
    },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
    },
    emptyIconCircle: {
        backgroundColor: '#EFF6FF',
    },
    emptyTitle: {
        color: '#0F172A',
    },
    emptySub: {
        color: '#64748B',
    },
    emptyActionBtn: {
        backgroundColor: '#2563EB',
    },
    loadingLabel: {
        color: '#64748B',
    },
});

export default MedicationHistory;
