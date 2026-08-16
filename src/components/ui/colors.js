import { useColorScheme } from 'react-native';

export const lightColors = {
  // Clean modern tokens
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  primary: '#2563EB',
  primaryHover: '#1D4ED8',
  primarySoft: '#EFF6FF',
  primarySoftText: '#1D4ED8',
  focusRing: '#3B82F6',

  // Legacy mappings for existing components
  accent: '#2563EB',
  cardBackground: '#FFFFFF',
  inputBackground: '#F3F4F6',
  inputText: '#111827',
  buttonBackground: '#111827',
  buttonText: '#FFFFFF',
  text: '#111827',
  darkText: '#111827',
  iconBackground: '#F3F4F6',
  placeholder: '#9CA3AF',
  white: '#FFFFFF',
  transparent: 'transparent',
  headerTopBackground: '#FFFFFF',
  headerBottomBackground: '#F9FAFB',
  headerText: '#111827',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  healthCardBackground: '#FFFFFF',
  healthCardText: '#111827',
  healthCardSubtext: '#4B5563',
};

export const darkColors = {
  // Clean modern tokens
  background: '#000000',
  surface: '#121217',
  surfaceAlt: '#1A1A22',
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  primary: '#3B82F6',
  primaryHover: '#2563EB',
  primarySoft: 'rgba(59, 130, 246, 0.15)',
  primarySoftText: '#93C5FD',
  focusRing: '#60A5FA',

  // Legacy mappings for existing components
  accent: '#3B82F6',
  cardBackground: '#121217',
  inputBackground: '#1A1A22',
  inputText: '#FFFFFF',
  buttonBackground: '#FFFFFF',
  buttonText: '#000000',
  text: '#FFFFFF',
  darkText: '#FFFFFF',
  iconBackground: '#1A1A22',
  placeholder: '#71717A',
  white: '#FFFFFF',
  transparent: 'transparent',
  headerTopBackground: '#121217',
  headerBottomBackground: '#000000',
  headerText: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  healthCardBackground: '#121217',
  healthCardText: '#FFFFFF',
  healthCardSubtext: '#A1A1AA',
};

export const COLORS = darkColors;

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};
