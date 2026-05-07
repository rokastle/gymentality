import NotificationCard from "./NotificationCard";

export default function NotificationsPanel({
  activeTabId,
  error,
  groupedNotifications,
  loading,
  onDeleteNotification,
  onOpenNotification,
  visibleNotifications,
}) {
  return (
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
                    onOpen={onOpenNotification}
                    onDelete={onDeleteNotification}
                  />
                ))}
              </div>
            </section>
          )
        )
      )}
    </div>
  );
}
