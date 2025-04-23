
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { initializeTelegram } from '@/services/telegramService';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const { login, isLoading } = useAuth();
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [redirectNow, setRedirectNow] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Khởi tạo Telegram Mini App
        setStatus('Initializing Telegram Mini App...');
        initializeTelegram();
        console.log('Telegram WebApp object:', window.Telegram?.WebApp);
        
        // Check if running in Telegram
        if (window.Telegram?.WebApp) {
          setStatus('Running inside Telegram. Attempting auto-login...');
          try {
            await login();
            setStatus('Login successful! Redirecting...');
            // Delay redirect to show success message
            setTimeout(() => {
              setRedirectNow(true);
            }, 1500);
          } catch (loginError) {
            console.error('Login failed:', loginError);
            setStatus('Login failed. Please try again.');
            setError(loginError instanceof Error ? loginError.message : 'Unknown error');
          }
        } else {
          setStatus('Not running inside Telegram. Please open from Telegram bot.');
          console.warn('Not running in Telegram environment');
        }
      } catch (error) {
        console.error('Failed to initialize Telegram API:', error);
        setStatus('Failed to initialize');
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, [login]);

  const handleManualLogin = async () => {
    setStatus('Attempting manual login...');
    setError(null);
    try {
      await login();
      setStatus('Login successful! Redirecting...');
      setTimeout(() => {
        setRedirectNow(true);
      }, 1000);
    } catch (error) {
      console.error('Manual login failed:', error);
      setStatus('Manual login failed');
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  if (redirectNow) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-epic-purple/10 to-epic-blue/10">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">EpicTasks Initialization</h2>
          
          <div className="text-center py-4">
            <p className="mb-2 font-medium">{status}</p>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            
            {initialized && !window.Telegram?.WebApp && (
              <div className="mt-4">
                <p className="mb-4 text-amber-600">
                  This app is designed to run as a Telegram Mini App. Please open it from your Telegram bot.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  For development purposes, you can try a manual login:
                </p>
                <Button 
                  onClick={handleManualLogin} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-epic-purple to-epic-blue"
                >
                  {isLoading ? 'Logging in...' : 'Development Login'}
                </Button>
              </div>
            )}
            
            {initialized && window.Telegram?.WebApp && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Please wait...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
