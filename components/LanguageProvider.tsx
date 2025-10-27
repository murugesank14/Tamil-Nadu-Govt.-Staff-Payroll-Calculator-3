import React, { createContext, useState, useContext } from 'react';
import { translations, TranslationKey } from '../translations';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, vars?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Fix: Refactored to use a standard props interface with React.FC for better type clarity.
interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey, vars?: { [key: string]: string | number }): string => {
    // The type of translations[language] is a union, which TypeScript can't safely index with a key from only one part of the union ('en').
    // We assert that the selected language object has the same shape as the 'en' object.
    let text = (translations[language] as typeof translations['en'])[key] || translations['en'][key];
    
    if (vars) {
        Object.keys(vars).forEach(varKey => {
            const regex = new RegExp(`{${varKey}}`, 'g');
            text = text.replace(regex, String(vars[varKey]));
        });
    }
    return text || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};