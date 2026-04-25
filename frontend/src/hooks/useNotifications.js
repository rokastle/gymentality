import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Hook para gestionar las notificaciones del usuario
 * @returns {Object} - { notifications, loading, error, markAsRead, refetch }
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Por ahora devolvemos array vacío
      // Cuando haya endpoint /notifications, usar axiosClient.get('/notifications')
      setNotifications([]);
    } catch (err) {
      setError(err.message || "Error fetching notifications");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    // Cuando haya endpoint, usar:
    // await axiosClient.patch(`/notifications/${notificationId}/read`)
    
    // Por ahora actualizamos localmente
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    refetch: fetchNotifications,
  };
}