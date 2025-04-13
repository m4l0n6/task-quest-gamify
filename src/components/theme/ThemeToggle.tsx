
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
    // Only process if a valid theme is selected
    if (value) {
      setTheme(value as 'light' | 'dark');
      
      // Update the store item activation state based on the theme
      if (isDarkThemePurchased) {
        // When changing to dark theme, activate it; when changing to light, deactivate it
        if (value === 'dark') {
          activateItem('theme-dark');
        } else {
          // For light theme, we still need to call activateItem to properly toggle it off
          activateItem('theme-dark');
        }
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
