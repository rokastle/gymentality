export const NOTIFICATION_TABS = [
  { id: "all", label: "ALL", icon: "allNotifications" },
  { id: "unread", label: "UNREAD", icon: "unreadNotifications" },
  { id: "bookings", label: "BOOKING", icon: "bookClass" },
  { id: "classes", label: "CLASS", icon: "class" },
  { id: "membership", label: "MEMBERSHIP", icon: "membership" },
  { id: "trash", label: "TRASH", icon: "notificationTrash" },
];

export const CATEGORY_ICON_NAMES = {
  classes: "class",
  bookings: "bookClass",
  membership: "membership",
  promotions: "promotions",
};

export function formatRelativeTime(value) {
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

export function getDateGroupLabel(value) {
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

  return date
    .toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

export function sortUnreadFirstByDate(notifications) {
  return [...notifications].sort((a, b) => {
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

export function getVisibleNotifications(notifications, activeTabId) {
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
}

export function groupNotificationsByDate(notifications) {
  return notifications.reduce((groups, notification) => {
    const label = getDateGroupLabel(notification.createdAt);
    const currentGroup = groups.get(label) ?? [];
    groups.set(label, [...currentGroup, notification]);
    return groups;
  }, new Map());
}
