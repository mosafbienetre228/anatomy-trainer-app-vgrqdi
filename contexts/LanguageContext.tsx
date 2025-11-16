
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    home: 'Accueil',
    learn: 'Apprendre',
    profile: 'Profil',
    subscription: 'Abonnement',
    welcome: 'Bienvenue sur Abinarth Formation',
    welcomeDesc: 'Apprenez l\'anatomie de manière interactive avec notre système de cartes',
    startLearning: 'Commencer l\'apprentissage',
    shoulderMuscles: 'Muscles de l\'épaule',
    shoulderDesc: '15 muscles à découvrir',
    myProgress: 'Ma progression',
    settings: 'Paramètres',
    language: 'Langue',
    subscriptionTitle: 'Gestion de l\'abonnement',
    subscriptionDesc: 'Accédez à tous les modules d\'anatomie',
    subscribe: 'S\'abonner',
    currentPlan: 'Plan actuel',
    free: 'Gratuit',
    premium: 'Premium',
    musclesLearned: 'Muscles appris',
    totalScore: 'Score total',
    recentSessions: 'Sessions récentes',
    characteristics: 'Caractéristiques',
    definition: 'Définition',
    origin: 'Origine',
    path: 'Trajet',
    termination: 'Terminaison',
    innervation: 'Innervation',
    action: 'Action',
    relations: 'Rapports',
    clinicalApplications: 'Applications cliniques',
    startGame: 'Démarrer le jeu',
    viewDetails: 'Voir les détails',
  },
  en: {
    home: 'Home',
    learn: 'Learn',
    profile: 'Profile',
    subscription: 'Subscription',
    welcome: 'Welcome to Abinarth Formation',
    welcomeDesc: 'Learn anatomy interactively with our card system',
    startLearning: 'Start Learning',
    shoulderMuscles: 'Shoulder Muscles',
    shoulderDesc: '15 muscles to discover',
    myProgress: 'My Progress',
    settings: 'Settings',
    language: 'Language',
    subscriptionTitle: 'Subscription Management',
    subscriptionDesc: 'Access all anatomy modules',
    subscribe: 'Subscribe',
    currentPlan: 'Current Plan',
    free: 'Free',
    premium: 'Premium',
    musclesLearned: 'Muscles Learned',
    totalScore: 'Total Score',
    recentSessions: 'Recent Sessions',
    characteristics: 'Characteristics',
    definition: 'Definition',
    origin: 'Origin',
    path: 'Path',
    termination: 'Termination',
    innervation: 'Innervation',
    action: 'Action',
    relations: 'Relations',
    clinicalApplications: 'Clinical Applications',
    startGame: 'Start Game',
    viewDetails: 'View Details',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
