
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isDarkThemePurchased } = useTheme();
  const { activateItem } = useStore();

  const handleToggleTheme = () => {
    toggleTheme();
    
    // Activate/deactivate the theme in the store
    if (isDarkThemePurchased) {
      activateItem('theme-dark');
    }
  };

  // Only render if the dark theme has been purchased
  if (!isDarkThemePurchased) return null;

  return (
    <ToggleGroup type="single" value={theme} onValueChange={(value) => {
      if (value) handleToggleTheme();
    }}>
      <ToggleGroupItem value="light" aria-label="Toggle light theme">
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Toggle dark theme">
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ThemeToggle;
