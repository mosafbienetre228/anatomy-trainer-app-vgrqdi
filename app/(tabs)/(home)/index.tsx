
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import Logo from "@/components/Logo";
import { IconSymbol } from "@/components/IconSymbol";
import { useLanguage } from "@/contexts/LanguageContext";
import { router } from "expo-router";

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useLanguage();

  const features = [
    {
      id: 'shoulder',
      title: t('shoulderMuscles'),
      description: t('shoulderDesc'),
      icon: 'arm-flex',
      iosIcon: 'figure.arms.open',
      color: colors.primary,
      route: '/muscle-list',
    },
    {
      id: 'subscription',
      title: t('subscriptionTitle'),
      description: t('subscriptionDesc'),
      icon: 'card',
      iosIcon: 'creditcard.fill',
      color: colors.secondary,
      route: '/subscription',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Logo size="large" />
          <Text style={[commonStyles.text, styles.welcomeText]}>
            {t('welcomeDesc')}
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: colors.card }]}
              onPress={() => {
                if (feature.route === '/muscle-list') {
                  router.push('/muscle-list' as any);
                } else if (feature.route === '/subscription') {
                  router.push('/subscription' as any);
                }
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
                <IconSymbol
                  ios_icon_name={feature.iosIcon}
                  android_material_icon_name={feature.icon}
                  size={32}
                  color={feature.color}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={[commonStyles.subtitle, styles.featureTitle]}>
                  {feature.title}
                </Text>
                <Text style={[commonStyles.textSecondary, styles.featureDescription]}>
                  {feature.description}
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
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="bar-chart"
              size={28}
              color={colors.accent}
            />
            <Text style={[commonStyles.subtitle, styles.statValue]}>0</Text>
            <Text style={commonStyles.textSecondary}>{t('musclesLearned')}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={28}
              color={colors.highlight}
            />
            <Text style={[commonStyles.subtitle, styles.statValue]}>0</Text>
            <Text style={commonStyles.textSecondary}>{t('totalScore')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  welcomeText: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    marginBottom: 0,
  },
  featureDescription: {
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    marginBottom: 0,
  },
});
