
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface AppIconProps {
  size?: number;
}

/**
 * AppIcon component - Represents the app launcher icon design
 * Features a glowing heart with colorful card elements in the background
 * Inspired by the anatomy cards image
 */
export default function AppIcon({ size = 200 }: AppIconProps) {
  const iconSize = size * 0.5;
  const cardSize = size * 0.35;
  const cardOffset = size * 0.15;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background gradient effect */}
      <View style={[styles.background, {
        width: size,
        height: size,
        borderRadius: size * 0.22, // 22% rounded corners for modern look
      }]} />

      {/* Colorful cards in background - representing different anatomy categories */}
      <View style={[styles.card, styles.cardBlue, {
        width: cardSize,
        height: cardSize,
        borderRadius: cardSize * 0.15,
        top: cardOffset * 0.8,
        left: cardOffset * 0.5,
        transform: [{ rotate: '-15deg' }],
      }]} />
      
      <View style={[styles.card, styles.cardGreen, {
        width: cardSize,
        height: cardSize,
        borderRadius: cardSize * 0.15,
        top: cardOffset * 0.6,
        left: cardOffset * 1.5,
        transform: [{ rotate: '-8deg' }],
      }]} />
      
      <View style={[styles.card, styles.cardYellow, {
        width: cardSize,
        height: cardSize,
        borderRadius: cardSize * 0.15,
        top: cardOffset * 0.7,
        right: cardOffset * 1.5,
        transform: [{ rotate: '8deg' }],
      }]} />
      
      <View style={[styles.card, styles.cardOrange, {
        width: cardSize,
        height: cardSize,
        borderRadius: cardSize * 0.15,
        top: cardOffset * 0.9,
        right: cardOffset * 0.5,
        transform: [{ rotate: '15deg' }],
      }]} />

      {/* Central heart icon with glow effect */}
      <View style={[styles.heartContainer, {
        width: size * 0.7,
        height: size * 0.7,
        borderRadius: size * 0.35,
      }]}>
        {/* Outer glow */}
        <View style={[styles.heartGlow, {
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: size * 0.35,
        }]} />
        
        {/* Inner gradient background */}
        <View style={[styles.heartBackground, {
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: size * 0.3,
        }]} />
        
        {/* Heart icon */}
        <View style={styles.heartIcon}>
          <IconSymbol 
            ios_icon_name="heart.fill" 
            android_material_icon_name="favorite" 
            size={iconSize} 
            color="#FFFFFF" 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    backgroundColor: colors.darkBackground,
  },
  card: {
    position: 'absolute',
    opacity: 0.6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardBlue: {
    backgroundColor: colors.cardBlue,
    boxShadow: '0px 4px 20px rgba(0, 188, 212, 0.4)',
  },
  cardGreen: {
    backgroundColor: colors.cardGreen,
    boxShadow: '0px 4px 20px rgba(102, 187, 106, 0.4)',
  },
  cardYellow: {
    backgroundColor: colors.cardYellow,
    boxShadow: '0px 4px 20px rgba(255, 202, 40, 0.4)',
  },
  cardOrange: {
    backgroundColor: colors.cardOrange,
    boxShadow: '0px 4px 20px rgba(255, 112, 67, 0.4)',
  },
  heartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heartGlow: {
    position: 'absolute',
    backgroundColor: '#ff6b6b',
    opacity: 0.3,
    boxShadow: '0px 0px 60px rgba(255, 107, 107, 0.8)',
  },
  heartBackground: {
    position: 'absolute',
    backgroundColor: '#ff6b6b',
    boxShadow: '0px 8px 32px rgba(255, 107, 107, 0.6)',
  },
  heartIcon: {
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
