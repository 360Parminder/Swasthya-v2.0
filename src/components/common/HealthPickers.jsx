import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { 
  Calendar01Icon, 
  WeightScale01Icon, 
  RulerIcon, 
  Tick02Icon
} from '@hugeicons/core-free-icons';
import { playTickSound } from '../../services/soundService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TICK_WIDTH = 14;
const RULER_PADDING = (SCREEN_WIDTH - 72) / 2;

/**
 * Modern Expandable Horizontal Ruler Picker with 2-Tone Nested Card Design
 */
export const RulerPickerCard = ({
  title = 'Weight',
  icon = WeightScale01Icon,
  unit = 'kg',
  min = 30,
  max = 200,
  value = 70,
  onChange,
  units = ['kg', 'lbs'],
  onUnitChange,
  selectedUnit = 'kg',
  defaultExpanded = false
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const flatListRef = useRef(null);
  const isScrolling = useRef(false);
  const [currentVal, setCurrentVal] = useState(value || min);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  // Generate ticks
  const ticks = useMemo(() => {
    const arr = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }
    return arr;
  }, [min, max]);

  useEffect(() => {
    if (value !== undefined && value !== currentVal) {
      setCurrentVal(value);
      const index = value - min;
      if (index >= 0 && index < ticks.length && flatListRef.current && !isScrolling.current && expanded) {
        try {
          flatListRef.current.scrollToOffset({
            offset: index * TICK_WIDTH,
            animated: false
          });
        } catch (e) {
          // ignore layout race
        }
      }
    }
  }, [value, min, ticks.length, currentVal, expanded]);

  const handleScroll = useCallback((event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    let index = Math.round(offsetX / TICK_WIDTH);
    index = Math.max(0, Math.min(index, ticks.length - 1));
    const newVal = ticks[index];
    if (newVal !== undefined && newVal !== currentVal) {
      setCurrentVal(newVal);
      playTickSound();
      if (onChange) {
        onChange(newVal);
      }
    }
  }, [ticks, currentVal, onChange]);

  const adjustValue = (delta) => {
    const nextVal = Math.max(min, Math.min(max, currentVal + delta));
    if (nextVal !== currentVal) {
      setCurrentVal(nextVal);
      playTickSound();
      if (onChange) onChange(nextVal);
      const index = nextVal - min;
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: index * TICK_WIDTH,
          animated: true
        });
      }
    }
  };

  const renderTick = useCallback(({ item }) => {
    const isMajor = item % 10 === 0;
    const isMid = item % 5 === 0 && !isMajor;

    return (
      <View style={styles.tickContainer}>
        <View
          style={[
            styles.tick,
            isMajor ? styles.tickMajor : isMid ? styles.tickMid : styles.tickMinor
          ]}
        />
        {isMajor && (
          <Text style={styles.tickLabel}>{item}</Text>
        )}
      </View>
    );
  }, []);

  return (
    <View style={[styles.outerCard, expanded && styles.outerCardExpanded]}>
      {/* Top Header Row in Outer Card Shade */}
      <TouchableOpacity 
        style={styles.cardHeader} 
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <HugeiconsIcon 
            icon={icon || (title.toLowerCase().includes('height') ? RulerIcon : WeightScale01Icon)} 
            size={20} 
            color="#A1A1AA" 
          />
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <Text style={styles.headerValue}>
          {currentVal} {selectedUnit || unit}
        </Text>
      </TouchableOpacity>

      {/* Inner Nested Sub-Card in Deeper Dark Shade */}
      {expanded && (
        <View style={styles.innerSubCard}>
          {/* Unit Switcher Chips with Active Dot */}
          {units && units.length > 1 && (
            <View style={styles.unitRow}>
              {units.map((u) => {
                const isSelected = selectedUnit === u;
                return (
                  <TouchableOpacity
                    key={u}
                    onPress={() => onUnitChange && onUnitChange(u)}
                    style={[
                      styles.twoToneChip,
                      isSelected ? styles.twoToneChipSelected : styles.twoToneChipUnselected
                    ]}
                    activeOpacity={0.8}
                  >
                    {isSelected && (
                      <View style={styles.activeDot}>
                        <HugeiconsIcon icon={Tick02Icon} size={10} color="#FFFFFF" />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.twoToneChipText,
                        isSelected ? styles.twoToneChipTextSelected : styles.twoToneChipTextUnselected
                      ]}
                    >
                      {u === 'kg' ? 'Kilograms (kg)' : u === 'lbs' ? 'Pounds (lbs)' : u === 'cm' ? 'Centimeters (cm)' : 'Feet & Inches'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Dotted Divider */}
          <View style={styles.dashedDivider} />

          {/* Large Value Display */}
          <View style={styles.valueRow}>
            <TouchableOpacity 
              style={styles.stepButton} 
              onPress={() => adjustValue(-1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepButtonText}>−</Text>
            </TouchableOpacity>

            <View style={styles.numberWrapper}>
              <Text style={styles.largeValueText}>{currentVal}</Text>
              <Text style={styles.largeValueUnit}>{selectedUnit || unit}</Text>
            </View>

            <TouchableOpacity 
              style={styles.stepButton} 
              onPress={() => adjustValue(1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Ruler View */}
          <View style={styles.rulerTrackWrapper}>
            {/* Center Blue Needle Pointer */}
            <View style={styles.centerNeedle} pointerEvents="none" />

            <FlatList
              ref={flatListRef}
              data={ticks}
              keyExtractor={(item) => String(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={TICK_WIDTH}
              decelerationRate="fast"
              bounces={false}
              contentContainerStyle={{
                paddingHorizontal: RULER_PADDING
              }}
              getItemLayout={(_, index) => ({
                length: TICK_WIDTH,
                offset: TICK_WIDTH * index,
                index
              })}
              onScrollBeginDrag={() => { isScrolling.current = true; }}
              onScrollEndDrag={() => { isScrolling.current = false; }}
              onMomentumScrollEnd={() => { isScrolling.current = false; }}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              initialScrollIndex={Math.max(0, (value || min) - min)}
              renderItem={renderTick}
            />
          </View>

          {/* Range Min/Max Footers */}
          <View style={styles.rangeFooter}>
            <Text style={styles.rangeText}>{min} {selectedUnit || unit}</Text>
            <Text style={styles.rangeText}>{max} {selectedUnit || unit}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ITEM_HEIGHT = 42;

/**
 * Modern Expandable Date of Birth Card with 2-Tone Nested Card Design
 */
export const DateWheelPickerCard = ({
  value = '2000-01-15',
  onChange,
  title = 'Date of Birth',
  defaultExpanded = false
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const initialDate = useMemo(() => {
    const parts = (value || '2000-01-15').split('-');
    return {
      year: parseInt(parts[0], 10) || 2000,
      month: parseInt(parts[1], 10) ? parseInt(parts[1], 10) - 1 : 0,
      day: parseInt(parts[2], 10) || 15
    };
  }, [value]);

  const [selectedDay, setSelectedDay] = useState(initialDate.day);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.month);
  const [selectedYear, setSelectedYear] = useState(initialDate.year);

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 85 }, (_, i) => currentYear - 84 + i);
  }, []);

  const dayListRef = useRef(null);
  const monthListRef = useRef(null);
  const yearListRef = useRef(null);

  // Sync formatted date to parent
  useEffect(() => {
    const m = String(selectedMonth + 1).padStart(2, '0');
    const d = String(selectedDay).padStart(2, '0');
    const formatted = `${selectedYear}-${m}-${d}`;
    if (onChange) {
      onChange(formatted);
    }
  }, [selectedDay, selectedMonth, selectedYear, onChange]);

  const formattedDisplay = useMemo(() => {
    return `${selectedDay} ${MONTHS[selectedMonth]} ${selectedYear}`;
  }, [selectedDay, selectedMonth, selectedYear]);

  const handleDayScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (days[idx] && days[idx] !== selectedDay) {
      setSelectedDay(days[idx]);
      playTickSound();
    }
  };

  const handleMonthScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (idx >= 0 && idx < 12 && idx !== selectedMonth) {
      setSelectedMonth(idx);
      playTickSound();
    }
  };

  const handleYearScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (years[idx] && years[idx] !== selectedYear) {
      setSelectedYear(years[idx]);
      playTickSound();
    }
  };

  return (
    <View style={[styles.outerCard, expanded && styles.outerCardExpanded]}>
      {/* Top Header Row in Outer Card Shade */}
      <TouchableOpacity 
        style={styles.cardHeader} 
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <HugeiconsIcon icon={Calendar01Icon} size={20} color="#A1A1AA" />
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        <Text style={styles.headerValue}>{formattedDisplay}</Text>
      </TouchableOpacity>

      {/* Inner Nested Sub-Card in Deeper Dark Shade */}
      {expanded && (
        <View style={styles.innerSubCard}>
          {/* 3-Column Wheels Header Labels */}
          <View style={styles.wheelHeaderRow}>
            <Text style={styles.wheelColHeader}>DAY</Text>
            <Text style={styles.wheelColHeader}>MONTH</Text>
            <Text style={styles.wheelColHeader}>YEAR</Text>
          </View>

          {/* 3-Column Drum Wheels Container */}
          <View style={styles.wheelColumnsContainerFull}>
            {/* Center Active Highlight Band */}
            <View style={styles.activeSelectionBand} pointerEvents="none" />

            {/* Day Column */}
            <View style={styles.wheelColumn}>
              <FlatList
                ref={dayListRef}
                data={days}
                keyExtractor={(item) => `day-${item}`}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index
                })}
                initialScrollIndex={Math.max(0, selectedDay - 1)}
                onMomentumScrollEnd={handleDayScroll}
                renderItem={({ item }) => {
                  const isSelected = item === selectedDay;
                  return (
                    <View style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected ? styles.wheelItemTextActive : styles.wheelItemTextInactive
                        ]}
                      >
                        {String(item).padStart(2, '0')}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>

            {/* Month Column */}
            <View style={styles.wheelColumn}>
              <FlatList
                ref={monthListRef}
                data={MONTHS}
                keyExtractor={(item) => `month-${item}`}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index
                })}
                initialScrollIndex={selectedMonth}
                onMomentumScrollEnd={handleMonthScroll}
                renderItem={({ item, index }) => {
                  const isSelected = index === selectedMonth;
                  return (
                    <View style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected ? styles.wheelItemTextActive : styles.wheelItemTextInactive
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>

            {/* Year Column */}
            <View style={styles.wheelColumn}>
              <FlatList
                ref={yearListRef}
                data={years}
                keyExtractor={(item) => `year-${item}`}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                getItemLayout={(_, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index
                })}
                initialScrollIndex={Math.max(0, years.indexOf(selectedYear))}
                onMomentumScrollEnd={handleYearScroll}
                renderItem={({ item }) => {
                  const isSelected = item === selectedYear;
                  return (
                    <View style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected ? styles.wheelItemTextActive : styles.wheelItemTextInactive
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Outer Card — Shade 1 (Lighter Charcoal Background)
  outerCard: {
    backgroundColor: '#1D1D21',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  outerCardExpanded: {
    backgroundColor: '#1D1D21',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  // Top Header Pill
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 58,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#D4D4D8',
    fontSize: 16,
    fontWeight: '600',
  },
  headerValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Inner Sub-Card — Shade 2 (Deeper Dark Background matching the screenshot)
  innerSubCard: {
    backgroundColor: '#121215',
    borderRadius: 18,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  // 2-Tone Selection Chips
  unitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  twoToneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  twoToneChipSelected: {
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  twoToneChipUnselected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  twoToneChipText: {
    fontSize: 13,
  },
  twoToneChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  twoToneChipTextUnselected: {
    color: '#71717A',
    fontWeight: '600',
  },
  // Dotted / Dashed Divider Line
  dashedDivider: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    borderStyle: 'dashed',
    marginBottom: 14,
  },
  // Large Value Display
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 8,
  },
  numberWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  largeValueText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  largeValueUnit: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 18,
    fontWeight: '600',
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1B1B22',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  // Ruler Scale
  rulerTrackWrapper: {
    height: 64,
    marginTop: 6,
    justifyContent: 'center',
    position: 'relative',
  },
  centerNeedle: {
    position: 'absolute',
    left: '50%',
    top: 2,
    width: 3,
    height: 36,
    backgroundColor: '#2563EB',
    borderRadius: 2,
    zIndex: 10,
    transform: [{ translateX: -1.5 }],
    shadowColor: '#2563EB',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  tickContainer: {
    width: TICK_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 56,
  },
  tick: {
    width: 1.5,
    borderRadius: 1,
  },
  tickMajor: {
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  tickMid: {
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  tickMinor: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  tickLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  rangeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingHorizontal: 4,
  },
  rangeText: {
    color: '#52525B',
    fontSize: 11,
    fontWeight: '600',
  },
  // Full-Width Wheel Column Container & Headers
  wheelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    marginBottom: 4,
  },
  wheelColHeader: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  wheelColumnsContainerFull: {
    flexDirection: 'row',
    height: ITEM_HEIGHT * 3,
    position: 'relative',
  },
  activeSelectionBand: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  wheelColumn: {
    flex: 1,
    height: ITEM_HEIGHT * 3,
  },
  wheelListContent: {
    paddingVertical: ITEM_HEIGHT,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelItemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  wheelItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 17,
  },
  wheelItemTextInactive: {
    color: 'rgba(255, 255, 255, 0.28)',
  },
});
