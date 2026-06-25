import { useColorScheme } from 'react-native';

const palette = {
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  }
};

export const lightColors = {
  // New tokens
  background: palette.neutral[50],
  surface: palette.neutral[100],
  surfaceAlt: palette.neutral[200],
  border: palette.neutral[300],
  borderStrong: palette.neutral[400],
  textPrimary: palette.neutral[900],
  textSecondary: palette.neutral[700],
  textMuted: palette.neutral[500],
  primary: palette.violet[600],
  primaryHover: palette.violet[700],
  primarySoft: palette.violet[100],
  primarySoftText: palette.violet[800],
  focusRing: palette.violet[500],

  // Legacy mappings for existing components
  accent: palette.violet[600],
  cardBackground: palette.neutral[100],
  inputBackground: palette.neutral[200],
  inputText: palette.neutral[900],
  buttonBackground: palette.violet[600],
  buttonText: '#FFFFFF',
  text: palette.neutral[900],
  darkText: palette.neutral[900],
  iconBackground: palette.neutral[200],
  placeholder: palette.neutral[500],
  white: '#FFFFFF',
  transparent: 'transparent',
  headerTopBackground: palette.neutral[100],
  headerBottomBackground: palette.neutral[200],
  headerText: palette.neutral[900],
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: palette.violet[500],
  healthCardBackground: palette.neutral[100],
  healthCardText: palette.neutral[900],
  healthCardSubtext: palette.neutral[700],
};

export const darkColors = {
  // New tokens
  background: palette.neutral[950],
  surface: palette.neutral[900],
  surfaceAlt: palette.neutral[800],
  border: palette.neutral[700],
  borderStrong: palette.neutral[600],
  textPrimary: palette.neutral[50],
  textSecondary: palette.neutral[300],
  textMuted: palette.neutral[500],
  primary: palette.violet[500],
  primaryHover: palette.violet[400],
  primarySoft: palette.violet[950],
  primarySoftText: palette.violet[200],
  focusRing: palette.violet[400],

  // Legacy mappings for existing components
  accent: palette.violet[500],
  cardBackground: palette.neutral[900],
  inputBackground: palette.neutral[800],
  inputText: palette.neutral[50],
  buttonBackground: palette.violet[500],
  buttonText: '#FFFFFF',
  text: palette.neutral[50],
  darkText: palette.neutral[50],
  iconBackground: palette.neutral[800],
  placeholder: palette.neutral[500],
  white: '#FFFFFF',
  transparent: 'transparent',
  headerTopBackground: palette.neutral[900],
  headerBottomBackground: palette.neutral[800],
  headerText: palette.neutral[50],
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  info: palette.violet[400],
  healthCardBackground: palette.neutral[900],
  healthCardText: palette.neutral[50],
  healthCardSubtext: palette.neutral[300],
};

export const COLORS = darkColors;

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};
