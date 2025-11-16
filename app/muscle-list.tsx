
import React from 'react';
import { shoulderMuscles } from '@/data/shoulderMuscles';
import { colors, commonStyles } from '@/styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function MuscleListScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const isDark = theme.dark;

  const handleMusclePress = (muscleId: string) => {
    console.log('Muscle pressed:', muscleId);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({
      pathname: '/muscle-detail',
      params: { id: muscleId },
    });
  };

  const handleStartGame = () => {
    console.log('Starting card game...');
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    router.push('/card-game');
  };

  // Categorize muscles by type for better organization
  const muscleCategories = {
    rotatorCuff: ['supraspinatus', 'infraspinatus', 'teres-minor', 'subscapularis'],
    superficial: ['deltoid', 'trapezius', 'latissimus-dorsi'],
    pectoral: ['pectoralis-major', 'pectoralis-minor'],
    scapular: ['serratus-anterior', 'levator-scapulae', 'rhomboid-major', 'rhomboid-minor'],
    other: ['teres-major', 'coracobrachialis'],
  };

  const categoryInfo = {
    rotatorCuff: {
      name: 'Coiffe des rotateurs',
      icon: { ios: 'arrow.triangle.2.circlepath', android: 'sync' },
      color: colors.cardBlue,
    },
    superficial: {
      name: 'Muscles superficiels',
      icon: { ios: 'figure.arms.open', android: 'accessibility' },
      color: colors.cardGreen,
    },
    pectoral: {
      name: 'Muscles pectoraux',
      icon: { ios: 'heart.fill', android: 'favorite' },
      color: colors.cardOrange,
    },
    scapular: {
      name: 'Muscles scapulaires',
      icon: { ios: 'arrow.up.left.and.arrow.down.right', android: 'open-with' },
      color: colors.cardPurple,
    },
    other: {
      name: 'Autres muscles',
      icon: { ios: 'star.fill', android: 'star' },
      color: colors.cardYellow,
    },
  };

  const getMuscleIcon = (muscleId: string) => {
    // Return specific icons for each muscle
    const icons: Record<string, { ios: string; android: string }> = {
      'deltoid': { ios: 'triangle.fill', android: 'change-history' },
      'supraspinatus': { ios: 'arrow.up.circle.fill', android: 'arrow-upward' },
      'infraspinatus': { ios: 'arrow.down.circle.fill', android: 'arrow-downward' },
      'teres-minor': { ios: 'smallcircle.filled.circle', android: 'fiber-manual-record' },
      'subscapularis': { ios: 'arrow.left.circle.fill', android: 'arrow-back' },
      'teres-major': { ios: 'largecircle.fill.circle', android: 'album' },
      'latissimus-dorsi': { ios: 'rectangle.fill', android: 'crop-landscape' },
      'pectoralis-major': { ios: 'heart.fill', android: 'favorite' },
      'pectoralis-minor': { ios: 'heart', android: 'favorite-border' },
      'serratus-anterior': { ios: 'line.3.horizontal', android: 'view-headline' },
      'trapezius': { ios: 'triangle.fill', android: 'details' },
      'levator-scapulae': { ios: 'arrow.up.square.fill', android: 'vertical-align-top' },
      'rhomboid-major': { ios: 'rhombus.fill', android: 'crop-square' },
      'rhomboid-minor': { ios: 'rhombus', android: 'crop-din' },
      'coracobrachialis': { ios: 'arrow.right.circle.fill', android: 'arrow-forward' },
    };
    return icons[muscleId] || { ios: 'circle.fill', android: 'circle' };
  };

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: isDark ? colors.darkBackground : colors.background 
    }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: isDark ? colors.darkCard : colors.card 
      }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={isDark ? '#FFFFFF' : colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: isDark ? '#FFFFFF' : colors.text 
        }]}>
          Muscles de l&apos;épaule
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Start Game Button */}
        <TouchableOpacity
          style={[styles.startGameButton, {
            backgroundColor: colors.primary,
          }]}
          onPress={handleStartGame}
          activeOpacity={0.8}
        >
          <View style={styles.startGameIcon}>
            <IconSymbol
              ios_icon_name="play.fill"
              android_material_icon_name="play-arrow"
              size={32}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.startGameContent}>
            <Text style={styles.startGameTitle}>
              Commencer le jeu de cartes
            </Text>
            <Text style={styles.startGameSubtitle}>
              Apprenez les {shoulderMuscles.length} muscles de l&apos;épaule
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Muscle Categories */}
        {Object.entries(muscleCategories).map(([categoryKey, muscleIds]) => {
          const category = categoryInfo[categoryKey as keyof typeof categoryInfo];
          const categoryMuscles = shoulderMuscles.filter(m => muscleIds.includes(m.id));

          return (
            <View key={categoryKey} style={styles.categorySection}>
              <View style={[styles.categoryHeader, {
                backgroundColor: category.color + '20',
              }]}>
                <View style={[styles.categoryIconContainer, {
                  backgroundColor: category.color,
                }]}>
                  <IconSymbol
                    ios_icon_name={category.icon.ios}
                    android_material_icon_name={category.icon.android}
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={[styles.categoryTitle, { color: category.color }]}>
                  {category.name}
                </Text>
                <View style={[styles.categoryBadge, {
                  backgroundColor: category.color,
                }]}>
                  <Text style={styles.categoryBadgeText}>
                    {categoryMuscles.length}
                  </Text>
                </View>
              </View>

              <View style={styles.musclesList}>
                {categoryMuscles.map((muscle, index) => {
                  const muscleIcon = getMuscleIcon(muscle.id);
                  return (
                    <TouchableOpacity
                      key={muscle.id}
                      style={[styles.muscleCard, {
                        backgroundColor: isDark ? colors.darkCard : colors.card,
                        borderLeftColor: category.color,
                        borderLeftWidth: 4,
                      }]}
                      onPress={() => handleMusclePress(muscle.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.muscleIconContainer, {
                        backgroundColor: category.color + '20',
                      }]}>
                        <IconSymbol
                          ios_icon_name={muscleIcon.ios}
                          android_material_icon_name={muscleIcon.android}
                          size={28}
                          color={category.color}
                        />
                      </View>
                      <View style={styles.muscleInfo}>
                        <Text style={[styles.muscleName, { 
                          color: isDark ? '#FFFFFF' : colors.text 
                        }]}>
                          {muscle.name}
                        </Text>
                        <Text style={[styles.muscleDefinition, { 
                          color: colors.textSecondary 
                        }]} numberOfLines={2}>
                          {muscle.definition}
                        </Text>
                      </View>
                      <IconSymbol
                        ios_icon_name="chevron.right"
                        android_material_icon_name="chevron-right"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Summary Card */}
        <View style={[styles.summaryCard, {
          backgroundColor: isDark ? colors.darkCard : colors.card,
        }]}>
          <View style={[styles.summaryIcon, {
            backgroundColor: colors.primary + '20',
          }]}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={32}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.summaryTitle, { 
            color: isDark ? '#FFFFFF' : colors.text 
          }]}>
            Total: {shoulderMuscles.length} muscles
          </Text>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            L&apos;épaule est une articulation complexe composée de plusieurs groupes musculaires 
            qui travaillent ensemble pour permettre une grande amplitude de mouvement.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  startGameButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    gap: 16,
    boxShadow: '0px 8px 24px rgba(3, 169, 244, 0.3)',
    elevation: 8,
  },
  startGameIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startGameContent: {
    flex: 1,
    gap: 4,
  },
  startGameTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  startGameSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  musclesList: {
    gap: 12,
  },
  muscleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  muscleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleInfo: {
    flex: 1,
    gap: 4,
  },
  muscleName: {
    fontSize: 16,
    fontWeight: '700',
  },
  muscleDefinition: {
    fontSize: 13,
    lineHeight: 18,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  summaryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
