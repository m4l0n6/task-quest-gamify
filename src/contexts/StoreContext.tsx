
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StoreItem, PurchasedItem } from '@/types';
import { StoreContextType } from '@/types/store.types';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  getStoreItems, 
  saveStoreItems, 
  getPurchasedItems, 
  savePurchasedItems, 
  checkUnlockRequirement,
  initializeStoreItems
} from '@/utils/storeUtils';

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [loadingStore, setLoadingStore] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadStoreData();
    }
  }, [user]);

  const loadStoreData = () => {
    setLoadingStore(true);
    try {
      // Initialize or get store items
      const items = initializeStoreItems();

      // Get purchased items for this user
      const purchased = getPurchasedItems().filter(item => item.userId === user?.id);

      // Update store items with purchase status
      const updatedItems = items.map(item => {
        const isPurchased = purchased.some(p => p.itemId === item.id);
        const isLocked = item.isLocked && 
          item.unlockRequirement && 
          !checkUnlockRequirement(item.unlockRequirement, user);

        return {
          ...item,
          isPurchased,
          isLocked
        };
      });

      setStoreItems(updatedItems);
      setPurchasedItems(purchased);
    } catch (error) {
      console.error('Failed to load store data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load store data',
        variant: 'destructive',
      });
    } finally {
      setLoadingStore(false);
    }
  };

  const purchaseItem = (itemId: string): boolean => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to make a purchase',
        variant: 'destructive',
      });
      return false;
    }

    const item = storeItems.find(i => i.id === itemId);
    
    if (!item) {
      toast({
        title: 'Error',
        description: 'Item not found',
        variant: 'destructive',
      });
      return false;
    }

    if (item.isPurchased) {
      toast({
        title: 'Already Purchased',
        description: 'You already own this item',
        variant: 'default',
      });
      return false;
    }

    if (item.isLocked) {
      toast({
        title: 'Item Locked',
        description: `This item is currently locked. ${item.unlockRequirement?.type === 'level' 
          ? `Reach level ${item.unlockRequirement.value} to unlock.` 
          : item.unlockRequirement?.type === 'tasks'
          ? `Complete ${item.unlockRequirement.value} tasks to unlock.`
          : `Unlock ${item.unlockRequirement?.value} badges to unlock.`}`,
        variant: 'destructive',
      });
      return false;
    }

    if ((user.tokens || 0) < item.price) {
      toast({
        title: 'Insufficient Tokens',
        description: `You need ${item.price} tokens to purchase this item`,
        variant: 'destructive',
      });
      return false;
    }

    // Process the purchase
    try {
      // Create a new purchased item record
      const newPurchase: PurchasedItem = {
        id: uuidv4(),
        itemId: item.id,
        userId: user.id,
        purchasedAt: new Date().toISOString(),
        isActive: false
      };

      // Update user tokens
      const updatedUser = {
        ...user,
        tokens: (user.tokens || 0) - item.price
      };

      // Save changes
      const allPurchasedItems = [...getPurchasedItems(), newPurchase];
      savePurchasedItems(allPurchasedItems);
      
      // Update local state
      setPurchasedItems(prevItems => [...prevItems, newPurchase]);
      setStoreItems(prevItems => prevItems.map(i => 
        i.id === itemId ? { ...i, isPurchased: true } : i
      ));
      
      // Save updated user with fewer tokens
      localStorage.setItem('epicTasks_user', JSON.stringify(updatedUser));

      toast({
        title: 'Purchase Successful',
        description: `You have successfully purchased ${item.title}`,
        variant: 'default',
      });
      
      return true;
    } catch (error) {
      console.error('Failed to process purchase:', error);
      toast({
        title: 'Purchase Failed',
        description: 'There was an error processing your purchase',
        variant: 'destructive',
      });
      return false;
    }
  };

  const activateItem = (itemId: string): boolean => {
    if (!user) return false;

    const purchasedItem = purchasedItems.find(p => p.itemId === itemId);
    if (!purchasedItem) return false;

    try {
      const item = storeItems.find(i => i.id === itemId);
      
      // For item types that should be exclusive (only one active at a time)
      if (item && ['theme', 'avatar'].includes(item.type)) {
        // Deactivate all other items of the same type
        const updatedPurchased = purchasedItems.map(p => {
          const pItem = storeItems.find(i => i.id === p.itemId);
          if (pItem && pItem.type === item.type) {
            return { ...p, isActive: p.itemId === itemId };
          }
          return p;
        });
        
        setPurchasedItems(updatedPurchased);
        savePurchasedItems([...getPurchasedItems().filter(p => p.userId !== user.id), ...updatedPurchased]);
        
        // Toggle the isActive state for this specific item
        const newIsActive = !purchasedItem.isActive;
        
        toast({
          title: newIsActive ? 'Item Activated' : 'Item Deactivated',
          description: `${item?.title || 'Item'} has been ${newIsActive ? 'activated' : 'deactivated'}`,
          variant: 'default',
        });
      } else {
        // For features that can be toggled on/off individually
        const updatedPurchased = purchasedItems.map(p => 
          p.id === purchasedItem.id ? { ...p, isActive: !p.isActive } : p
        );
        
        setPurchasedItems(updatedPurchased);
        savePurchasedItems([...getPurchasedItems().filter(p => p.userId !== user.id), ...updatedPurchased]);
        
        toast({
          title: !purchasedItem.isActive ? 'Item Activated' : 'Item Deactivated',
          description: `${item?.title || 'Item'} has been ${!purchasedItem.isActive ? 'activated' : 'deactivated'}`,
          variant: 'default',
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to activate item:', error);
      toast({
        title: 'Error',
        description: 'Failed to activate item',
        variant: 'destructive',
      });
      return false;
    }
  };

  const initializeStore = () => {
    if (storeItems.length === 0) {
      const defaultItems = initializeStoreItems();
      setStoreItems(defaultItems);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        storeItems,
        purchasedItems,
        loadingStore,
        purchaseItem,
        activateItem,
        initializeStore
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
