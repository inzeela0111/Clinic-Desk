import { createContext, useContext, useState, useCallback } from 'react';
import en from '../locales/en';
import hi from '../locales/hi';

const translations = { en, hi };
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('clinicdesk-lang') || 'en';
  });

  const toggleLanguage = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('clinicdesk-lang', next);
      return next;
    });
  };

  const setLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('clinicdesk-lang', newLang);
  };

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
