
import React, { useEffect, useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import StoreList from '@/components/store/StoreList';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import { useIsMobile } from '@/hooks/use-mobile';

const StorePage: React.FC = () => {
  const { storeItems, loadingStore, purchaseItem, activateItem, initializeStore } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Initialize store if needed
    initializeStore();
  }, []);
  
  if (loadingStore) {
    return <Loading />;
  }
  
  if (!user) {
    return (
      <div className="container px-4 py-6 mx-auto max-w-md">
        <Card className="p-6 text-center">
          <p className="mb-4">Please login to access the store.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </Card>
      </div>
    );
  }
  
  const handlePurchase = (id: string) => {
    purchaseItem(id);
  };
  
  const handleUse = (id: string) => {
    activateItem(id);
  };
  
  return (
    <div className={`container px-4 py-6 mx-auto ${isMobile ? 'max-w-md' : 'max-w-6xl'}`}>
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
      
      <StoreList 
        items={storeItems}
        onPurchase={handlePurchase}
        onUse={handleUse}
      />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Complete tasks and daily challenges to earn more tokens!
        </p>
      </div>
    </div>
  );
};

export default StorePage;
