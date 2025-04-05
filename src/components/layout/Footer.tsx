
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Award, List, Trophy } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background shadow-md shadow-muted/20 py-2 z-10">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center p-2">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/tasks" className="flex flex-col items-center p-2">
            <List className="h-5 w-5" />
            <span className="text-xs mt-1">Tasks</span>
          </Link>
          <Link to="/badges" className="flex flex-col items-center p-2">
            <Award className="h-5 w-5" />
            <span className="text-xs mt-1">Badges</span>
          </Link>
          <Link to="/leaderboard" className="flex flex-col items-center p-2">
            <Trophy className="h-5 w-5" />
            <span className="text-xs mt-1">Ranks</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
