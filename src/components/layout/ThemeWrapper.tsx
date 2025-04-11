
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/theme/ThemeToggle';

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkThemePurchased } = useTheme();

  // If dark theme is purchased, add a floating theme toggle button
  if (isDarkThemePurchased) {
    return (
      <>
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
};

export default ThemeWrapper;
