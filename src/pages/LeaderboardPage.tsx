
import React from 'react';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';

const LeaderboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      <LeaderboardTable />
    </div>
  );
};

export default LeaderboardPage;
