
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import Logo from '@/components/Logo';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      {/* Premium Header with Gradient Background */}
      <Animated.View 
        entering={FadeInUp.duration(600)}
        style={[styles.headerSection, {
          backgroundColor: isDark ? colors.darkCard : '#FFFFFF',
        }]}
      >
        <View style={styles.gradientOverlay}>
          <View style={[styles.gradientCircle, styles.gradientCircle1]} />
          <View style={[styles.gradientCircle, styles.gradientCircle2]} />
          <View style={[styles.gradientCircle, styles.gradientCircle3]} />
        </View>
        
        <View style={styles.headerContent}>
          <Logo size="large" />
          <Text style={[styles.appTitle, { 
            color: isDark ? '#FFFFFF' : colors.text 
          }]}>
            Abinarth Formation
          </Text>
          <Text style={[styles.appSubtitle, {
            color: isDark ? colors.textSecondary : colors.textSecondary
          }]}>
            Maîtrisez l&apos;anatomie avec excellence
          </Text>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>15</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Muscles</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.cardGreen }]}>120</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cartes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.cardOrange }]}>8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Caractéristiques</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Premium Action Cards */}
      <View style={styles.cardsSection}>
        {/* Hero Card - Card Game */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <TouchableOpacity
            style={styles.heroCard}
            onPress={() => router.push('/card-game')}
            activeOpacity={0.9}
          >
            <View style={[styles.heroCardGradient, {
              backgroundColor: colors.primary,
            }]}>
              <View style={styles.heroCardGlow1} />
              <View style={styles.heroCardGlow2} />
              
              <View style={styles.heroCardContent}>
                <View style={styles.heroCardIcon}>
                  <IconSymbol
                    ios_icon_name="gamecontroller.fill"
                    android_material_icon_name="sports-esports"
                    size={48}
                    color="#FFFFFF"
                  />
                </View>
                
                <View style={styles.heroCardText}>
                  <Text style={styles.heroCardTitle}>
                    Jeu de Cartes Anatomie
                  </Text>
                  <Text style={styles.heroCardDescription}>
                    Apprenez de manière interactive avec notre système de cartes innovant
                  </Text>
                </View>
                
                <View style={styles.heroCardArrow}>
                  <IconSymbol
                    ios_icon_name="arrow.right.circle.fill"
                    android_material_icon_name="arrow-circle-right"
                    size={32}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Premium Feature Cards Grid */}
        <View style={styles.featureCardsGrid}>
          <Animated.View 
            entering={FadeInDown.delay(300).duration(600)}
            style={styles.featureCardWrapper}
          >
            <TouchableOpacity
              style={[styles.featureCard, { 
                backgroundColor: isDark ? colors.darkCard : '#FFFFFF' 
              }]}
              onPress={() => router.push('/muscle-list')}
              activeOpacity={0.8}
            >
              <View style={[styles.featureCardIconContainer, { 
                backgroundColor: colors.cardOrange + '15' 
              }]}>
                <IconSymbol
                  ios_icon_name="figure.arms.open"
                  android_material_icon_name="accessibility"
                  size={36}
                  color={colors.cardOrange}
                />
              </View>
              <Text style={[styles.featureCardTitle, { 
                color: isDark ? '#FFFFFF' : colors.text 
              }]}>
                Muscles de l&apos;Épaule
              </Text>
              <Text style={[styles.featureCardDesc, { color: colors.textSecondary }]}>
                15 muscles détaillés
              </Text>
              <View style={[styles.featureCardBadge, { backgroundColor: colors.cardOrange + '20' }]}>
                <Text style={[styles.featureCardBadgeText, { color: colors.cardOrange }]}>
                  Commencer
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.featureCardWrapper}
          >
            <TouchableOpacity
              style={[styles.featureCard, { 
                backgroundColor: isDark ? colors.darkCard : '#FFFFFF' 
              }]}
              onPress={() => router.push('/subscription')}
              activeOpacity={0.8}
            >
              <View style={[styles.featureCardIconContainer, { 
                backgroundColor: colors.cardPurple + '15' 
              }]}>
                <IconSymbol
                  ios_icon_name="crown.fill"
                  android_material_icon_name="workspace-premium"
                  size={36}
                  color={colors.cardPurple}
                />
              </View>
              <Text style={[styles.featureCardTitle, { 
                color: isDark ? '#FFFFFF' : colors.text 
              }]}>
                Premium
              </Text>
              <Text style={[styles.featureCardDesc, { color: colors.textSecondary }]}>
                Accès illimité
              </Text>
              <View style={[styles.featureCardBadge, { backgroundColor: colors.cardPurple + '20' }]}>
                <Text style={[styles.featureCardBadgeText, { color: colors.cardPurple }]}>
                  Découvrir
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Learning Method Card */}
        <Animated.View entering={FadeInDown.delay(500).duration(600)}>
          <View style={[styles.methodCard, { 
            backgroundColor: isDark ? colors.darkCard : '#FFFFFF',
          }]}>
            <View style={styles.methodCardHeader}>
              <View style={[styles.methodCardIcon, { backgroundColor: colors.cardBlue + '15' }]}>
                <IconSymbol
                  ios_icon_name="lightbulb.fill"
                  android_material_icon_name="lightbulb"
                  size={28}
                  color={colors.cardBlue}
                />
              </View>
              <Text style={[styles.methodCardTitle, { 
                color: isDark ? '#FFFFFF' : colors.text 
              }]}>
                Méthode d&apos;Apprentissage
              </Text>
            </View>
            
            <View style={styles.methodSteps}>
              <View style={styles.methodStep}>
                <View style={[styles.methodStepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.methodStepNumberText}>1</Text>
                </View>
                <View style={styles.methodStepContent}>
                  <Text style={[styles.methodStepTitle, { 
                    color: isDark ? '#FFFFFF' : colors.text 
                  }]}>
                    Sélectionnez une carte
                  </Text>
                  <Text style={[styles.methodStepDesc, { color: colors.textSecondary }]}>
                    Choisissez parmi les cartes disponibles
                  </Text>
                </View>
              </View>

              <View style={styles.methodStep}>
                <View style={[styles.methodStepNumber, { backgroundColor: colors.cardGreen }]}>
                  <Text style={styles.methodStepNumberText}>2</Text>
                </View>
                <View style={styles.methodStepContent}>
                  <Text style={[styles.methodStepTitle, { 
                    color: isDark ? '#FFFFFF' : colors.text 
                  }]}>
                    Choisissez la bonne réponse
                  </Text>
                  <Text style={[styles.methodStepDesc, { color: colors.textSecondary }]}>
                    3 options dont une seule est correcte
                  </Text>
                </View>
              </View>

              <View style={styles.methodStep}>
                <View style={[styles.methodStepNumber, { backgroundColor: colors.cardOrange }]}>
                  <Text style={styles.methodStepNumberText}>3</Text>
                </View>
                <View style={styles.methodStepContent}>
                  <Text style={[styles.methodStepTitle, { 
                    color: isDark ? '#FFFFFF' : colors.text 
                  }]}>
                    Placez la carte
                  </Text>
                  <Text style={[styles.methodStepDesc, { color: colors.textSecondary }]}>
                    Déposez dans l&apos;emplacement correspondant
                  </Text>
                </View>
              </View>

              <View style={styles.methodStep}>
                <View style={[styles.methodStepNumber, { backgroundColor: colors.cardPurple }]}>
                  <Text style={styles.methodStepNumberText}>4</Text>
                </View>
                <View style={styles.methodStepContent}>
                  <Text style={[styles.methodStepTitle, { 
                    color: isDark ? '#FFFFFF' : colors.text 
                  }]}>
                    Visualisez le muscle
                  </Text>
                  <Text style={[styles.methodStepDesc, { color: colors.textSecondary }]}>
                    Le dessin se forme progressivement
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Premium Features Showcase */}
        <Animated.View entering={FadeInDown.delay(600).duration(600)}>
          <View style={styles.featuresShowcase}>
            <Text style={[styles.showcaseTitle, { 
              color: isDark ? '#FFFFFF' : colors.text 
            }]}>
              Fonctionnalités Premium
            </Text>
            
            <View style={styles.showcaseGrid}>
              <View style={[styles.showcaseItem, {
                backgroundColor: isDark ? colors.darkCard : '#FFFFFF',
              }]}>
                <View style={[styles.showcaseIcon, { backgroundColor: colors.cardGreen + '15' }]}>
                  <IconSymbol
                    ios_icon_name="brain.head.profile"
                    android_material_icon_name="psychology"
                    size={32}
                    color={colors.cardGreen}
                  />
                </View>
                <Text style={[styles.showcaseItemTitle, { 
                  color: isDark ? '#FFFFFF' : colors.text 
                }]}>
                  Apprentissage Adaptatif
                </Text>
                <Text style={[styles.showcaseItemDesc, { color: colors.textSecondary }]}>
                  Système intelligent qui s&apos;adapte à votre niveau
                </Text>
              </View>

              <View style={[styles.showcaseItem, {
                backgroundColor: isDark ? colors.darkCard : '#FFFFFF',
              }]}>
                <View style={[styles.showcaseIcon, { backgroundColor: colors.cardYellow + '15' }]}>
                  <IconSymbol
                    ios_icon_name="chart.line.uptrend.xyaxis"
                    android_material_icon_name="trending-up"
                    size={32}
                    color={colors.cardYellow}
                  />
                </View>
                <Text style={[styles.showcaseItemTitle, { 
                  color: isDark ? '#FFFFFF' : colors.text 
                }]}>
                  Suivi Détaillé
                </Text>
                <Text style={[styles.showcaseItemDesc, { color: colors.textSecondary }]}>
                  Analysez vos progrès en temps réel
                </Text>
              </View>

              <View style={[styles.showcaseItem, {
                backgroundColor: isDark ? colors.darkCard : '#FFFFFF',
              }]}>
                <View style={[styles.showcaseIcon, { backgroundColor: colors.primary + '15' }]}>
                  <IconSymbol
                    ios_icon_name="photo.fill"
                    android_material_icon_name="image"
                    size={32}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.showcaseItemTitle, { 
                  color: isDark ? '#FFFFFF' : colors.text 
                }]}>
                  Visualisation 3D
                </Text>
                <Text style={[styles.showcaseItemDesc, { color: colors.textSecondary }]}>
                  Dessins anatomiques progressifs
                </Text>
              </View>

              <View style={[styles.showcaseItem, {
                backgroundColor: isDark ? colors.darkCard : '#FFFFFF',
              }]}>
                <View style={[styles.showcaseIcon, { backgroundColor: colors.cardOrange + '15' }]}>
                  <IconSymbol
                    ios_icon_name="trophy.fill"
                    android_material_icon_name="emoji-events"
                    size={32}
                    color={colors.cardOrange}
                  />
                </View>
                <Text style={[styles.showcaseItemTitle, { 
                  color: isDark ? '#FFFFFF' : colors.text 
                }]}>
                  Récompenses
                </Text>
                <Text style={[styles.showcaseItemDesc, { color: colors.textSecondary }]}>
                  Gagnez des badges et trophées
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  headerSection: {
    paddingTop: 20,
    paddingBottom: 32,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
    elevation: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  gradientCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.08,
  },
  gradientCircle1: {
    width: 300,
    height: 300,
    backgroundColor: colors.primary,
    top: -100,
    right: -100,
  },
  gradientCircle2: {
    width: 200,
    height: 200,
    backgroundColor: colors.cardPurple,
    bottom: -50,
    left: -50,
  },
  gradientCircle3: {
    width: 150,
    height: 150,
    backgroundColor: colors.cardOrange,
    top: 50,
    left: 50,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  cardsSection: {
    padding: 20,
    gap: 20,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 12px 40px rgba(3, 169, 244, 0.3)',
    elevation: 12,
  },
  heroCardGradient: {
    padding: 24,
    minHeight: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  heroCardGlow1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    top: -50,
    right: -50,
  },
  heroCardGlow2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -30,
    left: -30,
  },
  heroCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroCardIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCardText: {
    flex: 1,
    gap: 8,
  },
  heroCardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  heroCardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: 20,
  },
  heroCardArrow: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCardsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  featureCardWrapper: {
    flex: 1,
  },
  featureCard: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
    elevation: 6,
    minHeight: 200,
  },
  featureCardIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  featureCardDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureCardBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 'auto',
  },
  featureCardBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  methodCard: {
    padding: 24,
    borderRadius: 20,
    gap: 20,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
    elevation: 6,
  },
  methodCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodCardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  methodSteps: {
    gap: 16,
  },
  methodStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  methodStepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodStepNumberText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  methodStepContent: {
    flex: 1,
    gap: 4,
  },
  methodStepTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  methodStepDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  featuresShowcase: {
    gap: 20,
  },
  showcaseTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  showcaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  showcaseItem: {
    width: (SCREEN_WIDTH - 56) / 2,
    padding: 20,
    borderRadius: 16,
    gap: 12,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
    elevation: 4,
  },
  showcaseIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showcaseItemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  showcaseItemDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
});
