
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, isDarkThemePurchased } = useTheme();

  const handleToggleTheme = (value: string) => {
    if (value) {
      setTheme(value as 'light' | 'dark');
    }
  };

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
