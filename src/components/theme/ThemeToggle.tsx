
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDarkThemePurchased } = useTheme();
  const { activateItem } = useStore();

  const handleToggleTheme = (value: string) => {
    // Only process if a valid theme is selected and it's different from current theme
    if (value && value !== theme) {
      setTheme(value as 'light' | 'dark');
      
      // Activate the dark theme in the store if changing to dark
      if (value === 'dark' && isDarkThemePurchased) {
        activateItem('theme-dark');
      }
    }
  };

  // Only render if the dark theme has been purchased
  if (!isDarkThemePurchased) return null;

  return (
    <ToggleGroup 
      type="single" 
      value={theme} 
      onValueChange={handleToggleTheme}
      className="bg-background/80 backdrop-blur-sm border border-border rounded-md shadow-md"
    >
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
