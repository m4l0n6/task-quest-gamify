
import React from 'react';
import { useBadge } from '@/contexts/BadgeContext';
import BadgeCard from './BadgeCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Loading from '../ui/Loading';

const BadgeList: React.FC = () => {
  const { badges, unlockedBadges, lockedBadges } = useBadge();
  
  if (!badges.length) {
    return <Loading message="Loading badges..." />;
  }
  
  return (
    <div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Badges</TabsTrigger>
          <TabsTrigger value="unlocked">Unlocked ({unlockedBadges.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedBadges.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {badges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="unlocked" className="mt-4">
          {unlockedBadges.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Complete tasks to unlock badges</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {unlockedBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="locked" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {lockedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BadgeList;
