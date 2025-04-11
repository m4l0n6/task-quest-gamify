
import { StoreItem, PurchasedItem, User } from '@/types';
import { STORAGE_KEYS } from '@/types/store.types';
import { defaultStoreItems } from '@/data/defaultStoreItems';

export const getStoreItems = (): StoreItem[] => {
  const itemsJson = localStorage.getItem(STORAGE_KEYS.STORE_ITEMS);
  return itemsJson ? JSON.parse(itemsJson) : [];
};

export const saveStoreItems = (items: StoreItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.STORE_ITEMS, JSON.stringify(items));
};

export const getPurchasedItems = (): PurchasedItem[] => {
  const itemsJson = localStorage.getItem(STORAGE_KEYS.PURCHASED_ITEMS);
  return itemsJson ? JSON.parse(itemsJson) : [];
};

export const savePurchasedItems = (items: PurchasedItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.PURCHASED_ITEMS, JSON.stringify(items));
};

export const checkUnlockRequirement = (requirement: { type: string; value: number }, user: User | null) => {
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

export const initializeStoreItems = (): StoreItem[] => {
  let items = getStoreItems();
  if (items.length === 0) {
    items = defaultStoreItems;
    saveStoreItems(items);
  }
  return items;
};
