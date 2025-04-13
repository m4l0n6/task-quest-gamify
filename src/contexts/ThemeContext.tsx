
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

  // Check if the dark theme has been purchased and set initial theme
  useEffect(() => {
    const darkTheme = storeItems.find(item => item.id === 'theme-dark');
    const isDarkThemePurchased = darkTheme?.isPurchased || false;
    setIsDarkThemePurchased(isDarkThemePurchased);

    // If the theme is purchased and active, set it as the current theme
    const darkThemePurchase = purchasedItems.find(item => item.itemId === 'theme-dark');
    if (darkThemePurchase?.isActive) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [purchasedItems, storeItems]);

  // Update the document class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply theme class to root element
    if (theme === 'dark') {
      root.classList.add('dark');
      console.log('Dark theme applied');
    } else {
      root.classList.remove('dark');
      console.log('Light theme applied');
    }
  }, [theme]);

  // Toggle between light and dark themes
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
