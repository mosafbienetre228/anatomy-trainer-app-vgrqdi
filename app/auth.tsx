
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useSupabase } from '@/contexts/SupabaseContext';
import * as Haptics from 'expo-haptics';

export default function AuthScreen() {
  const theme = useTheme();
  const { signIn, signUp } = useSupabase();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Sign in error:', error);
          Alert.alert(
            'Erreur de connexion',
            error.message || 'Une erreur est survenue lors de la connexion'
          );
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert(
            'Connexion réussie ! 🎉',
            'Bienvenue sur Abinarth Formation',
            [
              {
                text: 'Continuer',
                onPress: () => router.replace('/(tabs)/(home)'),
              },
            ]
          );
        }
      } else {
        const { error } = await signUp(email, password);
        
        if (error) {
          console.error('Sign up error:', error);
          Alert.alert(
            'Erreur d\'inscription',
            error.message || 'Une erreur est survenue lors de l\'inscription'
          );
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert(
            'Inscription réussie ! 🎉',
            'Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.',
            [
              {
                text: 'OK',
                onPress: () => {
                  setIsLogin(true);
                  setPassword('');
                },
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert(
        'Erreur',
        'Une erreur inattendue est survenue. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
          </View>

          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol
                ios_icon_name="person.circle.fill"
                android_material_icon_name="account-circle"
                size={80}
                color={colors.primary}
              />
            </View>

            <Text style={styles.title}>
              {isLogin ? 'Connexion' : 'Inscription'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'Connectez-vous pour accéder à votre compte' 
                : 'Créez un compte pour commencer votre apprentissage'}
            </Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <IconSymbol
                  ios_icon_name="envelope.fill"
                  android_material_icon_name="email"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <IconSymbol
                  ios_icon_name="lock.fill"
                  android_material_icon_name="lock"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Mot de passe"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: colors.primary }]}
                onPress={handleAuth}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'Se connecter' : 'S\'inscrire'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => {
                  setIsLogin(!isLogin);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                disabled={loading}
              >
                <Text style={[styles.switchButtonText, { color: colors.text }]}>
                  {isLogin 
                    ? 'Pas encore de compte ? ' 
                    : 'Déjà un compte ? '}
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>
                    {isLogin ? 'S\'inscrire' : 'Se connecter'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.highlight + '20' }]}>
              <IconSymbol
                ios_icon_name="info.circle.fill"
                android_material_icon_name="info"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.infoText, { color: colors.text }]}>
                Profitez d&apos;un essai gratuit de 30 jours avec accès complet à toutes les fonctionnalités !
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  authButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(3, 169, 244, 0.3)',
    elevation: 5,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  switchButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 15,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 32,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
