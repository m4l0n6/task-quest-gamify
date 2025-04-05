
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { calculateXpProgress } from '@/utils/gamification';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Bell, Calendar, Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNotification } from '@/contexts/NotificationContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotification();
  
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
          
          {/* Right Side: Tokens, Notifications, Daily and Profile */}
          <div className="flex items-center space-x-3">
            {/* Tokens display */}
            <Link to="/daily" className="flex items-center">
              <Badge variant="outline" className="flex items-center bg-epic-yellow/10 hover:bg-epic-yellow/20 border-epic-yellow/30 px-3 py-1">
                <Coins className="h-3 w-3 mr-1 text-epic-yellow fill-epic-yellow" />
                <span className="font-medium">{user.tokens}</span>
              </Badge>
            </Link>
            
            {/* Notifications */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/notifications" className="relative p-2 rounded-full hover:bg-accent">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 text-[10px] flex items-center justify-center bg-epic-blue text-white rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Daily Tasks */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/daily" className="p-2 rounded-full hover:bg-accent">
                    <Calendar className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Daily Rewards</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Avatar */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/profile">
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
