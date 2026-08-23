import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Modal,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  ArrowLeft01Icon,
  RefreshIcon,
  AlertCircleIcon,
  Tick02Icon,
  Cancel01Icon,
  Notification03Icon,
  PillIcon,
  Medicine01Icon,
  MedicineBottle01Icon,
  InjectionIcon,
  CubeIcon,
  Add01Icon,
  Clock01Icon,
} from '@hugeicons/core-free-icons';
import Toast from 'react-native-toast-message';
import { medicationApi } from '../../api/medicationApi';
import { useThemeColors } from '../../components/ui/colors';

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

const RefillAlertScreen = () => {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [medications, setMedications] = useState([]);
  const [summary, setSummary] = useState({
    criticalCount: 0,
    lowStockCount: 0,
    healthyCount: 0,
    totalCount: 0,
    needsRefillCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'NEEDS_REFILL' | 'HEALTHY'

  // Refill Modal State
  const [selectedMed, setSelectedMed] = useState(null);
  const [refillModalVisible, setRefillModalVisible] = useState(false);
  const [addedQty, setAddedQty] = useState('30');
  const [thresholdVal, setThresholdVal] = useState('5');
  const [remindEnabled, setRemindEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Refill Alerts from API
  const fetchRefills = useCallback(async () => {
    try {
      setLoading(true);
      const res = await medicationApi.getRefillAlerts();
      if (res?.data?.success) {
        setMedications(res.data.medications || []);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
      }
    } catch (error) {
      console.error('Error fetching refill alerts:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not load refill alerts.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRefills();
  }, [fetchRefills]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRefills();
  };

  // Quick Refill action
  const handleQuickRefill = async (med, amountToAdd) => {
    try {
      // Optimistic update
      setMedications((prev) =>
        prev.map((m) => {
          if (m._id === med._id) {
            const nextQty = (m.quantity || 0) + amountToAdd;
            const nextDays = m.dailyDoses > 0 ? Math.floor(nextQty / m.dailyDoses) : nextQty;
            let nextStatus = 'HEALTHY';
            if (nextQty <= 0 || nextDays <= 2 || nextQty <= 2) nextStatus = 'CRITICAL';
            else if (nextQty <= (m.threshold || 5) || nextDays <= 7) nextStatus = 'LOW_STOCK';
            return {
              ...m,
              quantity: nextQty,
              daysRemaining: nextDays,
              stockStatus: nextStatus,
            };
          }
          return m;
        })
      );

      const res = await medicationApi.refillMedication({
        medication_id: med._id,
        added_quantity: amountToAdd,
      });

      if (res?.data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Refill Added',
          text2: `+${amountToAdd} added to ${med.medicine_name}`,
        });
        fetchRefills();
      }
    } catch (error) {
      console.error('Quick refill error:', error);
      Toast.show({
        type: 'error',
        text1: 'Refill Failed',
        text2: error?.response?.data?.message || 'Could not update stock.',
      });
      fetchRefills();
    }
  };

  // Open Detailed Refill Modal
  const openRefillModal = (med) => {
    setSelectedMed(med);
    setAddedQty('30');
    setThresholdVal(String(med.threshold || 5));
    setRemindEnabled(med.remind !== false);
    setRefillModalVisible(true);
  };

  // Submit Detailed Refill
  const handleSaveModalRefill = async () => {
    if (!selectedMed) return;
    const addCount = parseInt(addedQty, 10);
    const newThreshold = parseInt(thresholdVal, 10);

    if (isNaN(addCount) || addCount < 0) {
      Toast.show({
        type: 'info',
        text1: 'Invalid Quantity',
        text2: 'Please enter a valid number to add.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await medicationApi.refillMedication({
        medication_id: selectedMed._id,
        added_quantity: addCount,
        threshold: !isNaN(newThreshold) ? newThreshold : 5,
        remind: remindEnabled,
      });

      if (res?.data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Stock Updated',
          text2: `Successfully refilled ${selectedMed.medicine_name}`,
        });
        setRefillModalVisible(false);
        fetchRefills();
      }
    } catch (error) {
      console.error('Modal refill error:', error);
      Toast.show({
        type: 'error',
        text1: 'Refill Failed',
        text2: error?.response?.data?.message || 'Could not update stock.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered medication list
  const filteredMedications = useMemo(() => {
    if (activeFilter === 'NEEDS_REFILL') {
      return medications.filter((m) => m.stockStatus === 'CRITICAL' || m.stockStatus === 'LOW_STOCK');
    }
    if (activeFilter === 'HEALTHY') {
      return medications.filter((m) => m.stockStatus === 'HEALTHY');
    }
    return medications;
  }, [medications, activeFilter]);

  const getStatusBadgeProps = (status) => {
    switch (status) {
      case 'CRITICAL':
        return {
          bg: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
          text: '#EF4444',
          border: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA',
          label: 'CRITICAL',
        };
      case 'LOW_STOCK':
        return {
          bg: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB',
          text: '#F59E0B',
          border: isDark ? 'rgba(245, 158, 11, 0.3)' : '#FDE68A',
          label: 'LOW STOCK',
        };
      default:
        return {
          bg: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5',
          text: '#10B981',
          border: isDark ? 'rgba(16, 185, 129, 0.3)' : '#A7F3D0',
          label: 'HEALTHY',
        };
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

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
          <Text style={[styles.navTitle, { color: colors.textPrimary }]}>Refill Alerts</Text>
          <Text style={[styles.navSubtitle, { color: colors.textSecondary }]}>Stock & Supply Tracking</Text>
        </View>

        <TouchableOpacity
          style={[styles.navIconBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
          onPress={fetchRefills}
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
        }
      >
        {/* ── Hero Status Card ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.heroTopRow}>
            <View
              style={[
                styles.heroIconBadge,
                {
                  backgroundColor:
                    summary.needsRefillCount > 0
                      ? isDark
                        ? 'rgba(239, 68, 68, 0.15)'
                        : '#FEF2F2'
                      : isDark
                      ? 'rgba(16, 185, 129, 0.15)'
                      : '#ECFDF5',
                },
              ]}
            >
              <HugeiconsIcon
                icon={summary.needsRefillCount > 0 ? AlertCircleIcon : Tick02Icon}
                size={24}
                color={summary.needsRefillCount > 0 ? '#EF4444' : '#10B981'}
                strokeWidth={2.2}
              />
            </View>

            <View style={styles.heroTextCol}>
              <View style={styles.heroLiveBadgeRow}>
                <View
                  style={[
                    styles.liveDot,
                    { backgroundColor: summary.needsRefillCount > 0 ? '#EF4444' : '#10B981' },
                  ]}
                />
                <Text
                  style={[
                    styles.heroLiveText,
                    { color: summary.needsRefillCount > 0 ? '#EF4444' : '#10B981' },
                  ]}
                >
                  {summary.needsRefillCount > 0 ? 'REFILL REQUIRED' : 'STOCK HEALTHY'}
                </Text>
              </View>

              <Text style={[styles.heroMainTitle, { color: colors.textPrimary }]}>
                {summary.needsRefillCount > 0
                  ? `${summary.needsRefillCount} Prescriptions Low`
                  : 'All Prescriptions In Stock'}
              </Text>
              <Text style={[styles.heroSubText, { color: colors.textSecondary }]}>
                {summary.needsRefillCount > 0
                  ? 'Refill soon to avoid missed medication schedules.'
                  : 'You have plenty of supply for scheduled daily doses.'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Stats Metric Row ── */}
        <View style={styles.statsRow}>
          {/* Critical */}
          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeFilter === 'NEEDS_REFILL' && { borderColor: '#EF4444', borderWidth: 1.5 },
            ]}
            onPress={() => setActiveFilter(activeFilter === 'NEEDS_REFILL' ? 'ALL' : 'NEEDS_REFILL')}
            activeOpacity={0.8}
          >
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2' }]}>
                <HugeiconsIcon icon={AlertCircleIcon} size={14} color="#EF4444" strokeWidth={2.2} />
              </View>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>CRITICAL</Text>
            </View>
            <Text style={[styles.statValue, { color: '#EF4444' }]}>{summary.criticalCount}</Text>
          </TouchableOpacity>

          {/* Low Stock */}
          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeFilter === 'NEEDS_REFILL' && { borderColor: '#F59E0B', borderWidth: 1.5 },
            ]}
            onPress={() => setActiveFilter(activeFilter === 'NEEDS_REFILL' ? 'ALL' : 'NEEDS_REFILL')}
            activeOpacity={0.8}
          >
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB' }]}>
                <HugeiconsIcon icon={CubeIcon} size={14} color="#F59E0B" strokeWidth={2.2} />
              </View>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>LOW STOCK</Text>
            </View>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>{summary.lowStockCount}</Text>
          </TouchableOpacity>

          {/* Healthy */}
          <TouchableOpacity
            style={[
              styles.statCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeFilter === 'HEALTHY' && { borderColor: '#10B981', borderWidth: 1.5 },
            ]}
            onPress={() => setActiveFilter(activeFilter === 'HEALTHY' ? 'ALL' : 'HEALTHY')}
            activeOpacity={0.8}
          >
            <View style={styles.statHeaderRow}>
              <View style={[styles.statIconBadge, { backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ECFDF5' }]}>
                <HugeiconsIcon icon={Tick02Icon} size={14} color="#10B981" strokeWidth={2.2} />
              </View>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>HEALTHY</Text>
            </View>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{summary.healthyCount}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Filter Segment Bar ── */}
        <View style={styles.filterChipsContainer}>
          {[
            { key: 'ALL', label: 'All Medications', count: summary.totalCount },
            { key: 'NEEDS_REFILL', label: 'Needs Refill', count: summary.needsRefillCount },
            { key: 'HEALTHY', label: 'In Stock', count: summary.healthyCount },
          ].map((tab) => {
            const isSelected = activeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.filterPill,
                  isSelected
                    ? { backgroundColor: colors.textPrimary }
                    : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                ]}
                onPress={() => setActiveFilter(tab.key)}
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

        {/* ── Medications Stock List ── */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>PRESCRIPTION STOCK</Text>

          {loading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading stock details...</Text>
            </View>
          ) : filteredMedications.length > 0 ? (
            filteredMedications.map((med) => {
              const MedIcon = getIconForForm(med.forms);
              const badge = getStatusBadgeProps(med.stockStatus);
              const totalCapacity = Math.max(med.quantity || 30, (med.threshold || 5) * 4, 30);
              const progressPct = Math.min(100, Math.max(4, Math.round(((med.quantity || 0) / totalCapacity) * 100)));

              return (
                <View
                  key={med._id}
                  style={[
                    styles.stockCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    med.stockStatus === 'CRITICAL' && { borderColor: 'rgba(239, 68, 68, 0.4)' },
                  ]}
                >
                  {/* Card Header */}
                  <View style={styles.stockCardHeader}>
                    <View style={styles.stockCardHeaderLeft}>
                      <View style={[styles.formIconBox, { backgroundColor: colors.surfaceAlt }]}>
                        <HugeiconsIcon icon={MedIcon} size={18} color={colors.primary} />
                      </View>
                      <View style={styles.medTitleCol}>
                        <Text style={[styles.medNameText, { color: colors.textPrimary }]} numberOfLines={1}>
                          {med.medicine_name}
                        </Text>
                        <Text style={[styles.medStrengthText, { color: colors.textSecondary }]}>
                          {(med.strength && med.unit) ? `${med.strength} ${med.unit}` : 'Standard Dose'} • {med.frequencyText}
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.text }]}>{badge.label}</Text>
                    </View>
                  </View>

                  {/* Stock Quantity and Days Remaining Row */}
                  <View style={styles.stockDetailsRow}>
                    <View style={styles.stockMetricCol}>
                      <Text style={[styles.stockMetricVal, { color: colors.textPrimary }]}>
                        {med.quantity} <Text style={[styles.stockMetricUnit, { color: colors.textMuted }]}>{med.forms || 'units'}</Text>
                      </Text>
                      <Text style={[styles.stockMetricLabel, { color: colors.textMuted }]}>
                        Alert threshold: {med.threshold || 5}
                      </Text>
                    </View>

                    <View style={[styles.daysSupplyBadge, { backgroundColor: colors.surfaceAlt }]}>
                      <HugeiconsIcon icon={Clock01Icon} size={13} color={colors.textSecondary} />
                      <Text style={[styles.daysSupplyText, { color: colors.textPrimary }]}>
                        {med.daysRemaining <= 0
                          ? 'Out of Stock'
                          : `~${med.daysRemaining} days supply`}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Gauge Bar */}
                  <View style={[styles.gaugeTrack, { backgroundColor: colors.surfaceAlt }]}>
                    <View
                      style={[
                        styles.gaugeFill,
                        {
                          width: `${progressPct}%`,
                          backgroundColor:
                            med.stockStatus === 'CRITICAL'
                              ? '#EF4444'
                              : med.stockStatus === 'LOW_STOCK'
                              ? '#F59E0B'
                              : '#10B981',
                        },
                      ]}
                    />
                  </View>

                  {/* Quick Refill Buttons & Manage Options */}
                  <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
                    <Text style={[styles.quickRefillLabel, { color: colors.textMuted }]}>Quick Refill:</Text>
                    <View style={styles.presetButtonsRow}>
                      {[15, 30, 60].map((count) => (
                        <TouchableOpacity
                          key={count}
                          style={[styles.presetBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
                          onPress={() => handleQuickRefill(med, count)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.presetBtnText, { color: colors.textPrimary }]}>+{count}</Text>
                        </TouchableOpacity>
                      ))}

                      <TouchableOpacity
                        style={[styles.customRefillBtn, { backgroundColor: colors.primary }]}
                        onPress={() => openRefillModal(med)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.customRefillBtnText}>Custom...</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceAlt }]}>
                <HugeiconsIcon icon={CubeIcon} size={30} color={colors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Stock Alerts</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                {activeFilter === 'NEEDS_REFILL'
                  ? 'All medications currently have sufficient stock.'
                  : 'No medication prescriptions found in your account.'}
              </Text>
              <TouchableOpacity
                style={[styles.emptyActionBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('Medication')}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyActionBtnText}>View Medication Schedule</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ── Refill & Stock Setting Modal ── */}
      <Modal
        visible={refillModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setRefillModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalBackdrop}
        >
          <TouchableOpacity
            style={styles.modalDismissOverlay}
            activeOpacity={1}
            onPress={() => setRefillModalVisible(false)}
          />

          <View style={[styles.modalSheet, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                  Refill {selectedMed?.medicine_name}
                </Text>
                <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                  Current stock: {selectedMed?.quantity || 0} {selectedMed?.forms || 'units'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setRefillModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceAlt }]}
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Quantity Input with Presets */}
            <View style={styles.modalFieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Quantity to Add</Text>
              <View style={styles.modalPresetRow}>
                {['15', '30', '60', '90'].map((val) => (
                  <TouchableOpacity
                    key={val}
                    style={[
                      styles.modalPresetPill,
                      addedQty === val
                        ? { backgroundColor: colors.primary, borderColor: colors.primary }
                        : { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
                    ]}
                    onPress={() => setAddedQty(val)}
                  >
                    <Text
                      style={[
                        styles.modalPresetText,
                        { color: addedQty === val ? '#FFFFFF' : colors.textPrimary },
                      ]}
                    >
                      +{val}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: colors.surfaceAlt,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                keyboardType="number-pad"
                value={addedQty}
                onChangeText={setAddedQty}
                placeholder="Enter custom count..."
                placeholderTextColor={colors.placeholder}
              />
            </View>

            {/* Threshold Alert Settings */}
            <View style={styles.modalFieldGroup}>
              <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Low Stock Alert Threshold</Text>
              <Text style={[styles.fieldHint, { color: colors.textSecondary }]}>
                Send notification when pills drop below this count
              </Text>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    backgroundColor: colors.surfaceAlt,
                    color: colors.textPrimary,
                    borderColor: colors.border,
                  },
                ]}
                keyboardType="number-pad"
                value={thresholdVal}
                onChangeText={setThresholdVal}
                placeholder="e.g. 5"
                placeholderTextColor={colors.placeholder}
              />
            </View>

            {/* Notification Toggle */}
            <View style={[styles.modalToggleRow, { borderTopColor: colors.border }]}>
              <View style={styles.toggleTextCol}>
                <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>Refill Reminders</Text>
                <Text style={[styles.toggleSub, { color: colors.textSecondary }]}>
                  Push alert when stock drops to threshold
                </Text>
              </View>
              <Switch
                value={remindEnabled}
                onValueChange={setRemindEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.modalSubmitBtn, { backgroundColor: colors.primary }]}
              onPress={handleSaveModalRefill}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.modalSubmitBtnText}>Confirm Refill (+{addedQty || 0})</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextCol: {
    flex: 1,
  },
  heroLiveBadgeRow: {
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
  heroLiveText: {
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
  heroSubText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
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

  // List Section
  listSection: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  loadingWrapper: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Stock Card
  stockCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  stockCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  stockCardHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: 10,
  },
  formIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medTitleCol: {
    flex: 1,
  },
  medNameText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  medStrengthText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Stock Details Row
  stockDetailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stockMetricCol: {
    gap: 2,
  },
  stockMetricVal: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  stockMetricUnit: {
    fontSize: 13,
    fontWeight: '600',
  },
  stockMetricLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  daysSupplyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  daysSupplyText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Gauge
  gaugeTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Action Row
  actionRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickRefillLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  customRefillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  customRefillBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Empty State
  emptyCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
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

  // Modal
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalDismissOverlay: {
    flex: 1,
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
  },
  modalPresetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  modalPresetPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPresetText: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalInput: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
  },
  modalToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    marginBottom: 24,
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggleSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  modalSubmitBtn: {
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});

export default RefillAlertScreen;
