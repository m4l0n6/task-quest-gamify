
import { StoreItem, PurchasedItem } from '@/types';

export interface StoreContextType {
  storeItems: StoreItem[];
  purchasedItems: PurchasedItem[];
  loadingStore: boolean;
  purchaseItem: (itemId: string) => boolean;
  activateItem: (itemId: string) => boolean;
  initializeStore: () => void;
}

export const STORAGE_KEYS = {
  STORE_ITEMS: 'epicTasks_store_items',
  PURCHASED_ITEMS: 'epicTasks_purchased_items',
};
