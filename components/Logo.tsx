
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const sizeStyles = {
    small: { iconSize: 40, fontSize: 18 },
    medium: { iconSize: 60, fontSize: 24 },
    large: { iconSize: 80, fontSize: 32 },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconSymbol 
          ios_icon_name="brain.head.profile" 
          android_material_icon_name="psychology" 
          size={currentSize.iconSize} 
          color={colors.primary} 
        />
      </View>
      <Text style={[styles.title, { fontSize: currentSize.fontSize }]}>
        Abinarth Formation
      </Text>
      <Text style={styles.subtitle}>Anatomie Interactive</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    backgroundColor: colors.card,
    borderRadius: 60,
    padding: 16,
    boxShadow: '0px 4px 12px rgba(3, 169, 244, 0.2)',
    elevation: 4,
  },
  title: {
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
