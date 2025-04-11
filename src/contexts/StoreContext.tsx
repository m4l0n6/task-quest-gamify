import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { StoreItem, PurchasedItem } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

// Utility functions for store management
const STORAGE_KEYS = {
  STORE_ITEMS: 'epicTasks_store_items',
  PURCHASED_ITEMS: 'epicTasks_purchased_items',
};

const getStoreItems = (): StoreItem[] => {
  const itemsJson = localStorage.getItem(STORAGE_KEYS.STORE_ITEMS);
  return itemsJson ? JSON.parse(itemsJson) : [];
};

const saveStoreItems = (items: StoreItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.STORE_ITEMS, JSON.stringify(items));
};

const getPurchasedItems = (): PurchasedItem[] => {
  const itemsJson = localStorage.getItem(STORAGE_KEYS.PURCHASED_ITEMS);
  return itemsJson ? JSON.parse(itemsJson) : [];
};

const savePurchasedItems = (items: PurchasedItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.PURCHASED_ITEMS, JSON.stringify(items));
};

interface StoreContextType {
  storeItems: StoreItem[];
  purchasedItems: PurchasedItem[];
  loadingStore: boolean;
  purchaseItem: (itemId: string) => boolean;
  activateItem: (itemId: string) => boolean;
  initializeStore: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const defaultStoreItems: StoreItem[] = [
  {
    id: 'feature-premium-tasks',
    title: 'Premium Tasks',
    description: 'Access special high-reward tasks that give you extra XP and tokens',
    price: 50,
    type: 'feature',
    iconUrl: '✨',
    isPurchased: false,
    isLocked: false,
  },
  {
    id: 'feature-task-categories',
    title: 'Task Categories',
    description: 'Organize your tasks with custom categories and filters',
    price: 75,
    type: 'feature',
    iconUrl: '📂',
    isPurchased: false,
    isLocked: false,
  },
  {
    id: 'feature-multiplier',
    title: 'XP Multiplier',
    description: 'Get a 1.5x XP boost for all completed tasks for 24 hours',
    price: 100,
    type: 'feature',
    iconUrl: '🚀',
    isPurchased: false,
    isLocked: true,
    unlockRequirement: {
      type: 'level',
      value: 5
    }
  },
  {
    id: 'avatar-ninja',
    title: 'Ninja Avatar',
    description: 'Show your stealthy productivity skills with this ninja avatar',
    price: 30,
    type: 'avatar',
    iconUrl: '🥷',
    isPurchased: false,
    isLocked: false,
  },
  {
    id: 'avatar-wizard',
    title: 'Wizard Avatar',
    description: 'Channel your inner productivity wizard with this magical avatar',
    price: 30,
    type: 'avatar',
    iconUrl: '🧙‍♂️',
    isPurchased: false,
    isLocked: false,
  },
  {
    id: 'badge-vip',
    title: 'VIP Badge',
    description: 'Exclusive VIP badge to show off your premium status',
    price: 200,
    type: 'badge',
    iconUrl: '💎',
    isPurchased: false,
    isLocked: true,
    unlockRequirement: {
      type: 'tasks',
      value: 20
    }
  },
  {
    id: 'theme-dark',
    title: 'Dark Theme',
    description: 'A sleek dark theme for your epic productivity journey',
    price: 40,
    type: 'theme',
    iconUrl: '🌙',
    isPurchased: false,
    isLocked: false,
  },
  {
    id: 'theme-neon',
    title: 'Neon Theme',
    description: 'Stand out with this vibrant neon theme',
    price: 60,
    type: 'theme',
    iconUrl: '🌈',
    isPurchased: false,
    isLocked: false,
  }
];

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
      // Get store items or initialize defaults
      let items = getStoreItems();
      if (items.length === 0) {
        items = defaultStoreItems;
        saveStoreItems(items);
      }

      // Get purchased items
      const purchased = getPurchasedItems().filter(item => item.userId === user?.id);

      // Update store items with purchase status
      const updatedItems = items.map(item => {
        const isPurchased = purchased.some(p => p.itemId === item.id);
        const isLocked = item.isLocked && 
          item.unlockRequirement && 
          !checkUnlockRequirement(item.unlockRequirement);

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

  const checkUnlockRequirement = (requirement: { type: string; value: number }) => {
    if (!user) return false;

    switch (requirement.type) {
      case 'level':
        return user.level >= requirement.value;
      case 'badges':
        return user.badges.filter(b => b.unlockedAt !== null).length >= requirement.value;
      case 'tasks':
        return user.completedTasks >= requirement.value;
      default:
        return false;
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
      } else {
        // For features that can be toggled on/off individually
        const updatedPurchased = purchasedItems.map(p => 
          p.id === purchasedItem.id ? { ...p, isActive: !p.isActive } : p
        );
        
        setPurchasedItems(updatedPurchased);
        savePurchasedItems([...getPurchasedItems().filter(p => p.userId !== user.id), ...updatedPurchased]);
      }

      toast({
        title: purchasedItem.isActive ? 'Item Deactivated' : 'Item Activated',
        description: `${item?.title || 'Item'} has been ${purchasedItem.isActive ? 'deactivated' : 'activated'}`,
        variant: 'default',
      });
      
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
      saveStoreItems(defaultStoreItems);
      setStoreItems(defaultStoreItems);
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
