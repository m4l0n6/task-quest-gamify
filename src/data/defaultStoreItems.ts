
import { StoreItem } from '@/types';

export const defaultStoreItems: StoreItem[] = [
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
