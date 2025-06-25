import { create } from "zustand";

type Notification = {
  id: string;
  type: "error" | "success" | "info" | "warning";
  message: string;
};

type UiStore = {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification["type"]) => void;
  removeNotification: (id: string) => void;
};

export const useUiNotificationStore = create<UiStore>((set) => ({
  notifications: [],
  addNotification: (message, type = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000); // auto-dismiss en 4 segundos
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
