
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types';
import { getUser, saveUser, getBadges, saveBadges, saveUsers, getUsers } from './storage';
import { initializeDefaultBadges } from './gamification';

// Mock Telegram Web App API
export const mockTelegramWebApp = {
  initData: "mock_init_data",
  initDataUnsafe: {
    query_id: "mock_query_id",
    user: {
      id: 12345678,
      first_name: "Epic",
      last_name: "User",
      username: "epicuser",
      language_code: "en",
      photo_url: "https://i.pravatar.cc/100?u=epicuser"
    },
    auth_date: new Date().getTime() / 1000,
    hash: "mock_hash"
  },
  version: "6.0",
  platform: "web",
  colorScheme: "light",
  
  isExpanded: true,
  viewportHeight: window.innerHeight,
  viewportStableHeight: window.innerHeight,
  
  // Methods
  expand: () => console.log("Telegram WebApp expand called"),
  close: () => console.log("Telegram WebApp close called"),
  showConfirm: (message: string) => window.confirm(message),
  showAlert: (message: string) => window.alert(message),
  openLink: (url: string) => window.open(url, '_blank'),
};

// Mock telegram login response
export const mockTelegramLogin = async (): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get existing user or create new one
  const existingUser = getUser();
  if (existingUser) {
    existingUser.lastLoginAt = new Date().toISOString();
    saveUser(existingUser);
    return existingUser;
  }
  
  // Initialize default badges if not already set
  const existingBadges = getBadges();
  if (existingBadges.length === 0) {
    const defaultBadges = initializeDefaultBadges();
    saveBadges(defaultBadges);
  }
  
  // Create mock users for leaderboard if none exist
  const users = getUsers();
  if (users.length === 0) {
    createMockUsers();
  }
  
  // Create new user
  const telegramUser = mockTelegramWebApp.initDataUnsafe.user;
  const newUser: User = {
    id: telegramUser.id.toString(),
    username: telegramUser.username || `${telegramUser.first_name}${telegramUser.last_name || ''}`,
    avatarUrl: telegramUser.photo_url || `https://i.pravatar.cc/150?u=${uuidv4()}`,
    xp: 0,
    level: 1,
    badges: [],
    completedTasks: 0,
    tokens: 0,
    lastDailyLogin: null,
    dailyLoginStreak: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
  
  saveUser(newUser);
  return newUser;
};

// Create some mock users for the leaderboard
export const createMockUsers = () => {
  const mockUsers: User[] = [
    {
      id: "user1",
      username: "alice99",
      avatarUrl: `https://i.pravatar.cc/150?u=user1`,
      xp: 850,
      level: 9,
      badges: [],
      completedTasks: 42,
      tokens: 200,
      lastDailyLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dailyLoginStreak: 3,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "user2",
      username: "bob_smith",
      avatarUrl: `https://i.pravatar.cc/150?u=user2`,
      xp: 1200,
      level: 13,
      badges: [],
      completedTasks: 76,
      tokens: 350,
      lastDailyLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dailyLoginStreak: 5,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "user3",
      username: "gamer_master",
      avatarUrl: `https://i.pravatar.cc/150?u=user3`,
      xp: 1560,
      level: 16,
      badges: [],
      completedTasks: 108,
      tokens: 460,
      lastDailyLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dailyLoginStreak: 7,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "user4",
      username: "productivity_queen",
      avatarUrl: `https://i.pravatar.cc/150?u=user4`,
      xp: 2100,
      level: 22,
      badges: [],
      completedTasks: 135,
      tokens: 590,
      lastDailyLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dailyLoginStreak: 12,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "user5",
      username: "task_champion",
      avatarUrl: `https://i.pravatar.cc/150?u=user5`,
      xp: 400,
      level: 5,
      badges: [],
      completedTasks: 28,
      tokens: 120,
      lastDailyLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dailyLoginStreak: 1,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  saveUsers(mockUsers);
};

// Initialize Telegram API in a browser context
export const initializeTelegramApi = () => {
  // In a real app, we would connect to the Telegram Mini App SDK here
  // For now, we'll just attach our mock to the window
  window.Telegram = {
    WebApp: mockTelegramWebApp
  };
  
  return window.Telegram;
};

// Make types available globally
declare global {
  interface Window {
    Telegram: {
      WebApp: typeof mockTelegramWebApp
    }
  }
}
