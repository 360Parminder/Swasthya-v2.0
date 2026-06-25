// src/config/colors.js

const palette = {
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    300: '#d4d4d4',
    500: '#737373',
    900: '#171717',
    950: '#0a0a0a',
  },
  violet: {
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
  }
};

export const colors = {
  primary: palette.violet[600],
  secondary: palette.violet[500],
  background: palette.neutral[50],
  text: palette.neutral[900],
  lightText: palette.neutral[500],
  error: '#EF4444',
};

export const darkColors = {
  primary: palette.violet[500],
  secondary: palette.violet[400],
  background: palette.neutral[950],
  text: palette.neutral[50],
  lightText: palette.neutral[300],
  error: '#F87171',
};