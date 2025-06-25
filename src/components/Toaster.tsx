"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useUiNotificationStore } from "../stores/useUiNotificationStore.ts";

export default function Toaster() {
  const { notifications, removeNotification } = useUiNotificationStore();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-3 w-full max-w-sm px-4">
      {notifications.map((n) => {
        const typeClass = {
          info: "alert-info",
          success: "alert-success",
          warning: "alert-warning",
          error: "alert-error",
        }[n.type] ?? "alert-info";

        return (
          <div
            key={n.id}
            role="alert"
            className={`alert ${typeClass} shadow-lg w-full`}
          >
            <div className="flex-1">{n.message}</div>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => removeNotification(n.id)}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
