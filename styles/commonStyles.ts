
import { StyleSheet } from 'react-native';

// Modern color palette inspired by the anatomy cards image
export const colors = {
  // Primary gradient colors from the cards
  primary: '#03a9f4',      // Bright blue
  secondary: '#ff5722',    // Vibrant orange
  accent: '#9c27b0',       // Purple
  highlight: '#ffd54f',    // Yellow
  success: '#4caf50',      // Green
  warning: '#ff9800',      // Orange
  error: '#f44336',        // Red
  
  // Gradient colors for modern UI
  gradientBlue: '#00bcd4',
  gradientGreen: '#4caf50',
  gradientYellow: '#ffeb3b',
  gradientOrange: '#ff9800',
  gradientPurple: '#9c27b0',
  gradientPink: '#e91e63',
  
  // Dark theme colors
  darkBackground: '#0a0e27',
  darkCard: '#1a1f3a',
  darkBorder: '#2a2f4a',
  
  // Light theme colors
  background: '#f5f7fa',
  card: '#ffffff',
  text: '#1a1a2e',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  
  // Semantic colors
  cardBlue: '#00bcd4',
  cardGreen: '#66bb6a',
  cardYellow: '#ffca28',
  cardOrange: '#ff7043',
  cardPurple: '#ab47bc',
};

export const gradients = {
  primary: ['#00bcd4', '#03a9f4'],
  secondary: ['#ff7043', '#ff5722'],
  accent: ['#ab47bc', '#9c27b0'],
  rainbow: ['#00bcd4', '#66bb6a', '#ffca28', '#ff7043', '#ab47bc'],
  warm: ['#ff7043', '#ffca28'],
  cool: ['#00bcd4', '#ab47bc'],
};

export const commonStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textBold: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 8px 24px rgba(0, 188, 212, 0.25)',
    elevation: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  glowEffect: {
    boxShadow: '0px 0px 30px rgba(255, 107, 107, 0.4)',
  },
});
