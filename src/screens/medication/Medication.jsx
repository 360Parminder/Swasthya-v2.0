import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Add01Icon,
  Medicine01Icon,
  PillIcon,
  MedicineBottle01Icon,
  InjectionIcon,
  UserGroupIcon,
  Calendar01Icon,
  Notification03Icon,
  Tick02Icon,
  Clock01Icon,
  AlertCircleIcon,
  SparklesIcon
} from '@hugeicons/core-free-icons';
import Svg, { Circle, G } from 'react-native-svg';
import AddMedication from '../../components/model/Medication/AddMedication';
import { medicationApi } from '../../api/medicationApi';
import { playTickSound } from '../../services/soundService';

// Form Icon Helper
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

// Robust Local Time Formatter using exact system time
export const formatDoseTime = (timeInput) => {
  if (!timeInput) return '08:00 AM';
  try {
    const d = new Date(timeInput);
    if (isNaN(d.getTime())) return String(timeInput);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return '08:00 AM';
  }
};

// Helper to flatten nested backend medication groups ({ record: [...] })
export const parseMedicationsList = (rawMedications) => {
  if (!rawMedications || !Array.isArray(rawMedications)) return [];
  const list = [];
  rawMedications.forEach(group => {
    if (group && Array.isArray(group.record) && group.record.length > 0) {
      group.record.forEach(rec => {
        if (rec) {
          list.push({
            ...rec,
            _id: rec._id,
            parentContainerId: group._id,
            forWhom: group.forWhom || 'myself',
            relative_id: group.relative_id,
            logs: rec.logs || [],
            frequencyText: typeof rec.frequency === 'object' ? rec.frequency?.type || 'Daily' : (rec.frequency || 'Daily'),
            stockCount: typeof rec.stock === 'object' ? rec.stock?.quantity : (typeof rec.stock === 'number' ? rec.stock : 30),
            stockThreshold: typeof rec.stock === 'object' ? rec.stock?.threshold : 5,
            stockRemind: typeof rec.stock === 'object' ? rec.stock?.remind : true,
          });
        }
      });
    } else if (group && group.medicine_name) {
      list.push({
        ...group,
        _id: group._id,
        logs: group.logs || [],
        frequencyText: typeof group.frequency === 'object' ? group.frequency?.type || 'Daily' : (group.frequency || 'Daily'),
        stockCount: typeof group.stock === 'object' ? group.stock?.quantity : (typeof group.stock === 'number' ? group.stock : 30),
        stockThreshold: typeof group.stock === 'object' ? group.stock?.threshold : 5,
        stockRemind: typeof group.stock === 'object' ? group.stock?.remind : true,
      });
    }
  });
  return list;
};

const Medication = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'today' | 'circle'
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [takenDoses, setTakenDoses] = useState({});

  // Fetch all medications from API
  const fetchMedications = useCallback(async () => {
    try {
      const response = await medicationApi.getAllMedications();
      const rawMeds = response?.data?.medications || response?.data?.data || response?.data || [];
      const parsed = parseMedicationsList(rawMeds);
      setMedications(parsed);

      // Initialize taken doses map from backend logs for today
      const todayStr = new Date().toISOString().split('T')[0];
      const initialTaken = {};

      parsed.forEach((med, medIdx) => {
        if (Array.isArray(med.logs)) {
          med.logs.forEach((log) => {
            const logDateStr = log.time ? new Date(log.time).toISOString().split('T')[0] : null;
            if (logDateStr === todayStr && log.status === 'taken') {
              if (log.dose_id) {
                initialTaken[log.dose_id] = true;
              } else if (med._id) {
                initialTaken[med._id.toString()] = true;
                if (Array.isArray(med.times) && med.times.length > 0) {
                  med.times.forEach(t => {
                    if (t._id) initialTaken[t._id.toString()] = true;
                  });
                }
              }
            }
          });
        }
      });
      setTakenDoses(initialTaken);
    } catch (error) {
      console.log('Error fetching medications:', error?.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMedications();
  }, [fetchMedications]);

  const toggleTakeDose = async (item) => {
    playTickSound();
    const key = item.doseId;
    const isCurrentlyTaken = !!takenDoses[key];
    const nextTaken = !isCurrentlyTaken;

    // Optimistically update taken state
    setTakenDoses(prev => ({
      ...prev,
      [key]: nextTaken,
    }));

    // Optimistically update stock count
    setMedications(prevMeds =>
      prevMeds.map(m => {
        if (m._id === (item.medicationId || item._id)) {
          const currentQty = m.stockCount !== undefined ? m.stockCount : 30;
          const nextQty = nextTaken ? Math.max(0, currentQty - 1) : currentQty + 1;
          return { ...m, stockCount: nextQty };
        }
        return m;
      })
    );

    try {
      await medicationApi.updateMedicationStatus({
        medication_id: item.medicationId || item._id,
        dose_id: item.doseId,
        status: nextTaken ? 'taken' : 'not taken yet',
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.log('Error updating medication status:', error?.message || error);
      // Revert optimistic updates on failure
      setTakenDoses(prev => ({
        ...prev,
        [key]: isCurrentlyTaken,
      }));
      setMedications(prevMeds =>
        prevMeds.map(m => {
          if (m._id === (item.medicationId || item._id)) {
            const currentQty = m.stockCount !== undefined ? m.stockCount : 30;
            const prevQty = isCurrentlyTaken ? Math.max(0, currentQty - 1) : currentQty + 1;
            return { ...m, stockCount: prevQty };
          }
          return m;
        })
      );
    }
  };

  // Filtered List
  const filteredMeds = useMemo(() => {
    return medications.filter(item => {
      if (selectedFilter === 'circle') return item.forWhom === 'connection';
      return true;
    });
  }, [medications, selectedFilter]);

  // Flatten medications into individual scheduled dose items for each scheduled timing
  const displayItems = useMemo(() => {
    let items = [];
    filteredMeds.forEach((med, medIdx) => {
      if (Array.isArray(med.times) && med.times.length > 0) {
        med.times.forEach((t, tIdx) => {
          items.push({
            ...med,
            medicationId: med._id,
            doseId: t._id ? t._id.toString() : `${med._id || medIdx}-time-${tIdx}`,
            doseNumber: tIdx + 1,
            totalDoses: med.times.length,
            doseTime: t.reception_time,
            doseQuantity: t.dose || '1',
          });
        });
      } else {
        items.push({
          ...med,
          medicationId: med._id,
          doseId: med._id ? med._id.toString() : `med-${medIdx}`,
          doseNumber: 1,
          totalDoses: 1,
          doseTime: new Date().toISOString(),
          doseQuantity: '1',
        });
      }
    });

    // Sort chronologically by scheduled time
    items.sort((a, b) => {
      return new Date(a.doseTime) - new Date(b.doseTime);
    });

    return items;
  }, [filteredMeds]);

  // Calculate adherence stats based on individual doses
  const totalDosesCount = displayItems.length;
  const takenCount = Object.values(takenDoses).filter(Boolean).length;
  const adherencePercent = totalDosesCount > 0 ? Math.min(100, Math.round((takenCount / totalDosesCount) * 100)) : 100;

  // Next upcoming dose calculation
  const nextDoseStr = useMemo(() => {
    if (!displayItems || displayItems.length === 0) return '08:00 PM';
    const now = new Date();
    const upcoming = displayItems.filter(item => new Date(item.doseTime) >= now);
    const target = upcoming.length > 0 ? upcoming[0] : displayItems[0];
    return formatDoseTime(target.doseTime);
  }, [displayItems]);

  return (
    <SafeAreaView style={[styles.safeArea, theme.safeArea]} edges={['top', 'bottom']}>
      {/* ── Top Navigation Bar ── */}
      <View style={[styles.navBar, theme.navBar]}>
        <TouchableOpacity
          style={[styles.navIconBtn, theme.navIconBtn]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={[styles.navTitle, theme.navTitle]}>Medications</Text>
          <Text style={[styles.navSubtitle, theme.navSubtitle]}>Daily Regimen & Circle</Text>
        </View>

        <TouchableOpacity
          style={[styles.addPillBtn, theme.addPillBtn]}
          onPress={() => setIsAddModalVisible(true)}
          activeOpacity={0.85}
        >
          <HugeiconsIcon icon={Add01Icon} size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.addPillBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#3B82F6' : '#2563EB'}
            colors={['#2563EB']}
          />
        }
      >
        {/* ── Hero Adherence Metric Card ── */}
        <View style={[styles.heroCard, theme.heroCard]}>
          <View style={styles.heroLeft}>
            {/* SVG Radial Progress */}
            <View style={styles.radialWrapper}>
              <Svg width={72} height={72}>
                <G rotation="-90" origin="36, 36">
                  <Circle
                    cx="36"
                    cy="36"
                    r="28"
                    stroke={isDark ? '#272730' : '#E5E7EB'}
                    strokeWidth="6"
                    fill="none"
                  />
                  <Circle
                    cx="36"
                    cy="36"
                    r="28"
                    stroke="#3B82F6"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(adherencePercent / 100) * 175.9} 175.9`}
                  />
                </G>
              </Svg>
              <View style={styles.radialCenter}>
                <Text style={[styles.radialPercent, theme.radialPercent]}>{adherencePercent}%</Text>
              </View>
            </View>

            {/* Adherence Context */}
            <View style={styles.heroTextCol}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.activeDot} />
                <Text style={styles.heroBadgeText}>TODAY'S SCHEDULE</Text>
              </View>
              <Text style={[styles.heroMainHeading, theme.heroMainHeading]}>
                {takenCount > 0 ? `${takenCount} of ${totalDosesCount} Taken` : `${totalDosesCount} Doses Scheduled`}
              </Text>
              <Text style={[styles.heroSubText, theme.heroSubText]}>
                {totalDosesCount > 0 ? `${filteredMeds.length} active prescriptions tracked` : 'No active prescriptions'}
              </Text>
            </View>
          </View>

          {/* Next Dose Banner Footer */}
          <View style={[styles.nextDoseBanner, theme.nextDoseBanner]}>
            <View style={styles.nextDoseLeft}>
              <HugeiconsIcon icon={Clock01Icon} size={15} color="#3B82F6" />
              <Text style={[styles.nextDoseLabel, theme.nextDoseLabel]}>Next dose scheduled for </Text>
              <Text style={[styles.nextDoseHighlight, theme.nextDoseHighlight]}>{nextDoseStr}</Text>
            </View>
            <HugeiconsIcon icon={SparklesIcon} size={14} color="#F59E0B" />
          </View>
        </View>

        {/* ── Segmented Category Filter ── */}
        <View style={[styles.filterSegmentContainer, theme.filterSegmentContainer]}>
          {[
            { key: 'all', label: 'All Doses' },
            { key: 'today', label: "Today's Plan" },
            { key: 'circle', label: 'Care Circle' },
          ].map((tab) => {
            const isSelected = selectedFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterTab,
                  isSelected ? theme.filterTabActive : theme.filterTabInactive
                ]}
                onPress={() => setSelectedFilter(tab.key)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterTabText,
                  isSelected ? theme.filterTabTextActive : theme.filterTabTextInactive
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Active Medications Section ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, theme.sectionTitle]}>
            {selectedFilter === 'circle' ? 'Care Circle Prescriptions' : 'Scheduled Doses'}
          </Text>
          <View style={[styles.countBadge, theme.countBadge]}>
            <Text style={[styles.countBadgeText, theme.countBadgeText]}>
              {`${displayItems.length} Doses`}
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={[styles.loadingText, theme.loadingText]}>Loading your medications...</Text>
          </View>
        ) : displayItems.length === 0 ? (
          <View style={[styles.emptyCard, theme.emptyCard]}>
            <View style={[styles.emptyIconBox, theme.emptyIconBox]}>
              <HugeiconsIcon icon={Medicine01Icon} size={30} color="#3B82F6" />
            </View>
            <Text style={[styles.emptyTitle, theme.emptyTitle]}>No Medications Added Yet</Text>
            <Text style={[styles.emptySub, theme.emptySub]}>
              {selectedFilter === 'circle' 
                ? 'No care circle prescriptions found.' 
                : 'Track your daily intake by adding your prescribed medications.'}
            </Text>
            {selectedFilter !== 'circle' && (
              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={() => setIsAddModalVisible(true)}
                activeOpacity={0.85}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.emptyAddBtnText}>Add Medication</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {displayItems.map((item) => {
              const FormIcon = getIconForForm(item.forms || 'tablet');
              const isTaken = takenDoses[item.doseId];
              const timeDisplay = formatDoseTime(item.doseTime);
              const stockQty = item.stockCount !== undefined ? item.stockCount : 30;
              const isLowStock = stockQty <= (item.stockThreshold || 5);
              const formName = item.forms ? (item.forms.charAt(0).toUpperCase() + item.forms.slice(1)) : 'Tablet';

              return (
                <View key={item.doseId} style={[styles.medCard, theme.medCard]}>
                  {/* Top Row: Icon + Name + Action Check */}
                  <View style={styles.medCardTopRow}>
                    <View style={[styles.medIconBox, theme.medIconBox]}>
                      <HugeiconsIcon icon={FormIcon} size={22} color="#3B82F6" />
                    </View>

                    <View style={styles.medCardInfo}>
                      <View style={styles.medNameRow}>
                        <Text style={[styles.medNameText, theme.medNameText]}>{item.medicine_name}</Text>
                        <View style={[styles.formPill, theme.formPill]}>
                          <Text style={[styles.formPillText, theme.formPillText]}>
                            {item.strength ? `${item.strength} ${item.unit || 'mg'}` : ''} • {formName}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.medFrequencyText, theme.medFrequencyText]}>
                        {item.totalDoses > 1 ? `Dose ${item.doseNumber} of ${item.totalDoses}` : 'Daily Dose'} • {item.doseQuantity} {formName.toLowerCase()}{parseInt(item.doseQuantity, 10) > 1 ? 's' : ''}
                      </Text>
                    </View>

                    {/* Quick Dose Take Checkbox */}
                    <TouchableOpacity
                      style={[
                        styles.takeCheckbox,
                        isTaken ? styles.takeCheckboxChecked : theme.takeCheckboxUnchecked
                      ]}
                      onPress={() => toggleTakeDose(item)}
                      activeOpacity={0.7}
                    >
                      {isTaken ? (
                        <HugeiconsIcon icon={Tick02Icon} size={14} color="#FFFFFF" strokeWidth={3} />
                      ) : (
                        <View style={styles.checkboxEmptyDot} />
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Inner Sub-Card for Time & Status */}
                  <View style={[styles.medSubCard, theme.medSubCard]}>
                    <View style={styles.medTimeGroup}>
                      <HugeiconsIcon icon={Clock01Icon} size={14} color={isDark ? '#A1A1AA' : '#6B7280'} />
                      <Text style={[styles.medTimeValue, theme.medTimeValue]}>{timeDisplay}</Text>
                    </View>

                    <View style={styles.medStatusPillRow}>
                      {isTaken ? (
                        <View style={[styles.statusBadge, styles.statusBadgeTaken]}>
                          <Text style={styles.statusBadgeTextTaken}>TAKEN</Text>
                        </View>
                      ) : (
                        <View style={[styles.statusBadge, isDark ? styles.statusBadgeUpcomingDark : styles.statusBadgeUpcomingLight]}>
                          <Text style={styles.statusBadgeTextUpcoming}>SCHEDULED</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Low Stock Warning if applicable */}
                  {isLowStock && (
                    <View style={styles.stockAlertRow}>
                      <HugeiconsIcon icon={AlertCircleIcon} size={14} color="#F59E0B" />
                      <Text style={styles.stockAlertText}>
                        Low Stock Alert: Only {stockQty} doses left. Refill recommended.
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* ── Care Circle Section ── */}
        <View style={[styles.circleCard, theme.circleCard]}>
          <View style={styles.circleHeaderRow}>
            <View style={styles.circleHeaderLeft}>
              <View style={[styles.circleIconCircle, theme.circleIconCircle]}>
                <HugeiconsIcon icon={UserGroupIcon} size={18} color="#3B82F6" />
              </View>
              <View>
                <Text style={[styles.circleTitle, theme.circleTitle]}>Care Network Oversight</Text>
                <Text style={[styles.circleSubtitle, theme.circleSubtitle]}>Sarah M. • 100% adherence this week</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.viewCircleBtn, theme.viewCircleBtn]}
              onPress={() => navigation.navigate('Connections')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewCircleBtnText}>View</Text>
            </TouchableOpacity>
          </View>

          {/* Connected Member Mini Pill */}
          <View style={[styles.circleDoseRow, theme.circleDoseRow]}>
            <View style={styles.circleDoseInfo}>
              <Text style={[styles.circleDoseName, theme.circleDoseName]}>Atorvastatin 20mg</Text>
              <Text style={[styles.circleDoseTime, theme.circleDoseTime]}>Scheduled for 09:00 PM tonight</Text>
            </View>
            <View style={[styles.statusBadge, styles.statusBadgeTaken]}>
              <Text style={styles.statusBadgeTextTaken}>CONFIRMED</Text>
            </View>
          </View>
        </View>

        {/* ── Bottom Quick Action Cards ── */}
        <View style={styles.actionGridRow}>
          {/* History Card */}
          <TouchableOpacity
            style={[styles.actionCard, theme.actionCard]}
            onPress={() => navigation.navigate('MedicationHistory')}
            activeOpacity={0.88}
          >
            <View style={[styles.actionIconBox, theme.historyIconBox]}>
              <HugeiconsIcon icon={Calendar01Icon} size={22} color="#3B82F6" />
            </View>
            <Text style={[styles.actionCardTitle, theme.actionCardTitle]}>History Log</Text>
            <Text style={[styles.actionCardSub, theme.actionCardSub]}>30-Day Trends</Text>
            <View style={styles.actionArrowRow}>
              <Text style={styles.actionArrowLabel}>OPEN</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="#3B82F6" />
            </View>
          </TouchableOpacity>

          {/* Refill Alerts Card */}
          <TouchableOpacity
            style={[styles.actionCard, theme.actionCard]}
            onPress={() => setIsAddModalVisible(true)}
            activeOpacity={0.88}
          >
            <View style={[styles.actionIconBox, theme.refillIconBox]}>
              <HugeiconsIcon icon={Notification03Icon} size={22} color="#F59E0B" />
            </View>
            <Text style={[styles.actionCardTitle, theme.actionCardTitle]}>Refill Alerts</Text>
            <Text style={[styles.actionCardSub, theme.actionCardSub]}>Stock Tracking</Text>
            <View style={styles.actionArrowRow}>
              <Text style={[styles.actionArrowLabel, styles.actionArrowLabelRefill]}>MANAGE</Text>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="#F59E0B" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.spacerBottom} />
      </ScrollView>

      {/* ── Add Medication Modal ── */}
      <AddMedication
        isVisible={isAddModalVisible}
        onClose={() => {
          setIsAddModalVisible(false);
          fetchMedications();
        }}
      />
    </SafeAreaView>
  );
};

export default Medication;

// ─── Base Styles ─────────────────────────────────────────────────────────────
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
  addPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addPillBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    marginBottom: 18,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  radialWrapper: {
    position: 'relative',
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialPercent: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  heroTextCol: {
    flex: 1,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#3B82F6',
  },
  heroMainHeading: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  heroSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  nextDoseBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  nextDoseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextDoseLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  nextDoseHighlight: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterSegmentContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyIconBox: {
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
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  medCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
  },
  medCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  medIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medCardInfo: {
    flex: 1,
  },
  medNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 3,
  },
  medNameText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  formPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  formPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  medFrequencyText: {
    fontSize: 12,
  },
  takeCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeCheckboxChecked: {
    backgroundColor: '#10B981',
  },
  checkboxEmptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  medSubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 12,
  },
  medTimeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medTimeValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  medStatusPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeTaken: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusBadgeTextTaken: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadgeUpcomingDark: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  statusBadgeUpcomingLight: {
    backgroundColor: '#EFF6FF',
  },
  statusBadgeTextUpcoming: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: '800',
  },
  stockAlertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(245, 158, 11, 0.2)',
  },
  stockAlertText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
    flex: 1,
  },
  circleCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  circleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  circleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  circleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  circleSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  viewCircleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  viewCircleBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  circleDoseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 12,
  },
  circleDoseInfo: {
    flex: 1,
  },
  circleDoseName: {
    fontSize: 13,
    fontWeight: '700',
  },
  circleDoseTime: {
    fontSize: 11,
    marginTop: 2,
  },
  actionGridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  actionCardSub: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 10,
  },
  actionArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionArrowLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B82F6',
  },
  actionArrowLabelRefill: {
    color: '#F59E0B',
  },
  spacerBottom: {
    height: 40,
  },
});

// ─── Dark Theme Styles ───────────────────────────────────────────────────────
const darkTheme = StyleSheet.create({
  safeArea: { backgroundColor: '#000000' },
  navBar: {
    backgroundColor: '#000000',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  navIconBtn: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  navTitle: { color: '#FFFFFF' },
  navSubtitle: { color: '#71717A' },
  addPillBtn: { backgroundColor: '#2563EB' },
  heroCard: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  radialPercent: { color: '#FFFFFF' },
  heroMainHeading: { color: '#FFFFFF' },
  heroSubText: { color: '#A1A1AA' },
  nextDoseBanner: {
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  nextDoseLabel: { color: '#A1A1AA' },
  nextDoseHighlight: { color: '#FFFFFF' },
  filterSegmentContainer: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterTabActive: { backgroundColor: '#1E1E28' },
  filterTabInactive: { backgroundColor: 'transparent' },
  filterTabTextActive: { color: '#FFFFFF' },
  filterTabTextInactive: { color: '#71717A' },
  sectionTitle: { color: '#FFFFFF' },
  countBadge: { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
  countBadgeText: { color: '#93C5FD' },
  loadingText: { color: '#A1A1AA' },
  emptyCard: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyIconBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  emptyTitle: { color: '#FFFFFF' },
  emptySub: { color: '#71717A' },
  medCard: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  medIconBox: { backgroundColor: '#1A1A24' },
  medNameText: { color: '#FFFFFF' },
  formPill: { backgroundColor: '#1E1E28' },
  formPillText: { color: '#A1A1AA' },
  medFrequencyText: { color: '#71717A' },
  takeCheckboxUnchecked: {
    backgroundColor: '#1E1E28',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  medSubCard: { backgroundColor: '#1A1A22' },
  medTimeValue: { color: '#FFFFFF' },
  circleCard: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  circleIconCircle: { backgroundColor: '#1A1A24' },
  circleTitle: { color: '#FFFFFF' },
  circleSubtitle: { color: '#A1A1AA' },
  viewCircleBtn: { backgroundColor: '#2563EB' },
  circleDoseRow: { backgroundColor: '#1A1A22' },
  circleDoseName: { color: '#FFFFFF' },
  circleDoseTime: { color: '#71717A' },
  actionCard: {
    backgroundColor: '#121217',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  historyIconBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  refillIconBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  actionCardTitle: { color: '#FFFFFF' },
  actionCardSub: { color: '#71717A' },
});

// ─── Light Theme Styles ──────────────────────────────────────────────────────
const lightTheme = StyleSheet.create({
  safeArea: { backgroundColor: '#F9FAFB' },
  navBar: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
  },
  navIconBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  navTitle: { color: '#111827' },
  navSubtitle: { color: '#6B7280' },
  addPillBtn: { backgroundColor: '#2563EB' },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  radialPercent: { color: '#111827' },
  heroMainHeading: { color: '#111827' },
  heroSubText: { color: '#4B5563' },
  nextDoseBanner: {
    borderTopColor: '#F3F4F6',
  },
  nextDoseLabel: { color: '#6B7280' },
  nextDoseHighlight: { color: '#111827' },
  filterSegmentContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  filterTabActive: { backgroundColor: '#F3F4F6' },
  filterTabInactive: { backgroundColor: 'transparent' },
  filterTabTextActive: { color: '#111827' },
  filterTabTextInactive: { color: '#6B7280' },
  sectionTitle: { color: '#111827' },
  countBadge: { backgroundColor: '#EFF6FF' },
  countBadgeText: { color: '#2563EB' },
  loadingText: { color: '#6B7280' },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyIconBox: {
    backgroundColor: '#EFF6FF',
  },
  emptyTitle: { color: '#111827' },
  emptySub: { color: '#6B7280' },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  medIconBox: { backgroundColor: '#EFF6FF' },
  medNameText: { color: '#111827' },
  formPill: { backgroundColor: '#F3F4F6' },
  formPillText: { color: '#4B5563' },
  medFrequencyText: { color: '#6B7280' },
  takeCheckboxUnchecked: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  medSubCard: { backgroundColor: '#F9FAFB' },
  medTimeValue: { color: '#111827' },
  circleCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  circleIconCircle: { backgroundColor: '#EFF6FF' },
  circleTitle: { color: '#111827' },
  circleSubtitle: { color: '#6B7280' },
  viewCircleBtn: { backgroundColor: '#2563EB' },
  circleDoseRow: { backgroundColor: '#F9FAFB' },
  circleDoseName: { color: '#111827' },
  circleDoseTime: { color: '#6B7280' },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  historyIconBox: {
    backgroundColor: '#EFF6FF',
  },
  refillIconBox: {
    backgroundColor: '#FEF3C7',
  },
  actionCardTitle: { color: '#111827' },
  actionCardSub: { color: '#6B7280' },
});
