
import React, { useState, useEffect } from 'react';

interface LevelUpProps {
  level: number;
  onComplete?: () => void;
}

const LevelUp: React.FC<LevelUpProps> = ({ level, onComplete }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50 bg-black/50 backdrop-blur-sm">
      <div className="relative animate-bounce-in">
        <div className="absolute -inset-10 bg-gradient-to-r from-epic-yellow via-epic-purple to-epic-blue opacity-50 blur-xl rounded-full animate-rotate-shine"></div>
        <div className="relative bg-background rounded-xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-2">Level Up!</h2>
          <div className="flex justify-center mb-4">
            <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-epic-yellow via-epic-purple to-epic-blue">
              {level}
            </span>
          </div>
          <p className="text-center text-muted-foreground">
            Congratulations! You've reached a new level!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelUp;
