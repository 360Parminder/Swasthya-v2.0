import { useColorScheme } from 'react-native';

const light = '#7BBDE8';
const dark = '#0A4174';

export const lightColors = {
  primary: dark, // Darker for text/brand contrast
  accent: light,
  background: '#F0F6FA',
  cardBackground: '#FFFFFF',
  inputBackground: '#E4EEF5',
  inputText: '#001D39',
  buttonBackground: dark,
  buttonText: '#FFFFFF',
  text: '#001D39',
  textSecondary: '#49769F',
  border: '#BDD8E9',
  darkText: '#001D39',
  iconBackground: '#E4EEF5',
  placeholder: '#6EA2B3',
  white: '#FFFFFF',
  transparent: 'transparent',
  // Header colors
  headerTopBackground: '#FFFFFF',
  headerBottomBackground: '#BDD8E9',
  headerText: '#001D39',
  // Multi-color accents for specific sections/states
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#7BBDE8',
  // Health card colors
  healthCardBackground: '#FFFFFF',
  healthCardText: '#001D39',
  healthCardSubtext: '#49769F',
};

export const darkColors = {
  primary: light, // Lighter for contrast on dark
  accent: dark,
  background: '#001D39',
  cardBackground: '#0A4174',
  inputBackground: '#0A4174',
  inputText: '#BDD8E9',
  buttonBackground: '#4E8EA2',
  buttonText: '#FFFFFF',
  text: '#BDD8E9',
  textSecondary: '#6EA2B3',
  border: '#49769F',
  darkText: '#FFFFFF',
  iconBackground: '#0A4174',
  placeholder: '#49769F',
  white: '#FFFFFF',
  transparent: 'transparent',
  // Header colors
  headerTopBackground: '#001D39',
  headerBottomBackground: '#0A4174',
  headerText: '#FFFFFF',
  // Multi-color accents
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#7BBDE8',
  // Health card colors
  healthCardBackground: '#0A4174',
  healthCardText: '#BDD8E9',
  healthCardSubtext: '#6EA2B3',
};

// Fallback export if needed temporarily before full migration
export const COLORS = darkColors; // It was previously a dark theme

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};
