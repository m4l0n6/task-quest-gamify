
import React from 'react';
import NotificationList from '@/components/notifications/NotificationList';

const NotificationsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <NotificationList />
    </div>
  );
};

export default NotificationsPage;
