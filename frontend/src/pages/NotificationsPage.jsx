import { useEffect, useMemo, useState } from "react";
import IconImage from "../components/common/IconImage";
import useAuth from "../hooks/useAuth";
import {
  markStoredNotificationAsRead,
  readStoredNotifications,
  saveStoredNotifications,
} from "../utils/notificationsStorage";

const NOTIFICATION_TABS = [
  { id: "all", label: "ALL" },
  { id: "unread", label: "UNREAD" },
  { id: "bookings", label: "BOOKINGS" },
  { id: "classes", label: "CLASSES" },
  { id: "membership", label: "MEMBERSHIP" },
  { id: "promotions", label: "PROMOTIONS" },
];

const CATEGORY_ICON_NAMES = {
  classes: "class",
  bookings: "bookClass",
  membership: "membership",
  promotions: "promotions",
};

function getSeedNotifications() {
  const now = new Date();
  const minutesAgo = (minutes) =>
    new Date(now.getTime() - minutes * 60 * 1000).toISOString();

  return [
    {
      id: "seed-class-open",
      category: "classes",
      title: "Class available to book",
      eyebrow: "FRIDAY 13:20 A.M",
      message: "New beginners course starting this Friday, booking now open!",
      createdAt: minutesAgo(20),
      read: false,
    },
    {
      id: "seed-booking-confirmed",
      category: "bookings",
      title: "Booking confirmed",
      eyebrow: "TODAY",
      message: "Your class reservation has been confirmed successfully.",
      createdAt: minutesAgo(42),
      read: true,
    },
    {
      id: "seed-membership-renewal",
      category: "membership",
      title: "Membership reminder",
      eyebrow: "THIS WEEK",
      message: "Your next membership payment is scheduled soon.",
      createdAt: minutesAgo(140),
      read: true,
    },
    {
      id: "seed-promotion",
      category: "promotions",
      title: "Member promotion",
      eyebrow: "GYMENTALITY",
      message: "Invite a friend and unlock a special member reward.",
      createdAt: minutesAgo(210),
      read: true,
    },
  ];
}

function formatRelativeTime(value) {
  const createdAt = new Date(value);

  if (Number.isNaN(createdAt.getTime())) {
    return "";
  }

  const diffMinutes = Math.max(
    1,
    Math.round((Date.now() - createdAt.getTime()) / 60000)
  );

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} d ago`;
}

function getDateGroupLabel(value) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "TODAY";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "YESTERDAY";
  }

  return date.toLocaleDateString("en-GB", {
    month: "long",
    day: "numeric",
  }).toUpperCase();
}

function mergeNotifications(storedNotifications) {
  const storedIds = new Set(storedNotifications.map((item) => item.id));
  const seedNotifications = getSeedNotifications().filter(
    (item) => !storedIds.has(item.id)
  );

  return [...storedNotifications, ...seedNotifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function NotificationCard({ notification, onOpen }) {
  const iconName = CATEGORY_ICON_NAMES[notification.category] ?? "notifications";

  return (
    <button
      type="button"
      className={`notifications-page__item ${
        notification.read ? "" : "is-unread"
      }`}
      onClick={() => onOpen(notification.id)}
    >
      {!notification.read && (
        <IconImage
          name="newMessage"
          decorative
          className="notifications-page__new-icon"
        />
      )}

      <span className="notifications-page__item-icon-shell">
        <IconImage
          name={iconName}
          decorative
          className="notifications-page__item-icon"
        />
      </span>

      <span className="notifications-page__item-content">
        <strong className="notifications-page__item-title">
          {notification.title}
        </strong>
        <span className="notifications-page__item-eyebrow">
          {notification.eyebrow}
        </span>
        <span className="notifications-page__item-message">
          {notification.message}
        </span>
      </span>

      <span className="notifications-page__item-side">
        <span className="notifications-page__item-time">
          {formatRelativeTime(notification.createdAt)}
        </span>
        <span className="notifications-page__item-arrow" aria-hidden="true">
          &gt;
        </span>
      </span>
    </button>
  );
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const userId = user?.id ?? "guest";
  const [activeTabId, setActiveTabId] = useState("all");
  const [storedNotifications, setStoredNotifications] = useState([]);

  useEffect(() => {
    setStoredNotifications(readStoredNotifications(userId));
  }, [userId]);

  const notifications = useMemo(
    () => mergeNotifications(storedNotifications),
    [storedNotifications]
  );

  const visibleNotifications = useMemo(() => {
    if (activeTabId === "all") {
      return notifications;
    }

    if (activeTabId === "unread") {
      return notifications.filter((notification) => !notification.read);
    }

    return notifications.filter(
      (notification) => notification.category === activeTabId
    );
  }, [activeTabId, notifications]);

  const groupedNotifications = useMemo(() => {
    return visibleNotifications.reduce((groups, notification) => {
      const label = getDateGroupLabel(notification.createdAt);
      const currentGroup = groups.get(label) ?? [];
      groups.set(label, [...currentGroup, notification]);
      return groups;
    }, new Map());
  }, [visibleNotifications]);

  const handleOpenNotification = (notificationId) => {
    const notification = notifications.find((item) => item.id === notificationId);

    if (!notification || notification.read) {
      return;
    }

    const storedNotificationExists = storedNotifications.some(
      (item) => item.id === notificationId
    );
    const nextStoredNotifications = storedNotificationExists
      ? markStoredNotificationAsRead(userId, notificationId)
      : [{ ...notification, read: true }, ...storedNotifications];

    if (!storedNotificationExists) {
      saveStoredNotifications(userId, nextStoredNotifications);
    }

    setStoredNotifications(nextStoredNotifications);
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

        <div className="notifications-page__tabbar">
          {NOTIFICATION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`notifications-page__tab ${
                tab.id === activeTabId ? "is-active" : ""
              }`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="notifications-page__panel gm-surface-card">
          {visibleNotifications.length === 0 ? (
            <p className="notifications-page__empty">
              No notifications in this section.
            </p>
          ) : (
            Array.from(groupedNotifications.entries()).map(
              ([groupLabel, groupNotifications]) => (
                <section
                  key={groupLabel}
                  className="notifications-page__group"
                  aria-labelledby={`notifications-${groupLabel}`}
                >
                  <h2
                    id={`notifications-${groupLabel}`}
                    className="notifications-page__group-title"
                  >
                    {groupLabel}
                  </h2>

                  <div className="notifications-page__list">
                    {groupNotifications.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onOpen={handleOpenNotification}
                      />
                    ))}
                  </div>
                </section>
              )
            )
          )}
        </div>
      </div>
    </section>
  );
}
