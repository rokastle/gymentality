import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import {
  getMyNotifications,
  markNotificationAsRead,
  moveNotificationToTrash,
} from "../services/notificationService";

/**
 * Hook para gestionar las notificaciones del usuario.
 * @returns {Object} - { notifications, loading, error, markAsRead, refetch }
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Error fetching notifications"
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );

    try {
      const updatedNotification = await markNotificationAsRead(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, ...updatedNotification }
          : notification
        )
      );
    } catch {
      // Keep the optimistic UI state even if the backend is temporarily unavailable.
    }
  };

  const moveToTrash = async (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              read: true,
              deleted: true,
              deletedAt: new Date().toISOString(),
            }
          : notification
      )
    );

    try {
      const deletedNotification = await moveNotificationToTrash(notificationId);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId ? deletedNotification : notification
        )
      );
    } catch {
      // Keep the optimistic trash state even if the backend is temporarily unavailable.
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read && !notification.deleted
  ).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    moveToTrash,
    refetch: fetchNotifications,
  };
}
