import { useMemo, useState } from "react";
import NotificationsPanel from "../components/notifications/NotificationsPanel";
import NotificationsTabBar from "../components/notifications/NotificationsTabBar";
import { useNotifications } from "../hooks/useNotifications";
import {
  getVisibleNotifications,
  groupNotificationsByDate,
} from "../utils/notificationsPageUtils";

export default function NotificationsPage() {
  const { notifications, loading, error, markAsRead, moveToTrash } =
    useNotifications();
  const [activeTabId, setActiveTabId] = useState("all");

  const visibleNotifications = useMemo(
    () => getVisibleNotifications(notifications, activeTabId),
    [activeTabId, notifications]
  );

  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(visibleNotifications),
    [visibleNotifications]
  );

  const handleOpenNotification = async (notificationId) => {
    const notification = notifications.find((item) => item.id === notificationId);

    if (!notification || notification.read || notification.deleted) {
      return;
    }

    await markAsRead(notificationId);
  };

  const handleDeleteNotification = async (notificationId) => {
    await moveToTrash(notificationId);

    if (activeTabId !== "trash") {
      setActiveTabId("trash");
    }
  };

  return (
    <section className="notifications-page gm-dark-section-bg">
      <div className="gm-container notifications-page__container">
        <header className="notifications-page__header">
          <h1 className="notifications-page__title">NOTIFICATIONS</h1>
          <p className="notifications-page__intro">
            Stay updated with your classes, booking and gym news.
          </p>
        </header>

        <NotificationsTabBar
          activeTabId={activeTabId}
          onSelectTab={setActiveTabId}
        />

        <NotificationsPanel
          activeTabId={activeTabId}
          error={error}
          groupedNotifications={groupedNotifications}
          loading={loading}
          onDeleteNotification={handleDeleteNotification}
          onOpenNotification={handleOpenNotification}
          visibleNotifications={visibleNotifications}
        />
      </div>
    </section>
  );
}
