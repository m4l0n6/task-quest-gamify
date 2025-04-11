
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  xp: number;
  level: number;
  badges: Badge[];
  completedTasks: number;
  tokens: number;
  lastDailyLogin: string | null;
  dailyLoginStreak: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  xpReward: number;
  tokenReward: number;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  userId: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt: string | null;
}

export interface Leaderboard {
  userId: string;
  username: string;
  avatarUrl: string;
  xp: number;
  level: number;
  rank: number;
}

export interface Notification {
  id: string;
  type: 'deadline' | 'levelUp' | 'badge' | 'leaderboard' | 'token' | 'streak';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  tokenReward: number;
  completed: boolean;
  type: 'login' | 'complete_task' | 'reach_streak';
  requirement: number;
  progress: number;
  createdAt: string;
  completedAt: string | null;
  expiresAt: string;
}

export interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'theme' | 'avatar' | 'badge' | 'feature';
  iconUrl: string;
  isPurchased: boolean;
  isLocked: boolean;
  unlockRequirement?: {
    type: 'level' | 'badges' | 'tasks';
    value: number;
  };
}

export interface PurchasedItem {
  id: string;
  itemId: string;
  userId: string;
  purchasedAt: string;
  isActive: boolean;
}
