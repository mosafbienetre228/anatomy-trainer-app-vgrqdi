
import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { useLanguage } from '@/contexts/LanguageContext';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import Logo from '@/components/Logo';

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const isDark = theme.dark;

  return (
    <ScrollView 
      style={[styles.container, { 
        backgroundColor: isDark ? colors.darkBackground : colors.background 
      }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with Logo */}
      <View style={styles.header}>
        <Logo size="large" />
        <Text style={[commonStyles.title, styles.welcomeTitle, { 
          color: isDark ? '#FFFFFF' : colors.text 
        }]}>
          {t('welcome')}
        </Text>
        <Text style={[commonStyles.textSecondary, styles.welcomeDesc, {
          color: isDark ? colors.textSecondary : colors.textSecondary
        }]}>
          {t('welcomeDesc')}
        </Text>
      </View>

      {/* Main Action Cards */}
      <View style={styles.section}>
        {/* Primary Card - Card Game with gradient effect */}
        <TouchableOpacity
          style={[styles.primaryCard, {
            backgroundColor: colors.primary,
          }]}
          onPress={() => router.push('/card-game')}
          activeOpacity={0.8}
        >
          <View style={styles.primaryCardGlow} />
          <View style={styles.cardIcon}>
            <IconSymbol
              ios_icon_name="gamecontroller.fill"
              android_material_icon_name="sports-esports"
              size={40}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={[commonStyles.subtitle, styles.cardTitle]}>
              Jeu de cartes
            </Text>
            <Text style={[commonStyles.textSecondary, styles.cardDescription]}>
              Apprenez l&apos;anatomie de manière interactive
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={28}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Secondary Cards with modern styling */}
        <TouchableOpacity
          style={[styles.card, { 
            backgroundColor: isDark ? colors.darkCard : colors.card 
          }]}
          onPress={() => router.push('/muscle-list')}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIconSmall, { 
            backgroundColor: colors.cardOrange + '20' 
          }]}>
            <IconSymbol
              ios_icon_name="figure.arms.open"
              android_material_icon_name="accessibility"
              size={32}
              color={colors.cardOrange}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={[commonStyles.subtitle, styles.cardTitleDark, { 
              color: isDark ? '#FFFFFF' : colors.text 
            }]}>
              {t('shoulderMuscles')}
            </Text>
            <Text style={[commonStyles.textSecondary, styles.cardDescriptionSmall]}>
              {t('shoulderDesc')}
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { 
            backgroundColor: isDark ? colors.darkCard : colors.card 
          }]}
          onPress={() => router.push('/subscription')}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIconSmall, { 
            backgroundColor: colors.cardPurple + '20' 
          }]}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={colors.cardPurple}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={[commonStyles.subtitle, styles.cardTitleDark, { 
              color: isDark ? '#FFFFFF' : colors.text 
            }]}>
              {t('subscription')}
            </Text>
            <Text style={[commonStyles.textSecondary, styles.cardDescriptionSmall]}>
              {t('subscriptionDesc')}
            </Text>
          </View>
          <IconSymbol
            ios_icon_name="chevron.right"
            android_material_icon_name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Info Section with gradient accent */}
      <View style={[styles.infoSection, { 
        backgroundColor: isDark 
          ? colors.darkCard 
          : colors.cardBlue + '15',
        borderLeftWidth: 4,
        borderLeftColor: colors.cardBlue,
      }]}>
        <IconSymbol
          ios_icon_name="lightbulb.fill"
          android_material_icon_name="lightbulb"
          size={28}
          color={colors.cardBlue}
        />
        <View style={styles.infoContent}>
          <Text style={[commonStyles.textBold, styles.infoTitle, { 
            color: isDark ? '#FFFFFF' : colors.text 
          }]}>
            Comment jouer ?
          </Text>
          <Text style={[commonStyles.textSecondary, styles.infoText]}>
            Sélectionnez une carte réponse et placez-la dans la case correspondante du muscle. Complétez toutes les caractéristiques pour passer au muscle suivant !
          </Text>
        </View>
      </View>

      {/* Feature highlights with colorful icons */}
      <View style={styles.featuresSection}>
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: colors.cardGreen + '20' }]}>
            <IconSymbol
              ios_icon_name="brain.head.profile"
              android_material_icon_name="psychology"
              size={24}
              color={colors.cardGreen}
            />
          </View>
          <Text style={[styles.featureText, { 
            color: isDark ? colors.textSecondary : colors.textSecondary 
          }]}>
            Apprentissage interactif
          </Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: colors.cardYellow + '20' }]}>
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="bar-chart"
              size={24}
              color={colors.cardYellow}
            />
          </View>
          <Text style={[styles.featureText, { 
            color: isDark ? colors.textSecondary : colors.textSecondary 
          }]}>
            Suivi des progrès
          </Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: colors.cardPurple + '20' }]}>
            <IconSymbol
              ios_icon_name="trophy.fill"
              android_material_icon_name="emoji-events"
              size={24}
              color={colors.cardPurple}
            />
          </View>
          <Text style={[styles.featureText, { 
            color: isDark ? colors.textSecondary : colors.textSecondary 
          }]}>
            Récompenses
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  welcomeDesc: {
    textAlign: 'center',
    fontSize: 15,
  },
  section: {
    gap: 16,
    marginBottom: 24,
  },
  primaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    gap: 16,
    boxShadow: '0px 8px 32px rgba(3, 169, 244, 0.35)',
    elevation: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  primaryCardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    marginBottom: 0,
    fontSize: 22,
  },
  cardTitleDark: {
    marginBottom: 0,
    fontSize: 18,
  },
  cardDescription: {
    color: '#FFFFFF',
    opacity: 0.95,
    fontSize: 14,
  },
  cardDescriptionSmall: {
    fontSize: 13,
  },
  infoSection: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  infoContent: {
    flex: 1,
    gap: 6,
  },
  infoTitle: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
});
