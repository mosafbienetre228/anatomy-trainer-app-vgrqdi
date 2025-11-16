
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { useLanguage } from "@/contexts/LanguageContext";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";

export default function ProfileScreen() {
  const theme = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);

  const settingsOptions = [
    {
      id: 'language',
      label: t('language'),
      icon: 'language',
      iosIcon: 'globe',
      value: language === 'fr' ? 'Français' : 'English',
      onPress: () => setLanguage(language === 'fr' ? 'en' : 'fr'),
    },
    {
      id: 'darkMode',
      label: t('darkMode'),
      icon: 'dark-mode',
      iosIcon: 'moon.fill',
      value: darkMode ? 'Activé' : 'Désactivé',
      onPress: () => setDarkMode(!darkMode),
    },
    {
      id: 'notifications',
      label: t('notifications'),
      icon: 'notifications',
      iosIcon: 'bell.fill',
      value: 'Activées',
      onPress: () => console.log('Notifications pressed'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[commonStyles.title, styles.title, { color: theme.colors.text }]}>
            {t('profile')}
          </Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={48}
              color={colors.primary}
            />
          </View>
          <Text style={[commonStyles.subtitle, styles.userName, { color: theme.colors.text }]}>
            Utilisateur
          </Text>
          <Text style={[commonStyles.textSecondary, styles.userEmail]}>
            utilisateur@example.com
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[commonStyles.textBold, styles.sectionTitle, { color: theme.colors.text }]}>
            {t('settings')}
          </Text>
          {settingsOptions.map((option, index) => (
            <React.Fragment key={`setting-${index}`}>
              <TouchableOpacity
                style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.settingIcon, { backgroundColor: colors.primary + '15' }]}>
                  <IconSymbol
                    ios_icon_name={option.iosIcon}
                    android_material_icon_name={option.icon}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[commonStyles.text, styles.settingLabel, { color: theme.colors.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[commonStyles.textSecondary, styles.settingValue]}>
                    {option.value}
                  </Text>
                </View>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron-right"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[commonStyles.textBold, styles.sectionTitle, { color: theme.colors.text }]}>
            Informations
          </Text>
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: theme.colors.card }]}
            onPress={() => console.log('About pressed')}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: colors.secondary + '15' }]}>
              <IconSymbol
                ios_icon_name="info.circle.fill"
                android_material_icon_name="info"
                size={24}
                color={colors.secondary}
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={[commonStyles.text, styles.settingLabel, { color: theme.colors.text }]}>
                {t('about')}
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

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error + '15' }]}
          onPress={() => console.log('Logout pressed')}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="arrow.right.square.fill"
            android_material_icon_name="logout"
            size={24}
            color={colors.error}
          />
          <Text style={[commonStyles.textBold, styles.logoutText, { color: colors.error }]}>
            {t('logout')}
          </Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 0,
  },
  profileCard: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    marginBottom: 32,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
  },
});
