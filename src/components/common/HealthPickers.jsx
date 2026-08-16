import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  useColorScheme
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { 
  Calendar01Icon, 
  WeightScale01Icon, 
  RulerIcon, 
  Tick02Icon,
  Clock01Icon,
  PillsTabletIcon,
  Add01Icon
} from '@hugeicons/core-free-icons';
import { playTickSound } from '../../services/soundService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const TICK_WIDTH = 14;
const RULER_PADDING = (SCREEN_WIDTH - 72) / 2;

/**
 * Modern Expandable Horizontal Ruler Picker with 2-Tone Light/Dark Theme Support
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
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkStyles : lightStyles;

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
            isMajor 
              ? (isDark ? styles.tickMajorDark : styles.tickMajorLight) 
              : isMid 
                ? (isDark ? styles.tickMidDark : styles.tickMidLight) 
                : (isDark ? styles.tickMinorDark : styles.tickMinorLight)
          ]}
        />
        {isMajor && (
          <Text style={[styles.tickLabel, theme.tickLabel]}>{item}</Text>
        )}
      </View>
    );
  }, [isDark, theme.tickLabel]);

  return (
    <View style={[styles.outerCard, theme.outerCard, expanded && theme.outerCardExpanded]}>
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
            color={isDark ? '#A1A1AA' : '#6B7280'} 
          />
          <Text style={[styles.headerTitle, theme.headerTitle]}>{title}</Text>
        </View>

        <Text style={[styles.headerValue, theme.headerValue]}>
          {currentVal} {selectedUnit || unit}
        </Text>
      </TouchableOpacity>

      {/* Inner Nested Sub-Card in Deeper Dark / Softer Light Shade */}
      {expanded && (
        <View style={[styles.innerSubCard, theme.innerSubCard]}>
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
                      theme.twoToneChip,
                      isSelected ? theme.twoToneChipSelected : theme.twoToneChipUnselected
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
                        isSelected ? theme.twoToneChipTextSelected : theme.twoToneChipTextUnselected
                      ]}
                    >
                      {u === 'kg' ? 'Kilograms (kg)' : u === 'lbs' ? 'Pounds (lbs)' : u === 'cm' ? 'Centimeters (cm)' : u === 'ft' ? 'Feet & Inches' : u}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Dotted Divider */}
          <View style={[styles.dashedDivider, theme.dashedDivider]} />

          {/* Large Value Display */}
          <View style={styles.valueRow}>
            <TouchableOpacity 
              style={[styles.stepButton, theme.stepButton]} 
              onPress={() => adjustValue(-1)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepButtonText, theme.stepButtonText]}>−</Text>
            </TouchableOpacity>

            <View style={styles.numberWrapper}>
              <Text style={[styles.largeValueText, theme.largeValueText]}>{currentVal}</Text>
              <Text style={[styles.largeValueUnit, theme.largeValueUnit]}>{selectedUnit || unit}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.stepButton, theme.stepButton]} 
              onPress={() => adjustValue(1)}
              activeOpacity={0.7}
            >
              <Text style={[styles.stepButtonText, theme.stepButtonText]}>+</Text>
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
            <Text style={[styles.rangeText, theme.rangeText]}>{min} {selectedUnit || unit}</Text>
            <Text style={[styles.rangeText, theme.rangeText]}>{max} {selectedUnit || unit}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ITEM_HEIGHT = 42;

/**
 * Modern Expandable Date of Birth Card with 2-Tone Light/Dark Theme Support
 */
export const DateWheelPickerCard = ({
  value = '2000-01-15',
  onChange,
  title = 'Date of Birth',
  defaultExpanded = false
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkStyles : lightStyles;

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

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const isMountedRef = useRef(false);

  // Sync formatted date to parent only on actual user change
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    const m = String(selectedMonth + 1).padStart(2, '0');
    const d = String(selectedDay).padStart(2, '0');
    const formatted = `${selectedYear}-${m}-${d}`;
    if (onChangeRef.current) {
      onChangeRef.current(formatted);
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  const formattedDisplay = useMemo(() => {
    return `${selectedDay} ${MONTHS[selectedMonth]} ${selectedYear}`;
  }, [selectedDay, selectedMonth, selectedYear]);

  // Scroll to initial index on expand
  useEffect(() => {
    if (expanded) {
      const timer = setTimeout(() => {
        if (dayListRef.current) dayListRef.current.scrollTo({ y: Math.max(0, (selectedDay - 1) * ITEM_HEIGHT), animated: false });
        if (monthListRef.current) monthListRef.current.scrollTo({ y: Math.max(0, selectedMonth * ITEM_HEIGHT), animated: false });
        if (yearListRef.current) {
          const yIdx = years.indexOf(selectedYear);
          yearListRef.current.scrollTo({ y: Math.max(0, yIdx * ITEM_HEIGHT), animated: false });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [expanded, selectedDay, selectedMonth, selectedYear, years]);

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
    <View style={[styles.outerCard, theme.outerCard, expanded && theme.outerCardExpanded]}>
      {/* Top Header Row in Outer Card Shade */}
      <TouchableOpacity 
        style={styles.cardHeader} 
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <HugeiconsIcon icon={Calendar01Icon} size={20} color={isDark ? '#A1A1AA' : '#6B7280'} />
          <Text style={[styles.headerTitle, theme.headerTitle]}>{title}</Text>
        </View>

        <Text style={[styles.headerValue, theme.headerValue]}>{formattedDisplay}</Text>
      </TouchableOpacity>

      {/* Inner Nested Sub-Card in Deeper Dark / Softer Light Shade */}
      {expanded && (
        <View style={[styles.innerSubCard, theme.innerSubCard]}>
          {/* 3-Column Wheels Header Labels */}
          <View style={styles.wheelHeaderRow}>
            <Text style={[styles.wheelColHeader, theme.wheelColHeader]}>DAY</Text>
            <Text style={[styles.wheelColHeader, theme.wheelColHeader]}>MONTH</Text>
            <Text style={[styles.wheelColHeader, theme.wheelColHeader]}>YEAR</Text>
          </View>

          {/* 3-Column Drum Wheels Container */}
          <View style={styles.wheelColumnsContainerFull}>
            {/* Center Active Highlight Band */}
            <View style={[styles.activeSelectionBand, theme.activeSelectionBand]} pointerEvents="none" />

            {/* Day Column */}
            <View style={styles.wheelColumn}>
              <ScrollView
                ref={dayListRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                onMomentumScrollEnd={handleDayScroll}
              >
                {days.map((item) => {
                  const isSelected = item === selectedDay;
                  return (
                    <View key={`day-${item}`} style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected ? theme.wheelItemTextActive : theme.wheelItemTextInactive
                        ]}
                      >
                        {String(item).padStart(2, '0')}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* Month Column */}
            <View style={styles.wheelColumn}>
              <ScrollView
                ref={monthListRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                onMomentumScrollEnd={handleMonthScroll}
              >
                {MONTHS.map((item, index) => {
                  const isSelected = index === selectedMonth;
                  return (
                    <View key={`month-${item}`} style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected ? theme.wheelItemTextActive : theme.wheelItemTextInactive
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* Year Column */}
            <View style={styles.wheelColumn}>
              <ScrollView
                ref={yearListRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                onMomentumScrollEnd={handleYearScroll}
              >
                {years.map((item) => {
                  const isSelected = item === selectedYear;
                  return (
                    <View key={`year-${item}`} style={styles.wheelItem}>
                      <Text
                        style={[
                          styles.wheelItemText,
                          isSelected ? theme.wheelItemTextActive : theme.wheelItemTextInactive
                        ]}
                      >
                        {item}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * Modern Expandable Time Wheel Picker Card with 2-Tone Light/Dark Theme Support
 */
export const TimeWheelPickerCard = ({
  value = new Date(),
  onChange,
  title = 'Scheduled Time',
  defaultExpanded = false
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkStyles : lightStyles;

  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const initialTime = useMemo(() => {
    let d = new Date();
    if (value instanceof Date) {
      d = value;
    } else if (typeof value === 'string') {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        d = parsed;
      }
    }
    const h24 = d.getHours();
    const period = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    const m = d.getMinutes();
    return { hour: h12, minute: m, period };
  }, [value]);

  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialTime.period);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const periods = useMemo(() => ['AM', 'PM'], []);

  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);
  const periodListRef = useRef(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const isMountedRef = useRef(false);

  // Sync formatted time to parent only on actual user change
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    let h24 = selectedHour % 12;
    if (selectedPeriod === 'PM') h24 += 12;
    const normalized = new Date(2000, 0, 1, h24, selectedMinute, 0, 0).toISOString();
    if (onChangeRef.current) {
      onChangeRef.current(normalized, { hour: selectedHour, minute: selectedMinute, period: selectedPeriod });
    }
  }, [selectedHour, selectedMinute, selectedPeriod]);

  // Scroll to initial index on expand
  useEffect(() => {
    if (expanded) {
      const timer = setTimeout(() => {
        if (hourListRef.current) hourListRef.current.scrollTo({ y: Math.max(0, (selectedHour - 1) * ITEM_HEIGHT), animated: false });
        if (minuteListRef.current) minuteListRef.current.scrollTo({ y: Math.max(0, selectedMinute * ITEM_HEIGHT), animated: false });
        if (periodListRef.current) {
          const pIdx = periods.indexOf(selectedPeriod);
          periodListRef.current.scrollTo({ y: Math.max(0, pIdx * ITEM_HEIGHT), animated: false });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [expanded, selectedHour, selectedMinute, selectedPeriod, periods]);

  const formattedDisplay = useMemo(() => {
    const hStr = String(selectedHour).padStart(2, '0');
    const mStr = String(selectedMinute).padStart(2, '0');
    return `${hStr}:${mStr} ${selectedPeriod}`;
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const handleHourScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (hours[idx] && hours[idx] !== selectedHour) {
      setSelectedHour(hours[idx]);
      playTickSound();
    }
  };

  const handleMinuteScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (minutes[idx] !== undefined && minutes[idx] !== selectedMinute) {
      setSelectedMinute(minutes[idx]);
      playTickSound();
    }
  };

  const handlePeriodScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (periods[idx] && periods[idx] !== selectedPeriod) {
      setSelectedPeriod(periods[idx]);
      playTickSound();
    }
  };

  return (
    <View style={[styles.outerCard, theme.outerCard, expanded && theme.outerCardExpanded]}>
      <TouchableOpacity 
        style={styles.cardHeader} 
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <HugeiconsIcon icon={Clock01Icon} size={20} color={isDark ? '#A1A1AA' : '#6B7280'} />
          <Text style={[styles.headerTitle, theme.headerTitle]}>{title}</Text>
        </View>

        <Text style={[styles.headerValue, theme.headerValue]}>{formattedDisplay}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.innerSubCard, theme.innerSubCard]}>
          <View style={styles.wheelHeaderRow}>
            <Text style={[styles.wheelColHeader, theme.wheelColHeader]}>HOUR</Text>
            <Text style={[styles.wheelColHeader, theme.wheelColHeader]}>MINUTE</Text>
            <Text style={[styles.wheelColHeader, theme.wheelColHeader]}>PERIOD</Text>
          </View>

          <View style={styles.wheelColumnsContainerFull}>
            <View style={[styles.activeSelectionBand, theme.activeSelectionBand]} pointerEvents="none" />

            {/* Hour Column */}
            <View style={styles.wheelColumn}>
              <ScrollView
                ref={hourListRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                onMomentumScrollEnd={handleHourScroll}
              >
                {hours.map((item) => (
                  <View key={`hour-${item}`} style={styles.wheelItem}>
                    <Text style={[styles.wheelItemText, item === selectedHour ? theme.wheelItemTextActive : theme.wheelItemTextInactive]}>
                      {String(item).padStart(2, '0')}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Minute Column */}
            <View style={styles.wheelColumn}>
              <ScrollView
                ref={minuteListRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                onMomentumScrollEnd={handleMinuteScroll}
              >
                {minutes.map((item) => (
                  <View key={`min-${item}`} style={styles.wheelItem}>
                    <Text style={[styles.wheelItemText, item === selectedMinute ? theme.wheelItemTextActive : theme.wheelItemTextInactive]}>
                      {String(item).padStart(2, '0')}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Period Column */}
            <View style={styles.wheelColumn}>
              <ScrollView
                ref={periodListRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={styles.wheelListContent}
                onMomentumScrollEnd={handlePeriodScroll}
              >
                {periods.map((item) => (
                  <View key={`period-${item}`} style={styles.wheelItem}>
                    <Text style={[styles.wheelItemText, item === selectedPeriod ? theme.wheelItemTextActive : theme.wheelItemTextInactive]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const ARC_ITEM_HEIGHT = 44;
const ARC_CONTAINER_HEIGHT = 220;
const ARC_PADDING = (ARC_CONTAINER_HEIGHT - ARC_ITEM_HEIGHT) / 2;

/**
 * Modern Expandable Single-Sided Semicircle Arc Wheel Option Picker Card
 */
export const CircularOptionPickerCard = ({
  title = 'Medication Form',
  icon = PillsTabletIcon,
  options = ['Tablet', 'Capsule', 'Liquid', 'Injection', 'Inhaler', 'Topical', 'Drops', 'Syrup', 'Spray'],
  value = 'Tablet',
  onChange,
  defaultExpanded = false
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkStyles : lightStyles;

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [selectedItem, setSelectedItem] = useState(value || options[0]);
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const isMountedRef = useRef(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (value && value !== selectedItem) {
      setSelectedItem(value);
    }
  }, [value, selectedItem]);

  // Initial scroll when expanded
  useEffect(() => {
    if (expanded && scrollRef.current) {
      const idx = options.indexOf(selectedItem);
      if (idx >= 0) {
        const timer = setTimeout(() => {
          scrollRef.current?.scrollTo({ y: idx * ARC_ITEM_HEIGHT, animated: false });
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [expanded, selectedItem, options]);

  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    setScrollY(y);
    const idx = Math.round(y / ARC_ITEM_HEIGHT);
    if (options[idx] && options[idx] !== selectedItem) {
      setSelectedItem(options[idx]);
      playTickSound();
      if (isMountedRef.current && onChangeRef.current) {
        onChangeRef.current(options[idx]);
      }
    }
    isMountedRef.current = true;
  };

  const selectOption = (opt, index) => {
    setSelectedItem(opt);
    playTickSound();
    scrollRef.current?.scrollTo({ y: index * ARC_ITEM_HEIGHT, animated: true });
    if (onChangeRef.current) {
      onChangeRef.current(opt);
    }
  };

  return (
    <View style={[styles.outerCard, theme.outerCard, expanded && theme.outerCardExpanded]}>
      {/* Top Simple Header Row */}
      <TouchableOpacity 
        style={styles.cardHeader} 
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.headerLeft}>
          <HugeiconsIcon icon={icon || PillsTabletIcon} size={20} color={isDark ? '#A1A1AA' : '#6B7280'} />
          <Text style={[styles.headerTitle, theme.headerTitle]}>{title}</Text>
        </View>

        <Text style={[styles.headerValue, theme.headerValue]}>{selectedItem}</Text>
      </TouchableOpacity>

      {/* Expanded Semicircle Arc Wheel Scroll View */}
      {expanded && (
        <View style={[styles.innerSubCard, theme.innerSubCard, styles.semicircleContainer]}>
          {/* Subtle glowing focus orb near the arc apex */}
          <View style={[styles.semicircleFocalOrb, isDark ? styles.focalOrbDark : styles.focalOrbLight]} pointerEvents="none" />

          {/* Semicircle Curved Wheel Scroll */}
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ARC_ITEM_HEIGHT}
            decelerationRate="fast"
            bounces={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingVertical: ARC_PADDING,
            }}
          >
            {options.map((opt, index) => {
              const itemCenterY = index * ARC_ITEM_HEIGHT;
              const distFromCenter = itemCenterY - scrollY;
              const maxDist = ARC_ITEM_HEIGHT * 2.8;
              const normDist = Math.max(-1, Math.min(1, distFromCenter / maxDist));

              // Semicircle arc curvature
              const cosVal = Math.cos(normDist * (Math.PI / 2));
              const curveX = cosVal * 42;
              const rotateDeg = normDist * 20;
              const scale = 0.85 + cosVal * 0.25;
              const opacity = Math.max(0.2, cosVal);
              const isSelected = opt === selectedItem;

              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => selectOption(opt, index)}
                  activeOpacity={0.8}
                  style={[
                    styles.semicircleItemRow,
                    {
                      opacity,
                      transform: [
                        { translateX: curveX },
                        { rotate: `${rotateDeg}deg` },
                        { scale }
                      ]
                    }
                  ]}
                >
                  <View style={[
                    styles.radioPlusIconCircle,
                    isSelected ? styles.radioPlusSelected : (isDark ? styles.radioPlusUnselectedDark : styles.radioPlusUnselectedLight)
                  ]}>
                    <HugeiconsIcon 
                      icon={isSelected ? Tick02Icon : Add01Icon} 
                      size={11} 
                      color={isSelected ? '#FFFFFF' : (isDark ? '#60A5FA' : '#2563EB')} 
                    />
                  </View>

                  <Text
                    style={[
                      styles.semicircleItemText,
                      isSelected ? (isDark ? styles.textWhite : styles.textBlack) : (isDark ? styles.textMutedDark : styles.textMutedLight),
                      isSelected && styles.semicircleItemTextBold
                    ]}
                    numberOfLines={1}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Structure
  outerCard: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
  },
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
    fontSize: 16,
    fontWeight: '600',
  },
  headerValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  innerSubCard: {
    borderRadius: 18,
    marginHorizontal: 10,
    marginBottom: 10,
    padding: 16,
  },
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
  dashedDivider: {
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 14,
  },
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
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
  },
  largeValueUnit: {
    fontSize: 18,
    fontWeight: '600',
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  stepButtonText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
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
  tickMajorDark: { height: 26, backgroundColor: 'rgba(255, 255, 255, 0.65)' },
  tickMidDark: { height: 18, backgroundColor: 'rgba(255, 255, 255, 0.35)' },
  tickMinorDark: { height: 10, backgroundColor: 'rgba(255, 255, 255, 0.18)' },
  tickMajorLight: { height: 26, backgroundColor: 'rgba(0, 0, 0, 0.65)' },
  tickMidLight: { height: 18, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
  tickMinorLight: { height: 10, backgroundColor: 'rgba(0, 0, 0, 0.18)' },
  tickLabel: {
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
    fontSize: 11,
    fontWeight: '600',
  },
  wheelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 6,
    marginBottom: 4,
  },
  wheelColHeader: {
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
    borderRadius: 10,
    borderWidth: 1,
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
  semicircleContainer: {
    height: ARC_CONTAINER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  semicircleFocalOrb: {
    position: 'absolute',
    top: '50%',
    left: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: -16,
    zIndex: 1,
  },
  focalOrbDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 8,
  },
  focalOrbLight: {
    backgroundColor: 'rgba(37, 99, 235, 0.35)',
    shadowColor: '#2563EB',
    shadowOpacity: 0.7,
    shadowRadius: 14,
    elevation: 6,
  },
  semicircleItemRow: {
    height: ARC_ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    width: '100%',
  },
  radioPlusIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  radioPlusSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  radioPlusUnselectedDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    borderColor: 'rgba(96, 165, 250, 0.5)',
  },
  radioPlusUnselectedLight: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderColor: 'rgba(37, 99, 235, 0.4)',
  },
  semicircleItemText: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  semicircleItemTextBold: {
    fontSize: 18,
    fontWeight: '800',
  },
  textWhite: { color: '#FFFFFF' },
  textBlack: { color: '#111827' },
  textMutedDark: { color: '#71717A' },
  textMutedLight: { color: '#9CA3AF' },
});

// Dark Theme Variants
const darkStyles = StyleSheet.create({
  outerCard: {
    backgroundColor: '#1D1D21',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  outerCardExpanded: {
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerTitle: { color: '#D4D4D8' },
  headerValue: { color: '#FFFFFF' },
  innerSubCard: {
    backgroundColor: '#121215',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  twoToneChip: {},
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
  twoToneChipTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  twoToneChipTextUnselected: { color: '#71717A', fontWeight: '600' },
  dashedDivider: { borderBottomColor: 'rgba(255, 255, 255, 0.07)' },
  largeValueText: { color: '#FFFFFF' },
  largeValueUnit: { color: 'rgba(255, 255, 255, 0.6)' },
  stepButton: {
    backgroundColor: '#1B1B22',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stepButtonText: { color: '#FFFFFF' },
  tickLabel: { color: '#71717A' },
  rangeText: { color: '#52525B' },
  wheelColHeader: { color: '#71717A' },
  activeSelectionBand: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  wheelItemTextActive: { color: '#FFFFFF', fontWeight: '800', fontSize: 17 },
  wheelItemTextInactive: { color: 'rgba(255, 255, 255, 0.28)' },
});

// Light Theme Variants
const lightStyles = StyleSheet.create({
  outerCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  outerCardExpanded: {
    borderColor: '#D1D5DB',
  },
  headerTitle: { color: '#374151' },
  headerValue: { color: '#111827' },
  innerSubCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  twoToneChip: {},
  twoToneChipSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  twoToneChipUnselected: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  twoToneChipTextSelected: { color: '#111827', fontWeight: '700' },
  twoToneChipTextUnselected: { color: '#6B7280', fontWeight: '600' },
  dashedDivider: { borderBottomColor: '#E5E7EB' },
  largeValueText: { color: '#111827' },
  largeValueUnit: { color: '#6B7280' },
  stepButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  stepButtonText: { color: '#111827' },
  tickLabel: { color: '#6B7280' },
  rangeText: { color: '#9CA3AF' },
  wheelColHeader: { color: '#6B7280' },
  activeSelectionBand: {
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
    borderColor: 'rgba(37, 99, 235, 0.25)',
  },
  wheelItemTextActive: { color: '#111827', fontWeight: '800', fontSize: 17 },
  wheelItemTextInactive: { color: 'rgba(0, 0, 0, 0.28)' },
});
