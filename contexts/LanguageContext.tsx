
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations: Record<Language, Record<string, string>> = {
  fr: {
    welcome: 'Bienvenue sur Abinarth Formation',
    welcomeDesc: 'Apprenez l\'anatomie de manière interactive et ludique',
    shoulderMuscles: 'Muscles de l\'épaule',
    shoulderDesc: 'Découvrez les 15 muscles de la région de l\'épaule',
    subscription: 'Abonnement',
    subscriptionDesc: 'Débloquez toutes les fonctionnalités premium',
    startGame: 'Commencer le jeu',
    definition: 'Définition',
    origin: 'Origine',
    path: 'Trajet',
    termination: 'Terminaison',
    innervation: 'Innervation',
    action: 'Action',
    relations: 'Rapports',
    clinicalApplications: 'Applications cliniques',
    characteristics: 'Caractéristiques anatomiques',
    free: 'Gratuit',
    premium: 'Premium',
    subscribe: 'S\'abonner',
    profile: 'Profil',
    settings: 'Paramètres',
    language: 'Langue',
    darkMode: 'Mode sombre',
    notifications: 'Notifications',
    about: 'À propos',
    logout: 'Déconnexion',
    home: 'Accueil',
  },
  en: {
    welcome: 'Welcome to Abinarth Formation',
    welcomeDesc: 'Learn anatomy in an interactive and fun way',
    shoulderMuscles: 'Shoulder Muscles',
    shoulderDesc: 'Discover the 15 muscles of the shoulder region',
    subscription: 'Subscription',
    subscriptionDesc: 'Unlock all premium features',
    startGame: 'Start Game',
    definition: 'Definition',
    origin: 'Origin',
    path: 'Path',
    termination: 'Termination',
    innervation: 'Innervation',
    action: 'Action',
    relations: 'Relations',
    clinicalApplications: 'Clinical Applications',
    characteristics: 'Anatomical Characteristics',
    free: 'Free',
    premium: 'Premium',
    subscribe: 'Subscribe',
    profile: 'Profile',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    notifications: 'Notifications',
    about: 'About',
    logout: 'Logout',
    home: 'Home',
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    const translation = translations[language][key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
