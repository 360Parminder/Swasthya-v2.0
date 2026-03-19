import { useColorScheme } from 'react-native';

const lightPurple = '#ab70e7ff';
const darkPurple = '#912cf0ff';

export const lightColors = {
  primary: darkPurple, // Darker for text/brand contrast
  accent: lightPurple,
  background: '#F5F5F5',
  cardBackground: '#E8E8E8',
  inputBackground: '#D4D4D4',
  inputText: '#1E1E1E',
  buttonBackground: darkPurple,
  buttonText: '#FFFFFF',
  text: '#1E1E1E',
  textSecondary: '#3A3A3A',
  border: '#888888',
  darkText: '#000000',
  iconBackground: '#D4D4D4',
  placeholder: '#6B6B6B',
  white: '#FFFFFF',
  transparent: 'transparent',
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
  primary: lightPurple, // Lighter for contrast on dark
  accent: '#A855F7',
  background: '#121212',
  cardBackground: '#1E1E1E', 
  inputBackground: '#2A2A2A',
  inputText: '#D4D4D4',
  buttonBackground: lightPurple,
  buttonText: '#121212', 
  text: '#D4D4D4',
  textSecondary: '#B0B0B0',
  border: '#3A3A3A',
  darkText: '#000000',
  iconBackground: '#2A2A2A',
  placeholder: '#6B6B6B',
  white: '#FFFFFF',
  transparent: 'transparent',
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
