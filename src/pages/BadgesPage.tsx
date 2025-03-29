
import React from 'react';
import BadgeList from '@/components/badges/BadgeList';

const BadgesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Badges</h1>
      <BadgeList />
    </div>
  );
};

export default BadgesPage;
