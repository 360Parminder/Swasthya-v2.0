import { useColorScheme } from 'react-native';

const light = '#68B8B8';
const dark = '#006A6A';

export const lightColors = {
  primary: dark, // Darker for text/brand contrast
  accent: light,
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  inputBackground: '#E8E8E8',
  inputText: '#1E1E1E',
  buttonBackground: dark,
  buttonText: '#FFFFFF',
  text: '#1E1E1E',
  textSecondary: '#4A4A4A',
  border: '#E5E7EB',
  darkText: '#000000',
  iconBackground: '#F3F4F6',
  placeholder: '#9CA3AF',
  white: '#FFFFFF',
  transparent: 'transparent',
  // Header colors
  headerTopBackground: '#FFFFFF',
  headerBottomBackground: '#F3F4F6',
  headerText: '#1E1E1E',
  // Multi-color accents for specific sections/states
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  // Health card colors
  healthCardBackground: '#FFFFFF',
  healthCardText: '#1E1E1E',
  healthCardSubtext: '#6B6B6B',
};

export const darkColors = {
  primary: light, // Lighter for contrast on dark
  accent: dark,
  background: '#121212',
  cardBackground: '#1E1E1E',
  inputBackground: '#2A2A2A',
  inputText: '#D4D4D4',
  buttonBackground: light,
  buttonText: '#121212',
  text: '#D4D4D4',
  textSecondary: '#A3A3A3',
  border: '#374151',
  darkText: '#000000',
  iconBackground: '#2A2A2A',
  placeholder: '#6B6B6B',
  white: '#FFFFFF',
  transparent: 'transparent',
  // Header colors
  headerTopBackground: '#000000',
  headerBottomBackground: '#1C1C1E',
  headerText: '#FFFFFF',
  // Multi-color accents
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#60A5FA',
  // Health card colors
  healthCardBackground: '#1E1E1E',
  healthCardText: '#D4D4D4',
  healthCardSubtext: '#8A8A8A',
};

// Fallback export if needed temporarily before full migration
export const COLORS = darkColors; // It was previously a dark theme

export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};
