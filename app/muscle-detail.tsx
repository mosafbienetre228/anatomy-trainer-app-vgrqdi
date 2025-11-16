
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { shoulderMuscles } from '@/data/shoulderMuscles';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MuscleDetailScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const { id } = useLocalSearchParams();
  
  const muscle = shoulderMuscles.find(m => m.id === id);

  if (!muscle) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
        <Text style={commonStyles.text}>Muscle non trouvé</Text>
      </SafeAreaView>
    );
  }

  const characteristics = [
    { key: 'definition', label: t('definition'), value: muscle.definition, icon: 'book', iosIcon: 'book.fill' },
    { key: 'origin', label: t('origin'), value: muscle.origin, icon: 'place', iosIcon: 'location.fill' },
    { key: 'path', label: t('path'), value: muscle.path, icon: 'timeline', iosIcon: 'arrow.right.circle.fill' },
    { key: 'termination', label: t('termination'), value: muscle.termination, icon: 'flag', iosIcon: 'flag.fill' },
    { key: 'innervation', label: t('innervation'), value: muscle.innervation, icon: 'cable', iosIcon: 'bolt.fill' },
    { key: 'action', label: t('action'), value: muscle.action, icon: 'directions-run', iosIcon: 'figure.run' },
    { key: 'relations', label: t('relations'), value: muscle.relations, icon: 'group', iosIcon: 'person.2.fill' },
    { key: 'clinicalApplications', label: t('clinicalApplications'), value: muscle.clinicalApplications, icon: 'medical-services', iosIcon: 'cross.case.fill' },
  ];

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
          {muscle.name}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <IconSymbol
            ios_icon_name="figure.arms.open"
            android_material_icon_name="accessibility"
            size={64}
            color={colors.card}
          />
          <Text style={[commonStyles.title, styles.heroTitle]}>
            {muscle.name}
          </Text>
          <Text style={[commonStyles.textSecondary, styles.heroRegion]}>
            {muscle.region}
          </Text>
        </View>

        <Text style={[commonStyles.subtitle, styles.sectionTitle]}>
          {t('characteristics')}
        </Text>

        {characteristics.map((char, index) => (
          <View
            key={index}
            style={[styles.characteristicCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.characteristicHeader}>
              <View style={[styles.characteristicIcon, { backgroundColor: colors.secondary + '20' }]}>
                <IconSymbol
                  ios_icon_name={char.iosIcon}
                  android_material_icon_name={char.icon}
                  size={20}
                  color={colors.secondary}
                />
              </View>
              <Text style={[commonStyles.subtitle, styles.characteristicLabel]}>
                {char.label}
              </Text>
            </View>
            <Text style={[commonStyles.text, styles.characteristicValue]}>
              {char.value}
            </Text>
          </View>
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
    gap: 16,
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    gap: 12,
    boxShadow: '0px 4px 12px rgba(3, 169, 244, 0.3)',
    elevation: 5,
  },
  heroTitle: {
    color: colors.card,
    marginBottom: 0,
  },
  heroRegion: {
    color: colors.card,
    opacity: 0.9,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 0,
  },
  characteristicCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  characteristicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  characteristicIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characteristicLabel: {
    flex: 1,
    marginBottom: 0,
    fontSize: 16,
  },
  characteristicValue: {
    lineHeight: 22,
  },
});
