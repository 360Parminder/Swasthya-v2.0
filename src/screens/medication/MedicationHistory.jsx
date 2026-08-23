import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  Tick02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  Time02Icon,
  PillIcon,
  Medicine01Icon,
  MedicineBottle01Icon,
  InjectionIcon,
  Calendar01Icon,
  RefreshIcon,
  CheckmarkCircle02Icon,
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
  const size = 80;
  const strokeWidth = 8;
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
            stroke={isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5E7EB'}
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
        <Text style={[radialStyles.percentText, { color: isDark ? '#FFFFFF' : '#111827' }]}>
          {Math.round(validPct)}%
        </Text>
      </View>
    </View>
  );
};

const radialStyles = StyleSheet.create({
  wrapper: {
    width: 80,
    height: 80,
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
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
});

const MedicationHistory = () => {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  // State logic
  const [selectedDateObj, setSelectedDateObj] = useState(DYNAMIC_DATES[DYNAMIC_DATES.length - 1]);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'TAKEN' | 'MISSED' | 'PENDING'

  // ScrollView reference for the horizontal date selector
  const dateScrollRef = useRef(null);

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

        let status = 'PENDING';
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
          timeInfo = `Skipped • Scheduled ${scheduledTimeStr}`;
        } else {
          const scheduledDate = new Date(timeItem.reception_time);
          const isPast = !isToday || (scheduledDate.getHours() < now.getHours() || (scheduledDate.getHours() === now.getHours() && scheduledDate.getMinutes() <= now.getMinutes()));
          if (isPast) {
            status = 'MISSED';
            iconType = 'missed';
            timeInfo = `Missed • Scheduled for ${scheduledTimeStr}`;
          } else {
            status = 'PENDING';
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
      setRefreshing(false);
    }
  }, [selectedDateObj, transformHistoryData]);

  useEffect(() => {
    fetchDayHistory();
  }, [fetchDayHistory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDayHistory();
  };

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
  const pendingCount = useMemo(() => allItems.filter(i => i.status === 'PENDING').length, [allItems]);
  const totalCount = allItems.length;

  const adherencePercentage = useMemo(() => {
    if (totalCount === 0) return 100;
    return Math.round((takenCount / totalCount) * 100);
  }, [takenCount, totalCount]);

  // Filtered timeline items based on user filter tab
  const filteredItems = useMemo(() => {
    if (statusFilter === 'ALL') return allItems;
    if (statusFilter === 'TAKEN') return allItems.filter(i => i.status === 'TAKEN');
    if (statusFilter === 'MISSED') return allItems.filter(i => i.status === 'MISSED' || i.status === 'SKIPPED');
    if (statusFilter === 'PENDING') return allItems.filter(i => i.status === 'PENDING');
    return allItems;
  }, [allItems, statusFilter]);

  const renderTimelineNodeIcon = (type) => {
    switch (type) {
      case 'taken':
        return (
          <View style={[styles.timelineIconWrapper, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5', borderColor: '#10B981' }]}>
            <HugeiconsIcon icon={Tick02Icon} size={13} color="#10B981" strokeWidth={2.5} />
          </View>
        );
      case 'missed':
        return (
          <View style={[styles.timelineIconWrapper, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEF2F2', borderColor: '#EF4444' }]}>
            <HugeiconsIcon icon={AlertCircleIcon} size={13} color="#EF4444" strokeWidth={2.5} />
          </View>
        );
      case 'skipped':
        return (
          <View style={[styles.timelineIconWrapper, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.18)' : '#FFFBEB', borderColor: '#F59E0B' }]}>
            <HugeiconsIcon icon={Cancel01Icon} size={13} color="#F59E0B" strokeWidth={2.5} />
          </View>
        );
      default:
        return (
          <View style={[styles.timelineIconWrapper, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.18)' : '#EFF6FF', borderColor: '#3B82F6' }]}>
            <HugeiconsIcon icon={Time02Icon} size={13} color="#3B82F6" strokeWidth={2.5} />
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* ── Top Navigation Bar ── */}
      <View style={[styles.navBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={colors.textPrimary} strokeWidth={2.2} />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>Medication History</Text>
          <Text style={[styles.navSubtitle, { color: colors.textSecondary }]}>Adherence & Daily Logs</Text>
        </View>

        <TouchableOpacity
          style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          onPress={fetchDayHistory}
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={RefreshIcon} size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ── Horizontal Date Selector ── */}
        <View style={styles.dateSelectorContainer}>
          <View style={styles.dateSelectorHeader}>
            <View style={[styles.monthTagRow, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.12)' : '#EFF6FF' }]}>
              <HugeiconsIcon icon={Calendar01Icon} size={14} color={colors.primary} />
              <Text style={[styles.currentMonthText, { color: colors.primary }]}>
                {selectedDateObj.monthYear.toUpperCase()}
              </Text>
            </View>

            {!selectedDateObj.isToday && (
              <TouchableOpacity
                style={[styles.todayJumpBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                onPress={() => {
                  const todayObj = DYNAMIC_DATES[DYNAMIC_DATES.length - 1];
                  setSelectedDateObj(todayObj);
                  if (dateScrollRef.current) {
                    dateScrollRef.current.scrollToEnd({ animated: true });
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.todayJumpBtnText, { color: colors.textPrimary }]}>Today</Text>
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
                    isActive
                      ? { backgroundColor: colors.primary, borderColor: colors.primary }
                      : { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipDayText,
                      { color: isActive ? '#FFFFFF' : colors.textMuted },
                    ]}
                  >
                    {item.day}
                  </Text>
                  <Text
                    style={[
                      styles.chipDateText,
                      { color: isActive ? '#FFFFFF' : colors.textPrimary },
                    ]}
                  >
                    {item.date}
                  </Text>
                  {item.isToday && (
                    <View
                      style={[
                        styles.todayDot,
                        { backgroundColor: isActive ? '#FFFFFF' : colors.primary },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Hero Adherence Progress Card ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.heroCardTop}>
            <RadialAdherence percentage={adherencePercentage} isDark={isDark} />

            <View style={styles.heroInfoCol}>
              <View style={styles.heroBadgeRow}>
                <View
                  style={[
                    styles.liveDot,
                    {
                      backgroundColor:
                        adherencePercentage === 100
                          ? '#10B981'
                          : adherencePercentage >= 50
                          ? '#3B82F6'
                          : '#EF4444',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.heroBadgeText,
                    {
                      color:
                        adherencePercentage === 100
                          ? '#10B981'
                          : adherencePercentage >= 50
                          ? colors.primary
                          : '#EF4444',
                    },
                  ]}
                >
                  {adherencePercentage === 100
                    ? 'OPTIMAL 100%'
                    : adherencePercentage >= 50
                    ? 'ON TRACK'
                    : 'NEEDS ATTENTION'}
                </Text>
              </View>

              <Text style={[styles.heroMainTitle, { color: colors.textPrimary }]}>
                {selectedDateObj.isToday
                  ? "Today's Adherence"
                  : `${selectedDateObj.day}, ${selectedDateObj.date} ${selectedDateObj.monthYear}`}
              </Text>

              <Text style={[styles.heroSubDescription, { color: colors.textSecondary }]}>
                {totalCount === 0
                  ? 'No scheduled doses for this date'
                  : `${takenCount} of ${totalCount} doses confirmed taken`}
              </Text>
            </View>
          </View>

          {/* Progress Bar Track */}
          <View style={[styles.heroProgressTrack, { backgroundColor: colors.surfaceAlt }]}>
            <View
              style={[
                styles.heroProgressFill,
                {
                  width: `${adherencePercentage}%`,
                  backgroundColor:
                    adherencePercentage === 100
                      ? '#10B981'
                      : adherencePercentage < 50
                      ? '#EF4444'
                      : colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* ── Metric Stat Cards Row ── */}
        <View style={styles.statsRow}>
          {/* Taken */}
          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              statusFilter === 'TAKEN' && { borderColor: '#10B981', borderWidth: 1.5 },
            ]}
            onPress={() => setStatusFilter(statusFilter === 'TAKEN' ? 'ALL' : 'TAKEN')}
            activeOpacity={0.8}
          >
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
                <HugeiconsIcon icon={Tick02Icon} size={14} color="#10B981" strokeWidth={2.2} />
              </View>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>TAKEN</Text>
            </View>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{takenCount}</Text>
          </TouchableOpacity>

          {/* Missed */}
          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              statusFilter === 'MISSED' && { borderColor: '#EF4444', borderWidth: 1.5 },
            ]}
            onPress={() => setStatusFilter(statusFilter === 'MISSED' ? 'ALL' : 'MISSED')}
            activeOpacity={0.8}
          >
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}>
                <HugeiconsIcon icon={AlertCircleIcon} size={14} color="#EF4444" strokeWidth={2.2} />
              </View>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>MISSED</Text>
            </View>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{missedCount}</Text>
          </TouchableOpacity>

          {/* Pending */}
          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              statusFilter === 'PENDING' && { borderColor: colors.primary, borderWidth: 1.5 },
            ]}
            onPress={() => setStatusFilter(statusFilter === 'PENDING' ? 'ALL' : 'PENDING')}
            activeOpacity={0.8}
          >
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF' }]}>
                <HugeiconsIcon icon={Time02Icon} size={14} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>PENDING</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.primary }]}>{pendingCount}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Status Filter Chips Bar ── */}
        <View style={styles.filterChipsContainer}>
          {[
            { key: 'ALL', label: 'All Doses', count: totalCount },
            { key: 'TAKEN', label: 'Taken', count: takenCount },
            { key: 'MISSED', label: 'Missed', count: missedCount },
            { key: 'PENDING', label: 'Pending', count: pendingCount },
          ].map((tab) => {
            const isSelected = statusFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterPill,
                  isSelected
                    ? { backgroundColor: colors.textPrimary }
                    : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
                onPress={() => setStatusFilter(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isSelected ? (isDark ? '#000000' : '#FFFFFF') : colors.textSecondary },
                  ]}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Timeline Section ── */}
        <View style={styles.timelineSectionContainer}>
          <View style={styles.timelineSectionHeader}>
            <Text style={[styles.timelineSectionTitle, { color: colors.textPrimary }]}>
              DOSE TIMELINE
            </Text>
            <View style={[styles.timelineCountBadge, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
              <Text style={[styles.timelineCountBadgeText, { color: colors.textSecondary }]}>
                {filteredItems.length} {filteredItems.length === 1 ? 'DOSE' : 'DOSES'}
              </Text>
            </View>
          </View>

          {loadingHistory ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingLabel, { color: colors.textSecondary }]}>
                Loading dose history...
              </Text>
            </View>
          ) : filteredItems.length > 0 ? (
            <View style={styles.timelineWrapper}>
              {/* Continuous vertical connected timeline line */}
              <View style={[styles.continuousLine, { backgroundColor: colors.border }]} />

              {filteredItems.map((item, idx) => {
                const badge = getStatusBadge(item.status);
                const MedicineIcon = getIconForForm(item.form);
                const isLast = idx === filteredItems.length - 1;

                return (
                  <View key={item.id} style={[styles.timelineRow, isLast && styles.timelineRowLast]}>
                    {/* Timeline Node Column */}
                    <View style={styles.timelineNodeCol}>
                      {renderTimelineNodeIcon(item.iconType)}
                    </View>

                    {/* Timeline Item Card */}
                    <View style={[styles.doseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      {/* Header with Title and Status Badge */}
                      <View style={styles.doseCardHeader}>
                        <View style={styles.doseCardTitleRow}>
                          <View style={[styles.formIconBadge, { backgroundColor: colors.surfaceAlt }]}>
                            <HugeiconsIcon icon={MedicineIcon} size={16} color={colors.primary} />
                          </View>
                          <Text style={[styles.medicineName, { color: colors.textPrimary }]} numberOfLines={1}>
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
                      <Text style={[styles.doseInfoText, { color: colors.textSecondary }]}>
                        {item.doseInfo}
                      </Text>

                      {/* Footer with Schedule / Log Timestamp */}
                      <View style={[styles.doseFooterRow, { borderTopColor: colors.border }]}>
                        <HugeiconsIcon
                          icon={item.status === 'TAKEN' ? CheckmarkCircle02Icon : Time02Icon}
                          size={14}
                          color={item.status === 'TAKEN' ? '#10B981' : colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.doseFooterText,
                            { color: item.status === 'TAKEN' ? (isDark ? '#A7F3D0' : '#047857') : colors.textMuted },
                          ]}
                        >
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
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceAlt }]}>
                <HugeiconsIcon icon={Medicine01Icon} size={30} color={colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {statusFilter === 'ALL' ? 'No Doses Logged' : `No ${statusFilter.toLowerCase()} doses`}
              </Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                {statusFilter === 'ALL'
                  ? 'No medication intake was recorded or scheduled for this date.'
                  : `There are no doses matching the ${statusFilter.toLowerCase()} filter for this day.`}
              </Text>
              <TouchableOpacity
                style={[styles.emptyActionBtn, { backgroundColor: colors.primary }]}
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

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  navTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  navSubtitle: {
    fontSize: 11,
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
    marginBottom: 20,
  },
  dateSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  monthTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  currentMonthText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  todayJumpBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  todayJumpBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateChipsContent: {
    gap: 8,
  },
  dateChip: {
    width: 54,
    height: 70,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  chipDayText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  chipDateText: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },

  // Hero Card
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
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
  },
  heroMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  heroSubDescription: {
    fontSize: 12,
    fontWeight: '500',
  },
  heroProgressTrack: {
    height: 6,
    borderRadius: 3,
    marginTop: 16,
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
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  // Filter Chips
  filterChipsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Timeline Section
  timelineSectionContainer: {
    marginBottom: 20,
  },
  timelineSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timelineSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  timelineCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  timelineCountBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  loadingWrapper: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  timelineWrapper: {
    position: 'relative',
    paddingLeft: 4,
  },
  continuousLine: {
    position: 'absolute',
    left: 17,
    top: 15,
    bottom: 20,
    width: 2,
    borderRadius: 1,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineRowLast: {
    marginBottom: 0,
  },
  timelineNodeCol: {
    width: 28,
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 14,
    zIndex: 2,
  },
  timelineIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  doseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  doseCardTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  formIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicineName: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    flex: 1,
  },
  statusBadgePill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
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
    marginBottom: 12,
    lineHeight: 18,
  },
  doseFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  doseFooterText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Empty State
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    lineHeight: 19,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  emptyActionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 20,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 30,
  },
});

export default MedicationHistory;
