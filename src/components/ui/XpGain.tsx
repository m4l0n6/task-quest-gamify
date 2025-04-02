
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface XpGainProps {
  amount: number;
  onComplete?: () => void;
}

const XpGain: React.FC<XpGainProps> = ({ amount, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [scale, setScale] = useState(0.5);
  
  useEffect(() => {
    // Start animation
    setTimeout(() => setScale(1.2), 100);
    setTimeout(() => setScale(1), 300);
    
    // End animation
    const timer = setTimeout(() => {
      setScale(1.5);
      setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 300);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div 
        className="bg-black/40 backdrop-blur-md rounded-xl p-6"
        style={{ 
          transform: `scale(${scale})`,
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <div className="text-3xl font-bold text-epic-yellow flex items-center">
          <Star className="h-8 w-8 mr-2 fill-epic-yellow stroke-epic-yellow animate-pulse" />
          +{amount} XP
          <Star className="h-8 w-8 ml-2 fill-epic-yellow stroke-epic-yellow animate-pulse" />
        </div>
        <div className="text-center text-sm text-white/80 mt-1">Quest reward</div>
      </div>
    </div>
  );
};

export default XpGain;
