
import { User, Task, Badge, Notification, DailyTask } from '@/types';

const STORAGE_KEYS = {
  USER: 'epicTasks_user',
  TASKS: 'epicTasks_tasks',
  BADGES: 'epicTasks_badges',
  NOTIFICATIONS: 'epicTasks_notifications',
  USERS: 'epicTasks_users', // For leaderboard
  DAILY_TASKS: 'epicTasks_daily_tasks',
};

// User Functions
export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  
  // Also update this user in the users list for leaderboard
  const users = getUsers();
  const existingUserIndex = users.findIndex(u => u.id === user.id);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUser = (): User | null => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  return userJson ? JSON.parse(userJson) : null;
};

export const clearUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Tasks Functions
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const getTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(STORAGE_KEYS.TASKS);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

export const addTask = (task: Task): void => {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
};

export const updateTask = (updatedTask: Task): void => {
  const tasks = getTasks();
  const index = tasks.findIndex(task => task.id === updatedTask.id);
  if (index !== -1) {
    tasks[index] = updatedTask;
    saveTasks(tasks);
  }
};

export const deleteTask = (taskId: string): void => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  saveTasks(filteredTasks);
};

// Daily Tasks Functions
export const saveDailyTasks = (tasks: DailyTask[]): void => {
  localStorage.setItem(STORAGE_KEYS.DAILY_TASKS, JSON.stringify(tasks));
};

export const getDailyTasks = (): DailyTask[] => {
  const tasksJson = localStorage.getItem(STORAGE_KEYS.DAILY_TASKS);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

// Badges Functions
export const saveBadges = (badges: Badge[]): void => {
  localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
};

export const getBadges = (): Badge[] => {
  const badgesJson = localStorage.getItem(STORAGE_KEYS.BADGES);
  return badgesJson ? JSON.parse(badgesJson) : [];
};

export const unlockBadge = (badgeId: string): Badge | null => {
  const badges = getBadges();
  const badgeIndex = badges.findIndex(badge => badge.id === badgeId);
  
  if (badgeIndex !== -1 && !badges[badgeIndex].unlockedAt) {
    badges[badgeIndex].unlockedAt = new Date().toISOString();
    saveBadges(badges);
    return badges[badgeIndex];
  }
  
  return null;
};

// Notifications Functions
export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};

export const getNotifications = (): Notification[] => {
  const notificationsJson = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return notificationsJson ? JSON.parse(notificationsJson) : [];
};

export const addNotification = (notification: Notification): void => {
  const notifications = getNotifications();
  notifications.unshift(notification); // Add to the beginning
  saveNotifications(notifications);
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getNotifications();
  const index = notifications.findIndex(notification => notification.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    saveNotifications(notifications);
  }
};

// Users for leaderboard
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersJson ? JSON.parse(usersJson) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};
