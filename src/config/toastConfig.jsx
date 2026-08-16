import React from 'react';
import { Text, View, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Tick02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';

// Wrap Toast.show globally to log every toast trigger
const originalToastShow = Toast.show;
Toast.show = (options) => {
  const type = options?.type || 'info';
  const text1 = options?.text1 || '';
  const text2 = options?.text2 || options?.props?.text2 || '';
  console.log(`🔔 [TOAST ${type.toUpperCase()}]: ${text1}${text2 ? ` | ${text2}` : ''}`, options);
  if (typeof originalToastShow === 'function') {
    return originalToastShow.call(Toast, options);
  }
};

const CustomToastBase = ({
  type = 'info',
  text1,
  text2,
  icon,
  accentColor,
  accentBgDark,
  accentBgLight,
  onPress,
}) => {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={[
        styles.toastCard,
        isDark ? styles.toastCardDark : styles.toastCardLight,
        {
          borderColor: isDark ? `${accentColor}35` : `${accentColor}40`,
        },
      ]}
    >
      {/* Left Vertical Accent Line */}
      <View style={[styles.leftAccentPill, { backgroundColor: accentColor }]} />

      {/* Icon Badge */}
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: isDark ? accentBgDark : accentBgLight,
            borderColor: `${accentColor}40`,
          },
        ]}
      >
        <HugeiconsIcon icon={icon} size={18} color={accentColor} variant="solid" />
      </View>

      {/* Message Content */}
      <View style={styles.textContainer}>
        {!!text1 && (
          <Text
            style={[
              styles.titleText,
              isDark ? styles.titleDark : styles.titleLight,
            ]}
            numberOfLines={1}
          >
            {text1}
          </Text>
        )}
        {!!text2 && (
          <Text
            style={[
              styles.messageText,
              isDark ? styles.messageDark : styles.messageLight,
            ]}
            numberOfLines={2}
          >
            {text2}
          </Text>
        )}
      </View>

      {/* Subtle Close Indicator */}
      <View style={styles.rightTag}>
        <View style={[styles.typeDot, { backgroundColor: accentColor }]} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Toast Type Variants ───────────────────────────────────────────
const SuccessToast = ({ text1, props }) => {
  const subText = props?.text2 || '';
  return (
    <CustomToastBase
      type="success"
      text1={text1}
      text2={subText}
      icon={Tick02Icon}
      accentColor="#10B981"
      accentBgDark="rgba(16, 185, 129, 0.18)"
      accentBgLight="#ECFDF5"
      onPress={Toast.hide}
    />
  );
};

const ErrorToast = ({ text1, props }) => {
  const subText = props?.text2 || '';
  return (
    <CustomToastBase
      type="error"
      text1={text1}
      text2={subText}
      icon={Cancel01Icon}
      accentColor="#EF4444"
      accentBgDark="rgba(239, 68, 68, 0.18)"
      accentBgLight="#FEF2F2"
      onPress={Toast.hide}
    />
  );
};

const WarningToast = ({ text1, props }) => {
  const subText = props?.text2 || '';
  return (
    <CustomToastBase
      type="warning"
      text1={text1}
      text2={subText}
      icon={AlertCircleIcon}
      accentColor="#F59E0B"
      accentBgDark="rgba(245, 158, 11, 0.18)"
      accentBgLight="#FFFBEB"
      onPress={Toast.hide}
    />
  );
};

const InfoToast = ({ text1, props }) => {
  const subText = props?.text2 || '';
  return (
    <CustomToastBase
      type="info"
      text1={text1}
      text2={subText}
      icon={InformationCircleIcon}
      accentColor="#3B82F6"
      accentBgDark="rgba(59, 130, 246, 0.18)"
      accentBgLight="#EFF6FF"
      onPress={Toast.hide}
    />
  );
};

// Export configuration map for react-native-toast-message
export const toastConfig = {
  success: (props) => <SuccessToast {...props} />,
  error: (props) => <ErrorToast {...props} />,
  warning: (props) => <WarningToast {...props} />,
  info: (props) => <InfoToast {...props} />,
};

/**
 * Global helper to trigger unified toast notifications
 * @param {'success' | 'error' | 'warning' | 'info'} type
 * @param {string} message
 * @param {string} subMessage
 */
export const showToast = (type = 'info', message = '', subMessage = '') => {
  console.log(`🔔 [showToast ${type?.toUpperCase()}]: ${message}${subMessage ? ` | ${subMessage}` : ''}`);
  Toast.show({
    type,
    text1: message,
    text2: subMessage,
    visibilityTime: 3500,
    autoHide: true,
    topOffset: 50,
  });
};

const styles = StyleSheet.create({
  toastCard: {
    width: '92%',
    minHeight: 58,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  toastCardDark: {
    backgroundColor: '#131B2A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  toastCardLight: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  leftAccentPill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  titleDark: {
    color: '#F8FAFC',
  },
  titleLight: {
    color: '#0F172A',
  },
  messageText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 16,
  },
  messageDark: {
    color: '#94A3B8',
  },
  messageLight: {
    color: '#64748B',
  },
  rightTag: {
    paddingLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
