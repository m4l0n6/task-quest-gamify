
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Award, List, Trophy, Calendar } from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();
  
  // Function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Get class based on active state
  const getLinkClass = (path: string) => {
    return `flex flex-col items-center p-2 ${isActive(path) ? 'text-epic-purple' : ''}`;
  };
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background shadow-md shadow-muted/20 py-2 z-10">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          <Link to="/" className={getLinkClass('/')}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/tasks" className={getLinkClass('/tasks')}>
            <List className="h-5 w-5" />
            <span className="text-xs mt-1">Tasks</span>
          </Link>
          <Link to="/daily" className={getLinkClass('/daily')}>
            <Calendar className="h-5 w-5" />
            <span className="text-xs mt-1">Daily</span>
          </Link>
          <Link to="/badges" className={getLinkClass('/badges')}>
            <Award className="h-5 w-5" />
            <span className="text-xs mt-1">Badges</span>
          </Link>
          <Link to="/leaderboard" className={getLinkClass('/leaderboard')}>
            <Trophy className="h-5 w-5" />
            <span className="text-xs mt-1">Ranks</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
