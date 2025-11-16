
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { shoulderMuscles } from '@/data/shoulderMuscles';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MuscleListScreen() {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[commonStyles.subtitle, styles.headerTitle]}>
          {t('shoulderMuscles')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.infoCard, { backgroundColor: colors.primary + '15' }]}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={[commonStyles.textSecondary, styles.infoText]}>
            {shoulderMuscles.length} muscles à découvrir dans cette région
          </Text>
        </View>

        {shoulderMuscles.map((muscle, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.muscleCard, { backgroundColor: colors.card }]}
            onPress={() => router.push(`/muscle-detail?id=${muscle.id}` as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.muscleIcon, { backgroundColor: colors.secondary + '20' }]}>
              <IconSymbol
                ios_icon_name="figure.arms.open"
                android_material_icon_name="accessibility"
                size={28}
                color={colors.secondary}
              />
            </View>
            <View style={styles.muscleContent}>
              <Text style={[commonStyles.subtitle, styles.muscleName]}>
                {muscle.name}
              </Text>
              <Text style={[commonStyles.textSecondary, styles.muscleDefinition]} numberOfLines={2}>
                {muscle.definition}
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginBottom: 0,
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 12,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
  },
  muscleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  muscleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleContent: {
    flex: 1,
    gap: 4,
  },
  muscleName: {
    marginBottom: 0,
    fontSize: 18,
  },
  muscleDefinition: {
    fontSize: 13,
  },
});
