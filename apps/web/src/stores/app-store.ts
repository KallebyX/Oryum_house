import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Condominium state
 */
interface CondominiumState {
  selectedCondominiumId: string | null;
  setSelectedCondominium: (id: string) => void;
}

/**
 * Notification state
 */
interface NotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  incrementUnread: () => void;
  decrementUnread: () => void;
}

/**
 * UI state
 */
interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

/**
 * Combined app store
 */
interface AppStore extends CondominiumState, NotificationState, UIState {}

/**
 * Global app store using Zustand
 */
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Condominium
      selectedCondominiumId: null,
      setSelectedCondominium: (id: string) => set({ selectedCondominiumId: id }),

      // Notifications
      unreadCount: 0,
      setUnreadCount: (count: number) => set({ unreadCount: count }),
      incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
      decrementUnread: () =>
        set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),

      // UI
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
    }),
    {
      name: 'oryum-app-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist certain fields
      partialize: (state) => ({
        selectedCondominiumId: state.selectedCondominiumId,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

/**
 * Selectors for better performance
 */
export const useSelectedCondominium = () =>
  useAppStore((state) => state.selectedCondominiumId);

export const useUnreadCount = () => useAppStore((state) => state.unreadCount);

export const useSidebarState = () =>
  useAppStore((state) => ({
    open: state.sidebarOpen,
    toggle: state.toggleSidebar,
    setOpen: state.setSidebarOpen,
  }));
