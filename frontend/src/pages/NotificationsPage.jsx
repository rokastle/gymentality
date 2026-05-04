import { useMemo, useState } from "react";
import IconImage from "../components/common/IconImage";
import { useNotifications } from "../hooks/useNotifications";

const NOTIFICATION_TABS = [
  { id: "all", label: "ALL", icon: "allNotifications" },
  { id: "unread", label: "UNREAD", icon: "unreadNotifications" },
  { id: "bookings", label: "BOOKING", icon: "bookClass" },
  { id: "classes", label: "CLASS", icon: "class" },
  { id: "membership", label: "MEMBERSHIP", icon: "membership" },
  { id: "trash", label: "TRASH", icon: "notificationTrash" },
];

const CATEGORY_ICON_NAMES = {
  classes: "class",
  bookings: "bookClass",
  membership: "membership",
  promotions: "promotions",
};

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

function sortUnreadFirstByDate(notifications) {
  return [...notifications].sort((a, b) => {
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function NotificationCard({ notification, isTrashView, onOpen, onDelete }) {
  const iconName = CATEGORY_ICON_NAMES[notification.category] ?? "notifications";
  const canOpen = !notification.deleted;

  const handleOpen = () => {
    if (canOpen) {
      onOpen(notification.id);
    }
  };

  const handleKeyDown = (event) => {
    if (!canOpen || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    onOpen(notification.id);
  };

  return (
    <article
      className={`notifications-page__item ${
        notification.read ? "" : "is-unread"
      } ${notification.deleted ? "is-deleted" : ""}`}
      role={canOpen ? "button" : undefined}
      tabIndex={canOpen ? 0 : undefined}
      onPointerDown={handleOpen}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
    >
      {!notification.read && !notification.deleted && (
        <IconImage
          name="newMessage"
          decorative
          className="notifications-page__new-icon"
        />
      )}

      <div
        className="notifications-page__item-main"
      >
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
      </div>

      <span className="notifications-page__item-side">
        <span className="notifications-page__item-time">
          {formatRelativeTime(notification.createdAt)}
        </span>

        {!isTrashView && (
          <button
            type="button"
            className="notifications-page__delete-btn"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(notification.id);
            }}
            aria-label={`Move ${notification.title} to trash`}
          >
            <IconImage
              name="deleteNotification"
              decorative
              className="notifications-page__delete-icon"
            />
          </button>
        )}
      </span>
    </article>
  );
}

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    error,
    markAsRead,
    moveToTrash,
  } = useNotifications();
  const [activeTabId, setActiveTabId] = useState("all");

  const visibleNotifications = useMemo(() => {
    if (activeTabId === "trash") {
      return notifications.filter((notification) => notification.deleted);
    }

    const activeNotifications = notifications.filter(
      (notification) => !notification.deleted
    );

    if (activeTabId === "all") {
      return sortUnreadFirstByDate(activeNotifications);
    }

    if (activeTabId === "unread") {
      return activeNotifications.filter((notification) => !notification.read);
    }

    return activeNotifications.filter(
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
              <IconImage
                name={tab.icon}
                decorative
                className="notifications-page__tab-icon"
              />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="notifications-page__panel gm-surface-card">
          {loading ? (
            <p className="notifications-page__empty">Loading notifications...</p>
          ) : error ? (
            <p className="notifications-page__empty">{error}</p>
          ) : visibleNotifications.length === 0 ? (
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
                        isTrashView={activeTabId === "trash"}
                        onOpen={handleOpenNotification}
                        onDelete={handleDeleteNotification}
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
