
import React from 'react';
import { Badge as BadgeType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface BadgeCardProps {
  badge: BadgeType;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const isUnlocked = !!badge.unlockedAt;
  
  return (
    <Card className={`task-card-hover ${!isUnlocked ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-2 text-center">
        <div className="mx-auto text-4xl mb-2">
          <span className={`${isUnlocked ? 'badge-glow' : ''}`}>
            {badge.iconUrl}
          </span>
        </div>
        <CardTitle>{badge.name}</CardTitle>
        <CardDescription>{badge.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="text-center">
        {isUnlocked ? (
          <p className="text-xs text-muted-foreground">
            Unlocked on {format(new Date(badge.unlockedAt!), 'PP')}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Complete tasks to unlock</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeCard;
