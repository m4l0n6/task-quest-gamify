
export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  xp: number;
  level: number;
  badges: Badge[];
  completedTasks: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string | null;
  xpReward: number;
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
  type: 'deadline' | 'levelUp' | 'badge' | 'leaderboard';
  message: string;
  read: boolean;
  createdAt: string;
}
