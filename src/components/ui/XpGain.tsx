
import React, { useState, useEffect } from 'react';

interface XpGainProps {
  amount: number;
  onComplete?: () => void;
}

const XpGain: React.FC<XpGainProps> = ({ amount, onComplete }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 animate-bounce-in">
        <div className="text-3xl font-bold xp-text animate-pulse-scale">
          +{amount} XP
        </div>
      </div>
    </div>
  );
};

export default XpGain;
