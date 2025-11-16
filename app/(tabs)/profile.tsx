
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfileScreen() {
  const theme = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [userName] = useState("Étudiant");
  const [userEmail] = useState("etudiant@abinarth.fr");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="person" 
              size={60} 
              color={colors.primary} 
            />
          </View>
          <Text style={[commonStyles.subtitle, styles.name]}>{userName}</Text>
          <Text style={[commonStyles.textSecondary, styles.email]}>{userEmail}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>{t('myProgress')}</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <IconSymbol
                ios_icon_name="book.fill"
                android_material_icon_name="book"
                size={24}
                color={colors.primary}
              />
              <Text style={commonStyles.text}>0 {t('musclesLearned')}</Text>
            </View>
            <View style={styles.progressItem}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={24}
                color={colors.highlight}
              />
              <Text style={commonStyles.text}>0 {t('totalScore')}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>{t('settings')}</Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="globe"
                android_material_icon_name="language"
                size={24}
                color={colors.textSecondary}
              />
              <Text style={commonStyles.text}>{t('language')}</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={commonStyles.textSecondary}>
                {language === 'fr' ? 'Français' : 'English'}
              </Text>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron-right"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={24}
                color={colors.textSecondary}
              />
              <Text style={commonStyles.text}>Notifications</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>{t('subscription')}</Text>
          <View style={styles.subscriptionInfo}>
            <Text style={commonStyles.text}>{t('currentPlan')}: {t('free')}</Text>
            <TouchableOpacity 
              style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
              activeOpacity={0.8}
            >
              <Text style={styles.upgradeButtonText}>{t('subscribe')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 24,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginBottom: 0,
  },
  email: {
    fontSize: 14,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  progressItem: {
    alignItems: 'center',
    gap: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subscriptionInfo: {
    gap: 12,
  },
  upgradeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: colors.card,
    fontWeight: '600',
    fontSize: 16,
  },
});
