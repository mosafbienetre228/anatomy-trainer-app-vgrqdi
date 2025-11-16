
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const { user, signOut, isAuthenticated, hasTrialAccess, hasPremiumAccess } = useSupabase();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            setSigningOut(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            
            const { error } = await signOut();
            
            if (error) {
              console.error('Sign out error:', error);
              Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
            } else {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.replace('/(tabs)/(home)');
            }
            
            setSigningOut(false);
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person.fill',
      androidIcon: 'person',
      title: t('profile'),
      subtitle: user?.email || 'Non connecté',
      onPress: () => {
        if (!isAuthenticated) {
          router.push('/auth');
        } else {
          console.log('Edit profile');
        }
      },
    },
    {
      icon: 'star.fill',
      androidIcon: 'star',
      title: t('subscription'),
      subtitle: hasTrialAccess ? 'Essai gratuit actif' : hasPremiumAccess ? 'Premium' : 'Gratuit',
      badge: hasTrialAccess ? 'TRIAL' : hasPremiumAccess ? 'PREMIUM' : null,
      badgeColor: hasTrialAccess ? colors.primary : colors.accent,
      onPress: () => router.push('/subscription'),
    },
    {
      icon: 'chart.bar.fill',
      androidIcon: 'bar-chart',
      title: t('progress'),
      subtitle: 'Voir vos statistiques',
      onPress: () => console.log('View progress'),
    },
    {
      icon: 'globe',
      androidIcon: 'language',
      title: t('language'),
      subtitle: 'Français',
      onPress: () => console.log('Change language'),
    },
    {
      icon: 'bell.fill',
      androidIcon: 'notifications',
      title: t('notifications'),
      subtitle: 'Gérer les notifications',
      onPress: () => console.log('Manage notifications'),
    },
    {
      icon: 'questionmark.circle.fill',
      androidIcon: 'help',
      title: t('help'),
      subtitle: 'Centre d\'aide et support',
      onPress: () => console.log('Help center'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[commonStyles.title, styles.headerTitle]}>
          {t('profile')}
        </Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {hasTrialAccess && (
          <View style={[styles.trialBanner, { backgroundColor: colors.primary + '20' }]}>
            <View style={styles.trialIconContainer}>
              <IconSymbol
                ios_icon_name="gift.fill"
                android_material_icon_name="card-giftcard"
                size={32}
                color={colors.primary}
              />
            </View>
            <View style={styles.trialTextContainer}>
              <Text style={[commonStyles.textBold, styles.trialTitle]}>
                Essai gratuit actif ! 🎉
              </Text>
              <Text style={[commonStyles.textSecondary, styles.trialSubtitle]}>
                Accès complet à toutes les fonctionnalités
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={48}
              color={colors.primary}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[commonStyles.subtitle, styles.profileName]}>
              {user?.email?.split('@')[0] || 'Utilisateur'}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {user?.email || 'Non connecté'}
            </Text>
          </View>
          {isAuthenticated && (
            <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
              <Text style={[commonStyles.textBold, { color: colors.success, fontSize: 12 }]}>
                Actif
              </Text>
            </View>
          )}
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.card }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                item.onPress();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: colors.primary + '15' }]}>
                <IconSymbol
                  ios_icon_name={item.icon}
                  android_material_icon_name={item.androidIcon}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={[commonStyles.textBold, styles.menuTitle]}>
                  {item.title}
                </Text>
                <Text style={[commonStyles.textSecondary, styles.menuSubtitle]}>
                  {item.subtitle}
                </Text>
              </View>
              {item.badge && (
                <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {isAuthenticated ? (
          <TouchableOpacity
            style={[styles.signOutButton, { backgroundColor: colors.error + '15' }]}
            onPress={handleSignOut}
            disabled={signingOut}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="arrow.right.square.fill"
              android_material_icon_name="logout"
              size={24}
              color={colors.error}
            />
            <Text style={[commonStyles.textBold, { color: colors.error }]}>
              {signingOut ? 'Déconnexion...' : t('signOut')}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/auth')}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={24}
              color="#FFFFFF"
            />
            <Text style={[commonStyles.textBold, { color: '#FFFFFF' }]}>
              Se connecter
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[commonStyles.textSecondary, styles.version]}>
          Version 1.0.0
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
  },
  headerTitle: {
    marginBottom: 0,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 20,
    paddingBottom: 120,
  },
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(3, 169, 244, 0.2)',
    elevation: 4,
  },
  trialIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trialTextContainer: {
    flex: 1,
  },
  trialTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  trialSubtitle: {
    fontSize: 14,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(3, 169, 244, 0.3)',
    elevation: 5,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
});
