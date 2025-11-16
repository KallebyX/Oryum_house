import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Gamification notification
 */
interface GamificationNotification {
  id: string;
  type: 'points' | 'level' | 'achievement';
  title: string;
  description: string;
  points?: number;
  level?: number;
  achievementId?: string;
  timestamp: number;
  read: boolean;
}

/**
 * Gamification state
 */
interface GamificationStore {
  // Current user's gamification data
  currentPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;

  // Notifications
  notifications: GamificationNotification[];

  // Actions
  setGamificationData: (data: {
    points: number;
    level: number;
    pointsToNextLevel: number;
  }) => void;
  addNotification: (notification: Omit<GamificationNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

/**
 * Gamification store for managing points, levels, and achievements
 */
export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set) => ({
      currentPoints: 0,
      currentLevel: 1,
      pointsToNextLevel: 100,
      notifications: [],

      setGamificationData: (data) =>
        set({
          currentPoints: data.points,
          currentLevel: data.level,
          pointsToNextLevel: data.pointsToNextLevel,
        }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              read: false,
            },
            ...state.notifications,
          ].slice(0, 10), // Keep only last 10 notifications
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'oryum-gamification-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * Selectors
 */
export const useGamificationPoints = () =>
  useGamificationStore((state) => state.currentPoints);

export const useGamificationLevel = () =>
  useGamificationStore((state) => state.currentLevel);

export const useUnreadGamificationNotifications = () =>
  useGamificationStore((state) => state.notifications.filter((n) => !n.read));
