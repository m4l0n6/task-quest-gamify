
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Loading from '../ui/Loading';
import LoginPage from '@/pages/LoginPage';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();

  if (isLoading) {
    return <Loading message="Loading EpicTasks..." />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-background/70">
      <Header />
      <main className={`flex-grow ${isMobile ? 'px-2 py-3 max-w-full' : 'container px-4 py-6'} mx-auto overflow-hidden`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
