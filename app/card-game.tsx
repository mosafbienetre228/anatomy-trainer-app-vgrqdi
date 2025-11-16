
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import { shoulderMuscles } from '@/data/shoulderMuscles';
import { useLanguage } from '@/contexts/LanguageContext';
import { Muscle } from '@/types/anatomy';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

type CharacteristicKey = 'definition' | 'origin' | 'path' | 'termination' | 'innervation' | 'action' | 'relations' | 'clinicalApplications';

interface AnswerCard {
  id: string;
  muscleId: string;
  characteristic: CharacteristicKey;
  content: string;
  label: string;
}

interface PlacedCard {
  characteristic: CharacteristicKey;
  card: AnswerCard;
}

export default function CardGameScreen() {
  const theme = useTheme();
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  
  const [currentMuscleIndex, setCurrentMuscleIndex] = useState(0);
  const [selectedMuscles, setSelectedMuscles] = useState<Muscle[]>([]);
  const [answerCards, setAnswerCards] = useState<AnswerCard[]>([]);
  const [placedCards, setPlacedCards] = useState<PlacedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<AnswerCard | null>(null);
  const [score, setScore] = useState(0);
  const [gameStartTime] = useState(new Date());
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [showFinalCongratsModal, setShowFinalCongratsModal] = useState(false);

  const characteristics: { key: CharacteristicKey; label: string }[] = [
    { key: 'definition', label: t('definition') },
    { key: 'origin', label: t('origin') },
    { key: 'path', label: t('path') },
    { key: 'termination', label: t('termination') },
    { key: 'innervation', label: t('innervation') },
    { key: 'action', label: t('action') },
    { key: 'relations', label: t('relations') },
    { key: 'clinicalApplications', label: t('clinicalApplications') },
  ];

  useEffect(() => {
    console.log('CardGameScreen: Initializing game');
    initializeGame();
  }, []);

  const initializeGame = () => {
    console.log('CardGameScreen: Setting up game with 5 muscles');
    const musclesToStudy = shoulderMuscles.slice(0, 5);
    setSelectedMuscles(musclesToStudy);
    
    const cards: AnswerCard[] = [];
    musclesToStudy.forEach((muscle) => {
      characteristics.forEach((char) => {
        cards.push({
          id: `${muscle.id}-${char.key}`,
          muscleId: muscle.id,
          characteristic: char.key,
          content: muscle[char.key],
          label: char.label,
        });
      });
    });
    
    const shuffled = cards.sort(() => Math.random() - 0.5);
    console.log('CardGameScreen: Created', shuffled.length, 'answer cards');
    setAnswerCards(shuffled);
  };

  const handleCardSelect = (card: AnswerCard) => {
    console.log('CardGameScreen: Card selected:', card.label);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCard(card);
  };

  const handlePlaceCard = (characteristic: CharacteristicKey) => {
    if (!selectedCard) {
      console.log('CardGameScreen: No card selected');
      return;
    }
    
    const currentMuscle = selectedMuscles[currentMuscleIndex];
    const isCorrect = selectedCard.muscleId === currentMuscle.id && 
                     selectedCard.characteristic === characteristic;
    
    console.log('CardGameScreen: Placing card', selectedCard.label, 'in', characteristic, '- Correct:', isCorrect);
    
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      const newPlacedCards = [...placedCards, { characteristic, card: selectedCard }];
      setPlacedCards(newPlacedCards);
      setAnswerCards(answerCards.filter(c => c.id !== selectedCard.id));
      setScore(score + 10);
      
      console.log('CardGameScreen: Placed cards:', newPlacedCards.length, '/', characteristics.length);
      
      // Check if muscle is complete
      if (newPlacedCards.length === characteristics.length) {
        console.log('CardGameScreen: Muscle complete! Current index:', currentMuscleIndex, '/', selectedMuscles.length - 1);
        setTimeout(() => {
          if (currentMuscleIndex < selectedMuscles.length - 1) {
            // Show congratulations for completing this muscle
            console.log('CardGameScreen: Showing muscle completion modal');
            setShowCongratsModal(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            // Show final congratulations for completing all muscles
            console.log('CardGameScreen: Showing final completion modal');
            handleGameComplete();
          }
        }, 500);
      }
    } else {
      console.log('CardGameScreen: Incorrect placement');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    setSelectedCard(null);
  };

  const handleContinueToNextMuscle = () => {
    console.log('CardGameScreen: Continuing to next muscle');
    setShowCongratsModal(false);
    setCurrentMuscleIndex(currentMuscleIndex + 1);
    setPlacedCards([]);
  };

  const handleGameComplete = () => {
    console.log('CardGameScreen: Game completed! Final score:', score);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowFinalCongratsModal(true);
  };

  const handleFinishGame = () => {
    console.log('CardGameScreen: Finishing game and returning');
    setShowFinalCongratsModal(false);
    router.back();
  };

  const currentMuscle = selectedMuscles[currentMuscleIndex];

  if (!currentMuscle) {
    console.log('CardGameScreen: No current muscle, returning null');
    return null;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            console.log('CardGameScreen: Back button pressed');
            router.back();
          }}
          style={styles.backButton}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[commonStyles.subtitle, styles.headerTitle]}>
            Jeu de cartes
          </Text>
          <Text style={[commonStyles.textSecondary, styles.headerSubtitle]}>
            Muscle {currentMuscleIndex + 1}/{selectedMuscles.length}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <Text style={[commonStyles.textBold, styles.scoreText]}>{score}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: colors.primary,
                width: `${((currentMuscleIndex * characteristics.length + placedCards.length) / (selectedMuscles.length * characteristics.length)) * 100}%`
              }
            ]} 
          />
        </View>

        <View style={[styles.referenceCard, { backgroundColor: colors.card }]}>
          <View style={[styles.referenceHeader, { backgroundColor: colors.primary }]}>
            <IconSymbol
              ios_icon_name="figure.arms.open"
              android_material_icon_name="accessibility"
              size={24}
              color="#FFFFFF"
            />
            <Text style={[commonStyles.subtitle, styles.referenceTitle]}>
              {currentMuscle.name}
            </Text>
          </View>
          
          <View style={styles.gameBoard}>
            {characteristics.map((char, index) => {
              const placedCard = placedCards.find(p => p.characteristic === char.key);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.slot,
                    { backgroundColor: placedCard ? colors.success + '20' : colors.border },
                    selectedCard && !placedCard && styles.slotActive,
                  ]}
                  onPress={() => selectedCard && !placedCard && handlePlaceCard(char.key)}
                  disabled={!selectedCard || !!placedCard}
                  activeOpacity={0.7}
                >
                  <Text style={[commonStyles.textBold, styles.slotLabel]}>
                    {char.label}
                  </Text>
                  {placedCard ? (
                    <View style={styles.placedCardContent}>
                      <IconSymbol
                        ios_icon_name="checkmark.circle.fill"
                        android_material_icon_name="check-circle"
                        size={20}
                        color={colors.success}
                      />
                      <Text style={[commonStyles.textSecondary, styles.placedText]} numberOfLines={2}>
                        {placedCard.card.content}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.emptySlot}>
                      <IconSymbol
                        ios_icon_name="plus.circle"
                        android_material_icon_name="add-circle-outline"
                        size={32}
                        color={colors.textSecondary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.cardsSection}>
          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>
            Cartes réponses
          </Text>
          <Text style={[commonStyles.textSecondary, styles.sectionSubtitle]}>
            Sélectionnez une carte et placez-la dans la bonne case
          </Text>
          
          <View style={styles.cardsGrid}>
            {answerCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerCard,
                  { backgroundColor: colors.card },
                  selectedCard?.id === card.id && styles.answerCardSelected,
                ]}
                onPress={() => handleCardSelect(card)}
                activeOpacity={0.7}
              >
                <View style={[styles.cardHeader, { backgroundColor: colors.secondary + '20' }]}>
                  <Text style={[commonStyles.textBold, styles.cardLabel]}>
                    {card.label}
                  </Text>
                </View>
                <Text style={[commonStyles.textSecondary, styles.cardContent]} numberOfLines={3}>
                  {card.content}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Congratulations Modal for completing a muscle */}
      <Modal
        visible={showCongratsModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          console.log('CardGameScreen: Congrats modal close requested');
          setShowCongratsModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={ZoomIn.duration(400)}
            style={[styles.modalContent, { backgroundColor: colors.card }]}
          >
            <View style={[styles.modalIconContainer, { backgroundColor: colors.success + '20' }]}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={64}
                color={colors.success}
              />
            </View>
            
            <Text style={[commonStyles.title, styles.modalTitle]}>
              Félicitations ! 🎉
            </Text>
            
            <Text style={[commonStyles.text, styles.modalText]}>
              Vous avez complété le muscle {currentMuscle.name} avec succès !
            </Text>
            
            <View style={styles.modalStats}>
              <View style={styles.statItem}>
                <Text style={[commonStyles.textBold, styles.statValue]}>{characteristics.length}</Text>
                <Text style={commonStyles.textSecondary}>Cartes placées</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[commonStyles.textBold, styles.statValue]}>{score}</Text>
                <Text style={commonStyles.textSecondary}>Points</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleContinueToNextMuscle}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>
                Continuer au muscle suivant
              </Text>
              <IconSymbol
                ios_icon_name="arrow.right"
                android_material_icon_name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Final Congratulations Modal for completing all muscles */}
      <Modal
        visible={showFinalCongratsModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          console.log('CardGameScreen: Final congrats modal close requested');
          setShowFinalCongratsModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={ZoomIn.duration(400)}
            style={[styles.modalContent, { backgroundColor: colors.card }]}
          >
            <View style={[styles.modalIconContainer, { backgroundColor: colors.accent + '20' }]}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={64}
                color={colors.accent}
              />
            </View>
            
            <Text style={[commonStyles.title, styles.modalTitle]}>
              Bravo ! Module terminé ! 🏆
            </Text>
            
            <Text style={[commonStyles.text, styles.modalText]}>
              Vous avez complété tous les muscles de l&apos;épaule avec succès !
            </Text>
            
            <View style={styles.modalStats}>
              <View style={styles.statItem}>
                <Text style={[commonStyles.textBold, styles.statValue]}>{selectedMuscles.length}</Text>
                <Text style={commonStyles.textSecondary}>Muscles maîtrisés</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[commonStyles.textBold, styles.statValue]}>{score}</Text>
                <Text style={commonStyles.textSecondary}>Score total</Text>
              </View>
            </View>

            <View style={[styles.achievementBanner, { backgroundColor: colors.highlight + '20' }]}>
              <IconSymbol
                ios_icon_name="trophy.fill"
                android_material_icon_name="emoji-events"
                size={32}
                color={colors.accent}
              />
              <View style={styles.achievementText}>
                <Text style={[commonStyles.textBold, styles.achievementTitle]}>
                  Nouveau badge débloqué !
                </Text>
                <Text style={commonStyles.textSecondary}>
                  Expert de l&apos;épaule
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.accent }]}
              onPress={handleFinishGame}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>
                Terminer
              </Text>
              <IconSymbol
                ios_icon_name="checkmark"
                android_material_icon_name="check"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    marginBottom: 0,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  scoreContainer: {
    width: 50,
    height: 40,
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: colors.primary,
    fontSize: 18,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  referenceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  referenceTitle: {
    color: '#FFFFFF',
    marginBottom: 0,
  },
  gameBoard: {
    padding: 16,
    gap: 12,
  },
  slot: {
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  slotActive: {
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  slotLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.text,
  },
  emptySlot: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  placedCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  placedText: {
    flex: 1,
    fontSize: 13,
  },
  cardsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  answerCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  answerCardSelected: {
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(3, 169, 244, 0.3)',
    elevation: 6,
  },
  cardHeader: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.secondary,
    textAlign: 'center',
  },
  cardContent: {
    fontSize: 12,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.3)',
    elevation: 10,
  },
  modalIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.border,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    color: colors.primary,
    marginBottom: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.textSecondary,
    opacity: 0.3,
  },
  achievementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 24,
    gap: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    gap: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
