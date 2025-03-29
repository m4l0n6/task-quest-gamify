
import { User, Task, Badge, Notification } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getUser, saveUser, addNotification, unlockBadge, getBadges, getTasks } from './storage';

// XP required for each level
export const XP_PER_LEVEL = 100;
export const MAX_LEVEL = 50;

// Calculate level based on XP
export const calculateLevel = (xp: number): number => {
  return Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, MAX_LEVEL);
};

// Calculate XP needed for next level
export const xpForNextLevel = (level: number): number => {
  return level * XP_PER_LEVEL;
};

// Calculate XP progress percentage towards next level
export const calculateXpProgress = (user: User): number => {
  const currentLevelXp = (user.level - 1) * XP_PER_LEVEL;
  const nextLevelXp = user.level * XP_PER_LEVEL;
  const xpInCurrentLevel = user.xp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  
  return Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);
};

// Add XP to user and handle level up
export const addXpToUser = (xpAmount: number): { user: User, leveledUp: boolean, newLevel?: number } => {
  const user = getUser();
  if (!user) {
    throw new Error("User not found");
  }
  
  const oldLevel = user.level;
  user.xp += xpAmount;
  const newLevel = calculateLevel(user.xp);
  user.level = newLevel;
  
  const leveledUp = newLevel > oldLevel;
  
  // If user leveled up, create notification
  if (leveledUp) {
    const notification: Notification = {
      id: uuidv4(),
      type: 'levelUp',
      message: `Congratulations! You've reached level ${newLevel}!`,
      read: false,
      createdAt: new Date().toISOString()
    };
    addNotification(notification);
    
    // Check for badge unlocks based on level
    checkAndUnlockLevelBadges(newLevel);
  }
  
  saveUser(user);
  
  return { user, leveledUp, newLevel: leveledUp ? newLevel : undefined };
};

// Complete a task and award XP
export const completeTask = (taskId: string): { task: Task, xpGained: number, leveledUp: boolean } => {
  const user = getUser();
  if (!user) {
    throw new Error("User not found");
  }
  
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    throw new Error("Task not found");
  }
  
  if (tasks[taskIndex].completed) {
    throw new Error("Task already completed");
  }
  
  // Mark task as completed
  tasks[taskIndex].completed = true;
  tasks[taskIndex].completedAt = new Date().toISOString();
  
  // Update completed tasks count
  user.completedTasks += 1;
  saveUser(user);
  
  // Award XP
  const xpGained = tasks[taskIndex].xpReward;
  const { leveledUp } = addXpToUser(xpGained);
  
  // Check for badges based on completed tasks
  checkAndUnlockTaskBadges(user.completedTasks);
  
  return { task: tasks[taskIndex], xpGained, leveledUp };
};

// Check and unlock badges based on level
export const checkAndUnlockLevelBadges = (level: number): Badge[] => {
  const badges = getBadges();
  const unlockedBadges: Badge[] = [];
  
  // Define level badges to check
  const levelBadges = [
    { level: 5, badgeName: "Apprentice" },
    { level: 10, badgeName: "Expert" },
    { level: 20, badgeName: "Master" },
    { level: 30, badgeName: "Grandmaster" },
    { level: 50, badgeName: "Legendary" }
  ];
  
  for (const levelBadge of levelBadges) {
    if (level >= levelBadge.level) {
      const badge = badges.find(b => b.name === levelBadge.badgeName && !b.unlockedAt);
      if (badge) {
        const unlockedBadge = unlockBadge(badge.id);
        if (unlockedBadge) {
          unlockedBadges.push(unlockedBadge);
          
          // Create notification for badge unlock
          const notification: Notification = {
            id: uuidv4(),
            type: 'badge',
            message: `You've unlocked the "${unlockedBadge.name}" badge!`,
            read: false,
            createdAt: new Date().toISOString()
          };
          addNotification(notification);
        }
      }
    }
  }
  
  return unlockedBadges;
};

// Check and unlock badges based on task completion count
export const checkAndUnlockTaskBadges = (completedTasks: number): Badge[] => {
  const badges = getBadges();
  const unlockedBadges: Badge[] = [];
  
  // Define task completion badges
  const taskBadges = [
    { tasks: 1, badgeName: "First Task" },
    { tasks: 10, badgeName: "Taskmaster" },
    { tasks: 25, badgeName: "Task Enthusiast" },
    { tasks: 50, badgeName: "Task Wizard" },
    { tasks: 100, badgeName: "Task Legend" }
  ];
  
  for (const taskBadge of taskBadges) {
    if (completedTasks >= taskBadge.tasks) {
      const badge = badges.find(b => b.name === taskBadge.badgeName && !b.unlockedAt);
      if (badge) {
        const unlockedBadge = unlockBadge(badge.id);
        if (unlockedBadge) {
          unlockedBadges.push(unlockedBadge);
          
          // Create notification for badge unlock
          const notification: Notification = {
            id: uuidv4(),
            type: 'badge',
            message: `You've unlocked the "${unlockedBadge.name}" badge!`,
            read: false,
            createdAt: new Date().toISOString()
          };
          addNotification(notification);
        }
      }
    }
  }
  
  return unlockedBadges;
};

// Initialize default badges
export const initializeDefaultBadges = (): Badge[] => {
  const defaultBadges: Badge[] = [
    { 
      id: uuidv4(), 
      name: "First Task", 
      description: "Complete your first task", 
      iconUrl: "🏆", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Taskmaster", 
      description: "Complete 10 tasks", 
      iconUrl: "🎯", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Task Enthusiast", 
      description: "Complete 25 tasks", 
      iconUrl: "⚡", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Task Wizard", 
      description: "Complete 50 tasks", 
      iconUrl: "🧙", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Task Legend", 
      description: "Complete 100 tasks", 
      iconUrl: "👑", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Apprentice", 
      description: "Reach level 5", 
      iconUrl: "🌱", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Expert", 
      description: "Reach level 10", 
      iconUrl: "🌟", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Master", 
      description: "Reach level 20", 
      iconUrl: "🔥", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Grandmaster", 
      description: "Reach level 30", 
      iconUrl: "💎", 
      unlockedAt: null 
    },
    { 
      id: uuidv4(), 
      name: "Legendary", 
      description: "Reach level 50", 
      iconUrl: "🏅", 
      unlockedAt: null 
    }
  ];
  
  return defaultBadges;
};

// Generate leaderboard
export const generateLeaderboard = (users: User[]) => {
  return users
    .slice()
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({
      userId: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      xp: user.xp,
      level: user.level,
      rank: index + 1
    }));
};
