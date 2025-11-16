
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
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
    initializeGame();
  }, []);

  const initializeGame = () => {
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
    setAnswerCards(shuffled);
  };

  const handleCardSelect = (card: AnswerCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCard(card);
  };

  const handlePlaceCard = (characteristic: CharacteristicKey) => {
    if (!selectedCard) return;
    
    const currentMuscle = selectedMuscles[currentMuscleIndex];
    const isCorrect = selectedCard.muscleId === currentMuscle.id && 
                     selectedCard.characteristic === characteristic;
    
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setPlacedCards([...placedCards, { characteristic, card: selectedCard }]);
      setAnswerCards(answerCards.filter(c => c.id !== selectedCard.id));
      setScore(score + 10);
      
      if (placedCards.length + 1 === characteristics.length) {
        setTimeout(() => {
          if (currentMuscleIndex < selectedMuscles.length - 1) {
            setCurrentMuscleIndex(currentMuscleIndex + 1);
            setPlacedCards([]);
          } else {
            handleGameComplete();
          }
        }, 500);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    setSelectedCard(null);
  };

  const handleGameComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    console.log('Game completed! Score:', score);
    router.back();
  };

  const currentMuscle = selectedMuscles[currentMuscleIndex];

  if (!currentMuscle) {
    return null;
  }

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
});
