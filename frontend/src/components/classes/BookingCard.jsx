import getClassImageByName from "../../utils/getClassImageByName";
import {
  addOneHour,
  formatBookingOpensAt,
  formatPrettyTime,
  getCardMeta,
} from "../../utils/bookClassPageUtils";
import iconScheduleWhite from "../../assets/icons/icon_scheduleWhite_80x80.png";
import iconGroupClass from "../../assets/icons/icon_groupClass_180x180.png";
import iconSandClock from "../../assets/icons/icon_sandClock_180x180.png";
import iconLockWhite from "../../assets/icons/icon_lockWhite_180x180.png";
import iconNotificationBlack from "../../assets/icons/icon_notificationBlack_180x180.png";

export default function BookingCard({
  item,
  isBusy,
  onReserve,
  onCancel,
  onNotify,
}) {
  const imageSrc = getClassImageByName(item.className);
  const startTime = formatPrettyTime(item.startTime);
  const endTime = addOneHour(item.startTime);

  const isBooked = item.state === "BOOKED";
  const isAvailable = item.state === "AVAILABLE";
  const isFullWaitlistAvailable = item.state === "FULL_WAITLIST_AVAILABLE";
  const isWaitlisted = item.state === "WAITLISTED";
  const isBookingNotOpen = item.state === "BOOKING_NOT_OPEN";

  return (
    <article className="book-class-page__card gm-surface-card">
      <div className="book-class-page__card-image-wrapper">
        <img
          src={imageSrc}
          alt={item.className}
          className="book-class-page__card-image"
        />
      </div>

      <div className="book-class-page__card-content">
        <div className="book-class-page__card-top">
          <div className="book-class-page__card-main">
            <h3 className="book-class-page__card-title">{item.className}</h3>
            <p className="book-class-page__card-meta">{getCardMeta(item)}</p>

            <div className="book-class-page__card-time">
              <img
                src={iconScheduleWhite}
                alt=""
                className="book-class-page__icon book-class-page__icon--time"
              />
              <span>
                {startTime} - {endTime}
              </span>
            </div>
          </div>

          <div className="book-class-page__card-actions">
            <BookingCardAction
              isAvailable={isAvailable}
              isBooked={isBooked}
              isBookingNotOpen={isBookingNotOpen}
              isBusy={isBusy}
              isFullWaitlistAvailable={isFullWaitlistAvailable}
              isWaitlisted={isWaitlisted}
              item={item}
              onCancel={onCancel}
              onNotify={onNotify}
              onReserve={onReserve}
            />
          </div>
        </div>

        <div className="book-class-page__card-divider" />

        <div className="book-class-page__card-footer">
          <div className="book-class-page__card-footer-main">
            <div className="book-class-page__card-stat">
              <img
                src={iconGroupClass}
                alt=""
                className="book-class-page__icon book-class-page__icon--stat"
              />
              <span>
                Available spots: {item.availableSpots} / {item.capacity}
              </span>
            </div>

            {isFullWaitlistAvailable && (
              <div className="book-class-page__card-stat">
                <img
                  src={iconSandClock}
                  alt=""
                  className="book-class-page__icon book-class-page__icon--stat"
                />
                <span>Waiting list available</span>
              </div>
            )}

            {isWaitlisted && (
              <div className="book-class-page__card-stat">
                <img
                  src={iconSandClock}
                  alt=""
                  className="book-class-page__icon book-class-page__icon--stat"
                />
                <span>Ahead of you: {item.myWaitlistPosition ?? "-"}</span>
              </div>
            )}
          </div>

          {isBookingNotOpen && (
            <div className="book-class-page__card-footer-side">
              <div className="book-class-page__booking-opens-info book-class-page__card-stat">
                <img
                  src={iconLockWhite}
                  alt=""
                  className="book-class-page__icon book-class-page__icon--lock"
                />
                <span>
                  Booking opens at {formatBookingOpensAt(item.bookingOpensAt)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function BookingCardAction({
  isAvailable,
  isBooked,
  isBookingNotOpen,
  isBusy,
  isFullWaitlistAvailable,
  isWaitlisted,
  item,
  onCancel,
  onNotify,
  onReserve,
}) {
  if (isBooked) {
    return (
      <button
        type="button"
        className="gm-btn gm-btn--pill gm-btn--outline-danger book-class-page__action-btn"
        onClick={() => onCancel(item)}
        disabled={isBusy}
      >
        CANCEL RESERVATION
      </button>
    );
  }

  if (isAvailable) {
    return (
      <button
        type="button"
        className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__action-btn"
        onClick={() => onReserve(item)}
        disabled={isBusy}
      >
        RESERVE
      </button>
    );
  }

  if (isFullWaitlistAvailable) {
    return (
      <button
        type="button"
        className="gm-btn gm-btn--pill gm-btn--outline-yellow book-class-page__action-btn"
        onClick={() => onReserve(item)}
        disabled={isBusy}
      >
        SIGN UP TO THE WAITING LIST
      </button>
    );
  }

  if (isWaitlisted) {
    return (
      <span className="book-class-page__waiting-badge gm-pill gm-pill--outline-yellow">
        WAITING
      </span>
    );
  }

  if (!isBookingNotOpen) {
    return null;
  }

  if (item.notifyRequested) {
    return (
      <span className="book-class-page__notify-info gm-pill gm-pill--outline-locked">
        <img
          src={iconNotificationBlack}
          alt=""
          className="book-class-page__icon book-class-page__icon--notify book-class-page__icon--notify-info"
        />
        NOTIFIED
      </span>
    );
  }

  return (
    <button
      type="button"
      className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__notify-btn"
      onClick={() => onNotify(item)}
      disabled={isBusy}
    >
      <img
        src={iconNotificationBlack}
        alt=""
        className="book-class-page__icon book-class-page__icon--notify"
      />
      NOTIFY ME
    </button>
  );
}
