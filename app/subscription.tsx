
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SubscriptionScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');

  const plans = [
    {
      id: 'free',
      name: t('free'),
      price: '0€',
      period: '/mois',
      features: [
        'Accès aux muscles de l\'épaule',
        'Mode apprentissage de base',
        'Suivi de progression limité',
      ],
      color: colors.textSecondary,
    },
    {
      id: 'premium',
      name: t('premium'),
      price: '9.99€',
      period: '/mois',
      features: [
        'Accès à toutes les régions anatomiques',
        'Mode jeu de cartes complet',
        'Suivi de progression détaillé',
        'Récompenses et badges',
        'Support prioritaire',
        'Contenu exclusif',
      ],
      color: colors.accent,
      recommended: true,
    },
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
          {t('subscription')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.infoCard, { backgroundColor: colors.highlight + '30' }]}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.text}
          />
          <Text style={[commonStyles.text, styles.infoText]}>
            {t('subscriptionDesc')}
          </Text>
        </View>

        {plans.map((plan, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.planCard,
              { backgroundColor: colors.card },
              selectedPlan === plan.id && styles.planCardSelected,
              selectedPlan === plan.id && { borderColor: plan.color, borderWidth: 2 },
            ]}
            onPress={() => setSelectedPlan(plan.id as 'free' | 'premium')}
            activeOpacity={0.7}
          >
            {plan.recommended && (
              <View style={[styles.recommendedBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.recommendedText}>Recommandé</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <Text style={[commonStyles.subtitle, styles.planName]}>
                {plan.name}
              </Text>
              <View style={styles.priceContainer}>
                <Text style={[commonStyles.title, styles.planPrice]}>
                  {plan.price}
                </Text>
                <Text style={commonStyles.textSecondary}>{plan.period}</Text>
              </View>
            </View>

            <View style={styles.featuresContainer}>
              {plan.features.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.featureRow}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={plan.color}
                  />
                  <Text style={[commonStyles.text, styles.featureText]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <View style={[styles.paymentInfo, { backgroundColor: colors.card }]}>
          <IconSymbol
            ios_icon_name="lock.fill"
            android_material_icon_name="lock"
            size={24}
            color={colors.primary}
          />
          <View style={styles.paymentTextContainer}>
            <Text style={[commonStyles.subtitle, styles.paymentTitle]}>
              Paiement sécurisé
            </Text>
            <Text style={commonStyles.textSecondary}>
              Paiement par monnaie numérique disponible
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: colors.accent }]}
          activeOpacity={0.8}
        >
          <Text style={styles.subscribeButtonText}>
            {selectedPlan === 'free' ? 'Continuer avec le plan gratuit' : t('subscribe')}
          </Text>
        </TouchableOpacity>

        <Text style={[commonStyles.textSecondary, styles.disclaimer]}>
          * Les fonctionnalités de paiement seront disponibles prochainement
        </Text>
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    position: 'relative',
  },
  planCardSelected: {
    boxShadow: '0px 4px 16px rgba(255, 64, 129, 0.3)',
    elevation: 6,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    gap: 8,
  },
  planName: {
    marginBottom: 0,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planPrice: {
    marginBottom: 0,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  paymentTextContainer: {
    flex: 1,
    gap: 4,
  },
  paymentTitle: {
    marginBottom: 0,
    fontSize: 16,
  },
  subscribeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(255, 64, 129, 0.3)',
    elevation: 5,
  },
  subscribeButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '700',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
