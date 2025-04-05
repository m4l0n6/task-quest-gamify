import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { calculateXpProgress } from '@/utils/gamification';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Header: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const xpProgress = calculateXpProgress(user);

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-epic-purple to-epic-blue">
              EpicTasks
            </span>
          </Link>
          
          {/* Only keep Avatar */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/profile" className="ml-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-epic-purple">
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs text-muted-foreground">Level {user.level}</p>
                    </div>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Level Progress Bar */}
        <div className="w-full mt-2">
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-epic-purple to-epic-blue"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
