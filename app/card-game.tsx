
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  FadeOut,
  ZoomIn,
  SlideInDown,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Modal, Image } from 'react-native';
import { Muscle } from '@/types/anatomy';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Haptics from 'expo-haptics';
import { shoulderMuscles } from '@/data/shoulderMuscles';
import { colors, commonStyles } from '@/styles/commonStyles';

type CharacteristicKey = 'definition' | 'origin' | 'path' | 'termination' | 'innervation' | 'action' | 'relations' | 'clinicalApplications';

interface AnswerOption {
  id: string;
  content: string;
  isCorrect: boolean;
  muscleId: string;
}

interface AnswerCard {
  id: string;
  muscleId: string;
  characteristic: CharacteristicKey;
  options: AnswerOption[];
  label: string;
}

interface PlacedCard {
  characteristic: CharacteristicKey;
  card: AnswerCard;
  selectedOption: AnswerOption;
}

const CARD_WIDTH = Dimensions.get('window').width - 40;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CardGameScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const isDark = theme.dark;

  const [currentMuscleIndex, setCurrentMuscleIndex] = useState(0);
  const [availableCards, setAvailableCards] = useState<AnswerCard[]>([]);
  const [placedCards, setPlacedCards] = useState<PlacedCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<AnswerCard | null>(null);
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);

  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const muscleImageOpacity = useSharedValue(0);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    // Animate muscle image opacity based on progress
    const progress = placedCards.length / 8;
    muscleImageOpacity.value = withSpring(progress);
  }, [placedCards.length]);

  const generateWrongOptions = (correctContent: string, characteristic: CharacteristicKey, currentMuscleId: string): string[] => {
    // Get wrong answers from other muscles
    const otherMuscles = shoulderMuscles.filter(m => m.id !== currentMuscleId);
    const wrongOptions: string[] = [];
    
    // Shuffle other muscles
    const shuffled = [...otherMuscles].sort(() => Math.random() - 0.5);
    
    // Take 2 wrong answers
    for (let i = 0; i < Math.min(2, shuffled.length); i++) {
      const wrongContent = shuffled[i][characteristic];
      if (wrongContent && wrongContent !== correctContent) {
        wrongOptions.push(wrongContent);
      }
    }
    
    return wrongOptions;
  };

  const initializeGame = () => {
    console.log('Initializing card game...');
    const currentMuscle = shoulderMuscles[currentMuscleIndex];
    
    const characteristics: CharacteristicKey[] = [
      'definition',
      'origin',
      'path',
      'termination',
      'innervation',
      'action',
      'relations',
      'clinicalApplications',
    ];

    const cards: AnswerCard[] = characteristics.map(char => {
      const correctContent = currentMuscle[char];
      const wrongOptions = generateWrongOptions(correctContent, char, currentMuscle.id);
      
      // Create options array with correct answer and 2 wrong answers
      const options: AnswerOption[] = [
        {
          id: `${currentMuscle.id}-${char}-correct`,
          content: correctContent,
          isCorrect: true,
          muscleId: currentMuscle.id,
        },
        ...wrongOptions.map((wrongContent, index) => ({
          id: `${currentMuscle.id}-${char}-wrong-${index}`,
          content: wrongContent,
          isCorrect: false,
          muscleId: currentMuscle.id,
        }))
      ];

      // Shuffle options
      const shuffledOptions = [...options].sort(() => Math.random() - 0.5);

      return {
        id: `${currentMuscle.id}-${char}`,
        muscleId: currentMuscle.id,
        characteristic: char,
        options: shuffledOptions,
        label: getCharacteristicLabel(char),
      };
    });

    // Shuffle cards using Fisher-Yates algorithm for better randomization
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    console.log('Cards shuffled:', shuffled.map(c => c.label));
    setAvailableCards(shuffled);
    setPlacedCards([]);
    setSelectedCard(null);
    setSelectedOption(null);
    muscleImageOpacity.value = 0;
  };

  const getCharacteristicLabel = (char: CharacteristicKey): string => {
    const labels = {
      definition: 'Définition',
      origin: 'Origine',
      path: 'Trajet',
      termination: 'Terminaison',
      innervation: 'Innervation',
      action: 'Action',
      relations: 'Rapports',
      clinicalApplications: 'Applications cliniques',
    };
    return labels[char];
  };

  const handleCardSelect = (card: AnswerCard) => {
    console.log('Card selected:', card.label);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCard(card);
    setSelectedOption(null); // Reset option selection when selecting a new card
    
    scale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );
  };

  const handleOptionSelect = (option: AnswerOption) => {
    console.log('Option selected:', option.content.substring(0, 30) + '...');
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedOption(option);
  };

  const handlePlaceCard = (characteristic: CharacteristicKey) => {
    if (!selectedCard || !selectedOption) {
      console.log('No card or option selected');
      return;
    }

    if (selectedCard.characteristic === characteristic && selectedOption.isCorrect) {
      console.log('Correct placement!');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      setPlacedCards([...placedCards, { 
        characteristic, 
        card: selectedCard,
        selectedOption: selectedOption 
      }]);
      setAvailableCards(availableCards.filter(c => c.id !== selectedCard.id));
      setSelectedCard(null);
      setSelectedOption(null);

      rotation.value = withSequence(
        withTiming(360, { duration: 500 }),
        withTiming(0, { duration: 0 })
      );

      if (placedCards.length === 7) {
        console.log('Muscle complete!');
        setTimeout(() => {
          setShowCongrats(true);
        }, 500);
      }
    } else {
      console.log('Incorrect placement');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleContinueToNextMuscle = () => {
    console.log('Moving to next muscle...');
    setShowCongrats(false);
    
    if (currentMuscleIndex < shoulderMuscles.length - 1) {
      setCurrentMuscleIndex(currentMuscleIndex + 1);
      setTimeout(() => {
        initializeGame();
      }, 300);
    } else {
      console.log('All muscles completed!');
      setShowGameComplete(true);
    }
  };

  const handleGameComplete = () => {
    console.log('Game completed!');
    setShowGameComplete(false);
    router.back();
  };

  const handleFinishGame = () => {
    console.log('Finishing game early...');
    router.back();
  };

  const currentMuscle = shoulderMuscles[currentMuscleIndex];
  const characteristics: CharacteristicKey[] = [
    'definition',
    'origin',
    'path',
    'termination',
    'innervation',
    'action',
    'relations',
    'clinicalApplications',
  ];

  const characteristicColors = {
    definition: colors.cardBlue,
    origin: colors.cardGreen,
    path: colors.cardYellow,
    termination: colors.cardOrange,
    innervation: colors.cardPurple,
    action: colors.primary,
    relations: colors.secondary,
    clinicalApplications: colors.accent,
  };

  const characteristicIcons = {
    definition: { ios: 'book.fill', android: 'menu-book' },
    origin: { ios: 'arrow.up.circle.fill', android: 'arrow-upward' },
    path: { ios: 'arrow.right.circle.fill', android: 'arrow-forward' },
    termination: { ios: 'arrow.down.circle.fill', android: 'arrow-downward' },
    innervation: { ios: 'bolt.fill', android: 'flash-on' },
    action: { ios: 'figure.walk', android: 'directions-run' },
    relations: { ios: 'link.circle.fill', android: 'link' },
    clinicalApplications: { ios: 'cross.case.fill', android: 'local-hospital' },
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const muscleImageStyle = useAnimatedStyle(() => {
    return {
      opacity: muscleImageOpacity.value,
    };
  });

  const progressPercentage = Math.round((placedCards.length / 8) * 100);

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: isDark ? colors.darkBackground : colors.background 
    }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: isDark ? colors.darkCard : colors.card 
      }]}>
        <TouchableOpacity onPress={handleFinishGame} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={isDark ? '#FFFFFF' : colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.muscleName, { 
            color: isDark ? '#FFFFFF' : colors.text 
          }]}>
            {currentMuscle.name}
          </Text>
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            Muscle {currentMuscleIndex + 1} / {shoulderMuscles.length}
          </Text>
        </View>
        <View style={styles.scoreContainer}>
          <IconSymbol
            ios_icon_name="star.fill"
            android_material_icon_name="star"
            size={20}
            color={colors.cardYellow}
          />
          <Text style={[styles.score, { 
            color: isDark ? '#FFFFFF' : colors.text 
          }]}>
            {placedCards.length}/8
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarBackground, {
            backgroundColor: isDark ? colors.darkCard : colors.card,
          }]}>
            <Animated.View 
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: colors.primary,
                }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { 
            color: isDark ? '#FFFFFF' : colors.text 
          }]}>
            {progressPercentage}% complété
          </Text>
        </View>

        {/* Muscle Image Formation - Progressive drawing as cards are placed */}
        <Animated.View style={[styles.muscleImageContainer, muscleImageStyle]}>
          <View style={[styles.muscleImageCard, {
            backgroundColor: isDark ? colors.darkCard : colors.card,
          }]}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&h=400&fit=crop' }}
              style={styles.muscleImage}
              resizeMode="cover"
            />
            <View style={styles.muscleImageOverlay}>
              <IconSymbol
                ios_icon_name="heart.fill"
                android_material_icon_name="favorite"
                size={64}
                color={colors.primary}
              />
              <Text style={[styles.muscleImageText, { 
                color: isDark ? '#FFFFFF' : colors.text 
              }]}>
                {currentMuscle.name}
              </Text>
              <Text style={[styles.muscleImageSubtext, { color: colors.textSecondary }]}>
                Dessin progressif: {progressPercentage}%
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Game Board - Central muscle card with surrounding slots */}
        <View style={styles.gameBoard}>
          <View style={[styles.muscleCenterCard, {
            backgroundColor: isDark ? colors.darkCard : colors.card,
          }]}>
            <View style={[styles.muscleCenterIcon, {
              backgroundColor: colors.primary + '20',
            }]}>
              <IconSymbol
                ios_icon_name="heart.fill"
                android_material_icon_name="favorite"
                size={48}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.muscleCenterText, { 
              color: isDark ? '#FFFFFF' : colors.text 
            }]}>
              {currentMuscle.name}
            </Text>
            <Text style={[styles.muscleCenterSubtext, { color: colors.textSecondary }]}>
              {currentMuscle.region}
            </Text>
          </View>

          {/* Characteristic slots arranged around the center with exact anatomy icons */}
          <View style={styles.slotsContainer}>
            {characteristics.map((char, index) => {
              const placedCard = placedCards.find(p => p.characteristic === char);
              const charColor = characteristicColors[char];
              const charIcon = characteristicIcons[char];
              
              return (
                <TouchableOpacity
                  key={char}
                  style={[
                    styles.slot,
                    {
                      backgroundColor: placedCard 
                        ? charColor + '20'
                        : isDark ? colors.darkCard : colors.card,
                      borderColor: placedCard ? charColor : colors.border,
                      borderWidth: 2,
                    }
                  ]}
                  onPress={() => handlePlaceCard(char)}
                  activeOpacity={0.7}
                >
                  {placedCard ? (
                    <Animated.View 
                      entering={ZoomIn.duration(300)}
                      style={styles.placedCardContent}
                    >
                      <View style={[styles.placedCardIcon, { backgroundColor: charColor }]}>
                        <IconSymbol
                          ios_icon_name={charIcon.ios}
                          android_material_icon_name={charIcon.android}
                          size={20}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text style={[styles.slotLabel, { color: charColor }]}>
                        {placedCard.card.label}
                      </Text>
                    </Animated.View>
                  ) : (
                    <View style={styles.emptySlotContent}>
                      <View style={[styles.emptySlotIcon, { 
                        borderColor: charColor,
                        backgroundColor: charColor + '10',
                      }]}>
                        <IconSymbol
                          ios_icon_name={charIcon.ios}
                          android_material_icon_name={charIcon.android}
                          size={24}
                          color={charColor}
                        />
                      </View>
                      <Text style={[styles.slotLabel, { color: colors.textSecondary }]}>
                        {getCharacteristicLabel(char)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Available Cards with Multiple Choice Options */}
        <View style={styles.cardsSection}>
          <View style={styles.cardsSectionHeader}>
            <Text style={[styles.sectionTitle, { 
              color: isDark ? '#FFFFFF' : colors.text 
            }]}>
              Cartes disponibles
            </Text>
            <View style={[styles.cardCountBadge, {
              backgroundColor: colors.primary + '20',
            }]}>
              <Text style={[styles.cardCountText, { color: colors.primary }]}>
                {availableCards.length}
              </Text>
            </View>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {availableCards.map((card, index) => {
              const isSelected = selectedCard?.id === card.id;
              const cardColor = characteristicColors[card.characteristic];
              const charIcon = characteristicIcons[card.characteristic];
              
              return (
                <TouchableOpacity
                  key={card.id}
                  onPress={() => handleCardSelect(card)}
                  activeOpacity={0.8}
                >
                  <Animated.View
                    entering={SlideInDown.delay(index * 50).duration(300)}
                    style={[
                      styles.answerCard,
                      {
                        backgroundColor: isDark ? colors.darkCard : colors.card,
                        borderColor: isSelected ? cardColor : colors.border,
                        borderWidth: isSelected ? 3 : 1,
                        boxShadow: isSelected 
                          ? `0px 8px 24px ${cardColor}40`
                          : '0px 4px 12px rgba(0, 0, 0, 0.1)',
                      },
                      isSelected && animatedStyle,
                    ]}
                  >
                    <View style={[styles.cardHeader, { 
                      backgroundColor: cardColor + '20',
                      borderBottomColor: cardColor + '40',
                      borderBottomWidth: 1,
                    }]}>
                      <IconSymbol
                        ios_icon_name={charIcon.ios}
                        android_material_icon_name={charIcon.android}
                        size={24}
                        color={cardColor}
                      />
                      <Text style={[styles.cardLabel, { color: cardColor }]}>
                        {card.label}
                      </Text>
                    </View>
                    
                    {/* Multiple Choice Options */}
                    <View style={styles.optionsContainer}>
                      <Text style={[styles.optionsTitle, { 
                        color: isDark ? '#FFFFFF' : colors.text 
                      }]}>
                        Choisissez la bonne réponse:
                      </Text>
                      {card.options.map((option, optionIndex) => {
                        const isOptionSelected = selectedOption?.id === option.id && isSelected;
                        return (
                          <TouchableOpacity
                            key={option.id}
                            style={[
                              styles.optionButton,
                              {
                                backgroundColor: isOptionSelected 
                                  ? cardColor + '20'
                                  : isDark ? colors.darkBackground : colors.background,
                                borderColor: isOptionSelected ? cardColor : colors.border,
                                borderWidth: isOptionSelected ? 2 : 1,
                              }
                            ]}
                            onPress={() => {
                              if (isSelected) {
                                handleOptionSelect(option);
                              }
                            }}
                            disabled={!isSelected}
                          >
                            <View style={styles.optionContent}>
                              <View style={[styles.optionNumber, {
                                backgroundColor: isOptionSelected ? cardColor : colors.textSecondary + '20',
                              }]}>
                                <Text style={[styles.optionNumberText, {
                                  color: isOptionSelected ? '#FFFFFF' : colors.textSecondary,
                                }]}>
                                  {optionIndex + 1}
                                </Text>
                              </View>
                              <Text 
                                style={[
                                  styles.optionText, 
                                  { 
                                    color: isOptionSelected 
                                      ? cardColor 
                                      : isDark ? '#FFFFFF' : colors.text 
                                  }
                                ]} 
                                numberOfLines={3}
                              >
                                {option.content}
                              </Text>
                            </View>
                            {isOptionSelected && (
                              <IconSymbol
                                ios_icon_name="checkmark.circle.fill"
                                android_material_icon_name="check-circle"
                                size={20}
                                color={cardColor}
                              />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                    
                    {isSelected && selectedOption && (
                      <View style={[styles.selectedBadge, { backgroundColor: cardColor }]}>
                        <IconSymbol
                          ios_icon_name="hand.tap.fill"
                          android_material_icon_name="touch-app"
                          size={16}
                          color="#FFFFFF"
                        />
                        <Text style={styles.selectedBadgeText}>Prêt à placer</Text>
                      </View>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Congratulations Modal */}
      <Modal
        visible={showCongrats}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCongrats(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={ZoomIn.duration(400)}
            style={[styles.modalContent, {
              backgroundColor: isDark ? colors.darkCard : colors.card,
            }]}
          >
            <View style={[styles.modalIcon, { backgroundColor: colors.success + '20' }]}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check-circle"
                size={64}
                color={colors.success}
              />
            </View>
            <Text style={[styles.modalTitle, { 
              color: isDark ? '#FFFFFF' : colors.text 
            }]}>
              Félicitations ! 🎉
            </Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Vous avez complété toutes les caractéristiques de {currentMuscle.name} !
            </Text>
            
            {/* Completed Muscle Image - Fully drawn */}
            <View style={[styles.completedMuscleCard, {
              backgroundColor: isDark ? colors.darkBackground : colors.background,
            }]}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=300&h=300&fit=crop' }}
                style={styles.completedMuscleImage}
                resizeMode="cover"
              />
              <View style={styles.completedMuscleOverlay}>
                <IconSymbol
                  ios_icon_name="checkmark.seal.fill"
                  android_material_icon_name="verified"
                  size={48}
                  color={colors.success}
                />
                <Text style={styles.completedMuscleText}>
                  Muscle complet !
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleContinueToNextMuscle}
            >
              <Text style={styles.modalButtonText}>
                {currentMuscleIndex < shoulderMuscles.length - 1 
                  ? 'Muscle suivant' 
                  : 'Terminer'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Game Complete Modal */}
      <Modal
        visible={showGameComplete}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGameComplete(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            entering={ZoomIn.duration(400)}
            style={[styles.modalContent, {
              backgroundColor: isDark ? colors.darkCard : colors.card,
            }]}
          >
            <View style={[styles.modalIcon, { backgroundColor: colors.cardYellow + '20' }]}>
              <IconSymbol
                ios_icon_name="trophy.fill"
                android_material_icon_name="emoji-events"
                size={64}
                color={colors.cardYellow}
              />
            </View>
            <Text style={[styles.modalTitle, { 
              color: isDark ? '#FFFFFF' : colors.text 
            }]}>
              Bravo ! 🏆
            </Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Vous avez terminé tous les muscles de l&apos;épaule ! Excellent travail !
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={handleGameComplete}
            >
              <Text style={styles.modalButtonText}>Retour à l&apos;accueil</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  muscleName: {
    fontSize: 18,
    fontWeight: '700',
  },
  progress: {
    fontSize: 13,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.cardYellow + '20',
  },
  score: {
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  progressBarContainer: {
    marginBottom: 24,
    gap: 8,
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  muscleImageContainer: {
    marginBottom: 24,
  },
  muscleImageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    boxShadow: '0px 8px 24px rgba(3, 169, 244, 0.2)',
    elevation: 8,
  },
  muscleImage: {
    width: '100%',
    height: '100%',
  },
  muscleImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 169, 244, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  muscleImageText: {
    fontSize: 24,
    fontWeight: '800',
  },
  muscleImageSubtext: {
    fontSize: 14,
    fontWeight: '600',
  },
  gameBoard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  muscleCenterCard: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 8px 24px rgba(3, 169, 244, 0.2)',
    elevation: 8,
    marginBottom: 24,
  },
  muscleCenterIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleCenterText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  muscleCenterSubtext: {
    fontSize: 12,
    fontWeight: '600',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    maxWidth: CARD_WIDTH,
  },
  slot: {
    width: (CARD_WIDTH - 36) / 2,
    minHeight: 90,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placedCardContent: {
    alignItems: 'center',
    gap: 8,
  },
  placedCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotContent: {
    alignItems: 'center',
    gap: 8,
  },
  emptySlotIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardsSection: {
    gap: 16,
  },
  cardsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardCountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardsContainer: {
    gap: 16,
    paddingRight: 20,
  },
  answerCard: {
    width: CARD_WIDTH * 0.85,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  cardHeader: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  optionsContainer: {
    padding: 16,
    gap: 12,
  },
  optionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 20,
    boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.3)',
    elevation: 12,
  },
  modalIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  completedMuscleCard: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
  },
  completedMuscleImage: {
    width: '100%',
    height: '100%',
  },
  completedMuscleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  completedMuscleText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
