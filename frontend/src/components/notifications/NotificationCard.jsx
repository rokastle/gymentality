import IconImage from "../common/IconImage";
import {
  CATEGORY_ICON_NAMES,
  formatRelativeTime,
} from "../../utils/notificationsPageUtils";

export default function NotificationCard({
  notification,
  isTrashView,
  onOpen,
  onDelete,
}) {
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

      <div className="notifications-page__item-main">
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
