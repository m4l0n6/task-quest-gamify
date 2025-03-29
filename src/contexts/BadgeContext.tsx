
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Badge } from '@/types';
import { getBadges } from '@/utils/storage';
import { useAuth } from './AuthContext';

interface BadgeContextType {
  badges: Badge[];
  unlockedBadges: Badge[];
  lockedBadges: Badge[];
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const BadgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadBadges();
    } else {
      setBadges([]);
    }
  }, [user]);

  const loadBadges = () => {
    try {
      const storedBadges = getBadges();
      setBadges(storedBadges);
    } catch (error) {
      console.error('Failed to load badges:', error);
    }
  };

  const unlockedBadges = badges.filter(badge => badge.unlockedAt !== null);
  const lockedBadges = badges.filter(badge => badge.unlockedAt === null);

  return (
    <BadgeContext.Provider
      value={{
        badges,
        unlockedBadges,
        lockedBadges
      }}
    >
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadge = (): BadgeContextType => {
  const context = useContext(BadgeContext);
  if (context === undefined) {
    throw new Error('useBadge must be used within a BadgeProvider');
  }
  return context;
};
