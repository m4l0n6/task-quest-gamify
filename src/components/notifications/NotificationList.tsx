
import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Check, Calendar, Trophy, Award } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Loading from '../ui/Loading';

const NotificationList: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  
  if (!notifications) {
    return <Loading message="Loading notifications..." />;
  }
  
  // Helper function to get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Calendar className="h-5 w-5 text-epic-blue" />;
      case 'levelUp':
        return <Trophy className="h-5 w-5 text-epic-yellow" />;
      case 'badge':
        return <Award className="h-5 w-5 text-epic-purple" />;
      case 'leaderboard':
        return <Trophy className="h-5 w-5 text-epic-green" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Notifications</CardTitle>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-8"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <BellOff className="h-10 w-10 mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 rounded-lg border ${notification.read ? 'bg-background' : 'bg-accent'} animate-fade-in`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className={`${notification.read ? 'text-muted-foreground' : 'font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-epic-blue"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationList;
