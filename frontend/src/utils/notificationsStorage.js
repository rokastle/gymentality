const STORAGE_PREFIX = "gm_notifications";

export function getUserNotificationStorageKey(userId = "guest") {
  return `${STORAGE_PREFIX}_${userId}`;
}

function normalizeStoredNotification(notification) {
  return {
    read: false,
    createdAt: new Date().toISOString(),
    ...notification,
  };
}

export function readStoredNotifications(userId) {
  try {
    const raw = localStorage.getItem(getUserNotificationStorageKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed.map(normalizeStoredNotification) : [];
  } catch {
    return [];
  }
}

export function saveStoredNotifications(userId, notifications) {
  localStorage.setItem(
    getUserNotificationStorageKey(userId),
    JSON.stringify(notifications)
  );
}

export function upsertStoredNotification(userId, notification) {
  const notifications = readStoredNotifications(userId);
  const normalizedNotification = normalizeStoredNotification(notification);
  const existingIndex = notifications.findIndex(
    (item) => item.id === normalizedNotification.id
  );

  const nextNotifications =
    existingIndex >= 0
      ? notifications.map((item, index) =>
          index === existingIndex ? { ...item, ...normalizedNotification } : item
        )
      : [normalizedNotification, ...notifications];

  saveStoredNotifications(userId, nextNotifications);
  return nextNotifications;
}

export function markStoredNotificationAsRead(userId, notificationId) {
  const notifications = readStoredNotifications(userId);
  const nextNotifications = notifications.map((notification) =>
    notification.id === notificationId
      ? { ...notification, read: true }
      : notification
  );

  saveStoredNotifications(userId, nextNotifications);
  return nextNotifications;
}

export function buildClassNotifyRequestedNotification(item) {
  return {
    id: `class-notify-requested-${item.clubClassId}-${item.classDate}`,
    category: "classes",
    title: "Class reminder created",
    eyebrow: `${item.className} ${item.startTime?.slice(0, 5) ?? ""}`.trim(),
    message: `We will notify you when ${item.className} opens for booking.`,
    createdAt: new Date().toISOString(),
    read: false,
    metadata: {
      clubClassId: item.clubClassId,
      classDate: item.classDate,
      bookingOpensAt: item.bookingOpensAt,
    },
  };
}

export function buildClassBookingOpenNotification(item) {
  return {
    id: `class-booking-open-${item.clubClassId}-${item.classDate}`,
    category: "classes",
    title: "Class available to book",
    eyebrow: `${item.className} ${item.startTime?.slice(0, 5) ?? ""}`.trim(),
    message: `${item.className} is now open for booking. Reserve your spot now.`,
    createdAt: new Date().toISOString(),
    read: false,
    metadata: {
      clubClassId: item.clubClassId,
      classDate: item.classDate,
      bookingOpensAt: item.bookingOpensAt,
    },
  };
}

export function buildClassBookedNotification(item, bookingStatus = "BOOKED") {
  const waitlisted = bookingStatus === "WAITLISTED";

  return {
    id: `booking-${bookingStatus.toLowerCase()}-${item.clubClassId}-${item.classDate}`,
    category: "bookings",
    title: waitlisted ? "Added to waiting list" : "Class booking confirmed",
    eyebrow: `${item.className} ${item.startTime?.slice(0, 5) ?? ""}`.trim(),
    message: waitlisted
      ? `You have been added to the waiting list for ${item.className}.`
      : `Your spot for ${item.className} has been reserved successfully.`,
    createdAt: new Date().toISOString(),
    read: false,
    metadata: {
      clubClassId: item.clubClassId,
      classDate: item.classDate,
      bookingStatus,
    },
  };
}
