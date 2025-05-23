
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useStore } from '@/contexts/StoreContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDarkThemePurchased: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isDarkThemePurchased, setIsDarkThemePurchased] = useState(false);
  const { purchasedItems, storeItems } = useStore();

  // Check if the dark theme has been purchased
  useEffect(() => {
    const darkTheme = storeItems.find(item => item.id === 'theme-dark');
    const isDarkThemeOwned = darkTheme?.isPurchased || false;
    setIsDarkThemePurchased(isDarkThemeOwned);

    // If the dark theme is purchased and active in the store, set it as the current theme
    const darkThemePurchase = purchasedItems.find(item => item.itemId === 'theme-dark' && item.isActive);
    if (darkThemePurchase) {
      setTheme('dark');
    }
  }, [purchasedItems, storeItems]);

  // Update the document class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDarkThemePurchased }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
