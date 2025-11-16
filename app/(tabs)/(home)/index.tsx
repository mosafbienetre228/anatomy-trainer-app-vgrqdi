
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

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Logo size={80} />
        <Text style={[commonStyles.title, styles.welcomeTitle, { color: theme.colors.text }]}>
          {t('welcome')}
        </Text>
        <Text style={[commonStyles.textSecondary, styles.welcomeDesc]}>
          {t('welcomeDesc')}
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.primaryCard, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/card-game')}
          activeOpacity={0.8}
        >
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

        <TouchableOpacity
          style={[styles.card, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/muscle-list')}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIconSmall, { backgroundColor: colors.secondary + '20' }]}>
            <IconSymbol
              ios_icon_name="figure.arms.open"
              android_material_icon_name="accessibility"
              size={32}
              color={colors.secondary}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={[commonStyles.subtitle, styles.cardTitleDark, { color: theme.colors.text }]}>
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
          style={[styles.card, { backgroundColor: theme.colors.card }]}
          onPress={() => router.push('/subscription')}
          activeOpacity={0.7}
        >
          <View style={[styles.cardIconSmall, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={colors.primary}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={[commonStyles.subtitle, styles.cardTitleDark, { color: theme.colors.text }]}>
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

      <View style={[styles.infoSection, { backgroundColor: colors.primary + '10' }]}>
        <IconSymbol
          ios_icon_name="lightbulb.fill"
          android_material_icon_name="lightbulb"
          size={28}
          color={colors.primary}
        />
        <View style={styles.infoContent}>
          <Text style={[commonStyles.textBold, styles.infoTitle, { color: theme.colors.text }]}>
            Comment jouer ?
          </Text>
          <Text style={[commonStyles.textSecondary, styles.infoText]}>
            Sélectionnez une carte réponse et placez-la dans la case correspondante du muscle. Complétez toutes les caractéristiques pour passer au muscle suivant !
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
    boxShadow: '0px 6px 20px rgba(3, 169, 244, 0.3)',
    elevation: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
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
});
