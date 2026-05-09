import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: 'Home',
    shop: 'Shop',
    cart: 'Cart',
    account: 'Account',
    search: 'Search',
    featured_products: 'Featured Products',
    new_arrivals: 'New Arrivals',
    best_sellers: 'Best Sellers',
    add_to_cart: 'Add to Cart',
    out_of_stock: 'Out of Stock',
    low_stock: 'Low Stock',
    in_stock: 'In Stock',
    checkout: 'Checkout',
    total: 'Total',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    login: 'Login',
    register: 'Register',
    back_to_home: 'Back to Home',
    dhaka_inside: 'Inside Dhaka',
    dhaka_outside: 'Outside Dhaka',
  },
  bn: {
    home: 'হোম',
    shop: 'শপ',
    cart: 'কার্ট',
    account: 'অ্যাকাউন্ট',
    search: 'সার্চ',
    featured_products: 'সেরা পণ্যগুলো',
    new_arrivals: 'নতুন কালেকশন',
    best_sellers: 'বেস্ট সেলার',
    add_to_cart: 'কার্টে যোগ করুন',
    out_of_stock: 'স্টক নেই',
    low_stock: 'অল্প স্টক আছে',
    in_stock: 'স্টক আছে',
    checkout: 'চেকআউট',
    total: 'মোট',
    subtotal: 'সাবটোটাল',
    delivery: 'ডেলিভারি চার্জ',
    login: 'লগইন',
    register: 'রেজিস্ট্রেশন',
    back_to_home: 'হোমে ফিরে যান',
    dhaka_inside: 'ঢাকার ভিতরে',
    dhaka_outside: 'ঢাকার বাইরে',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('k_beauty_lang');
    if (saved === 'en' || saved === 'bn') return saved;
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('k_beauty_lang', language);
  }, [language]);

  useEffect(() => {
    if (!localStorage.getItem('k_beauty_lang')) {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'bn') {
        setLanguage('bn');
      }
    }
  }, []);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
