import React, { createContext, useState, useContext } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

const LANGUAGE_MAP = {
  'English': 'en',
  'Hindi': 'hi',
  'Tamil': 'ta',
  'Telugu': 'te',
  'Bengali': 'bn',
  'Punjabi': 'pa',
  'Haryanvi': 'hr',
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('English');

  const t = (key, params) => {
    const code = LANGUAGE_MAP[language] || 'en';
    let text = translations[code]?.[key] || translations.en[key] || key;
    if (params) {
      Object.keys(params).forEach((param) => {
        text = text.replace(`{${param}}`, params[param]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGE_MAP }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
