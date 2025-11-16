
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function SubscriptionScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'premium'>('trial');

  const plans = [
    {
      id: 'trial',
      name: 'Essai Gratuit',
      price: '0€',
      period: '/30 jours',
      features: [
        'Accès complet à toutes les régions anatomiques',
        'Mode jeu de cartes complet',
        'Suivi de progression détaillé',
        'Récompenses et badges',
        'Support prioritaire',
        'Contenu exclusif',
        'Aucune carte de crédit requise',
      ],
      color: colors.primary,
      recommended: true,
    },
    {
      id: 'premium',
      name: t('premium'),
      price: '9.99€',
      period: '/mois',
      features: [
        'Accès illimité à toutes les régions',
        'Mode jeu de cartes avancé',
        'Suivi de progression détaillé',
        'Récompenses et badges exclusifs',
        'Support prioritaire 24/7',
        'Contenu exclusif et mises à jour',
        'Statistiques avancées',
        'Mode hors ligne',
      ],
      color: colors.accent,
    },
  ];

  const handleSubscribe = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (selectedPlan === 'trial') {
      Alert.alert(
        'Essai gratuit activé ! 🎉',
        'Vous avez maintenant un accès complet à toutes les fonctionnalités pendant 30 jours. Profitez-en !',
        [
          {
            text: 'Commencer',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      Alert.alert(
        'Paiement',
        'Les fonctionnalités de paiement seront disponibles prochainement. En attendant, profitez de l\'essai gratuit !',
        [
          {
            text: 'OK',
            onPress: () => console.log('Payment info acknowledged'),
          },
        ]
      );
    }
  };

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
        <View style={[styles.infoCard, { backgroundColor: colors.primary + '20' }]}>
          <IconSymbol
            ios_icon_name="gift.fill"
            android_material_icon_name="card-giftcard"
            size={32}
            color={colors.primary}
          />
          <View style={styles.infoTextContainer}>
            <Text style={[commonStyles.textBold, styles.infoTitle]}>
              Essai gratuit de 30 jours
            </Text>
            <Text style={[commonStyles.text, styles.infoText]}>
              Accès complet à toutes les fonctionnalités sans engagement
            </Text>
          </View>
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
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedPlan(plan.id as 'trial' | 'premium');
            }}
            activeOpacity={0.7}
          >
            {plan.recommended && (
              <View style={[styles.recommendedBadge, { backgroundColor: colors.primary }]}>
                <IconSymbol
                  ios_icon_name="star.fill"
                  android_material_icon_name="star"
                  size={14}
                  color="#FFFFFF"
                />
                <Text style={styles.recommendedText}>Recommandé</Text>
              </View>
            )}
            
            <View style={styles.planHeader}>
              <View style={styles.planTitleRow}>
                <Text style={[commonStyles.subtitle, styles.planName]}>
                  {plan.name}
                </Text>
                {selectedPlan === plan.id && (
                  <View style={[styles.selectedBadge, { backgroundColor: plan.color }]}>
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={16}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </View>
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
              Paiement par monnaie numérique disponible prochainement
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.subscribeButton, 
            { backgroundColor: selectedPlan === 'trial' ? colors.primary : colors.accent }
          ]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
        >
          <Text style={styles.subscribeButtonText}>
            {selectedPlan === 'trial' ? 'Commencer l\'essai gratuit' : 'S\'abonner maintenant'}
          </Text>
          <IconSymbol
            ios_icon_name="arrow.right"
            android_material_icon_name="arrow-forward"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.benefitsSection}>
          <Text style={[commonStyles.textBold, styles.benefitsTitle]}>
            Pourquoi choisir Abinarth Formation ?
          </Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <IconSymbol
                ios_icon_name="brain.head.profile"
                android_material_icon_name="psychology"
                size={24}
                color={colors.primary}
              />
              <Text style={commonStyles.text}>
                Méthode d&apos;apprentissage scientifiquement prouvée
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <IconSymbol
                ios_icon_name="chart.line.uptrend.xyaxis"
                android_material_icon_name="trending-up"
                size={24}
                color={colors.primary}
              />
              <Text style={commonStyles.text}>
                Suivi de progression en temps réel
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <IconSymbol
                ios_icon_name="person.2.fill"
                android_material_icon_name="groups"
                size={24}
                color={colors.primary}
              />
              <Text style={commonStyles.text}>
                Rejoignez des milliers d&apos;étudiants en médecine
              </Text>
            </View>
          </View>
        </View>

        <Text style={[commonStyles.textSecondary, styles.disclaimer]}>
          * L&apos;essai gratuit vous donne un accès complet pendant 30 jours. Aucune carte de crédit requise.
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
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(3, 169, 244, 0.2)',
    elevation: 4,
  },
  infoTextContainer: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
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
    boxShadow: '0px 4px 16px rgba(3, 169, 244, 0.3)',
    elevation: 6,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  planHeader: {
    gap: 8,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planName: {
    marginBottom: 0,
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    boxShadow: '0px 4px 12px rgba(3, 169, 244, 0.3)',
    elevation: 5,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  benefitsSection: {
    marginTop: 16,
    gap: 16,
  },
  benefitsTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: colors.border,
    borderRadius: 12,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
});
