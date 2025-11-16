
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | number;
  showText?: boolean;
}

export default function Logo({ size = 'medium', showText = true }: LogoProps) {
  const sizeStyles = {
    small: { iconSize: 40, fontSize: 18, containerSize: 80 },
    medium: { iconSize: 60, fontSize: 24, containerSize: 120 },
    large: { iconSize: 80, fontSize: 32, containerSize: 160 },
  };

  // Handle both string and number sizes
  let currentSize;
  if (typeof size === 'number') {
    currentSize = { iconSize: size, fontSize: size * 0.4, containerSize: size * 2 };
  } else {
    currentSize = sizeStyles[size];
  }

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { 
        width: currentSize.containerSize, 
        height: currentSize.containerSize,
        borderRadius: currentSize.containerSize / 2,
      }]}>
        {/* Outer glow effect */}
        <View style={[styles.glowOuter, {
          width: currentSize.containerSize,
          height: currentSize.containerSize,
          borderRadius: currentSize.containerSize / 2,
        }]} />
        
        {/* Inner gradient background */}
        <View style={[styles.gradientContainer, {
          width: currentSize.containerSize * 0.85,
          height: currentSize.containerSize * 0.85,
          borderRadius: (currentSize.containerSize * 0.85) / 2,
        }]}>
          <View style={[styles.gradientInner, {
            backgroundColor: colors.primary,
            opacity: 0.9,
          }]} />
        </View>
        
        {/* Heart icon */}
        <View style={styles.iconWrapper}>
          <IconSymbol 
            ios_icon_name="heart.fill" 
            android_material_icon_name="favorite" 
            size={currentSize.iconSize} 
            color="#FFFFFF" 
          />
        </View>
      </View>
      
      {showText && (
        <>
          <Text style={[styles.title, { fontSize: currentSize.fontSize }]}>
            Abinarth Formation
          </Text>
          <Text style={styles.subtitle}>Cartes d&apos;Anatomie</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowOuter: {
    position: 'absolute',
    backgroundColor: colors.primary,
    opacity: 0.2,
    boxShadow: '0px 0px 40px rgba(3, 169, 244, 0.6)',
  },
  gradientContainer: {
    position: 'absolute',
    overflow: 'hidden',
  },
  gradientInner: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
  },
  iconWrapper: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
