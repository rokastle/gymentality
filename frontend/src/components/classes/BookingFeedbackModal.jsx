export default function BookingFeedbackModal({ open, message, onClose }) {
  if (!open) return null;

  return (
    <div className="book-class-page__modal-overlay" role="presentation">
      <div
        className="book-class-page__modal"
        role="dialog"
        aria-modal="true"
        aria-label="Booking feedback"
      >
        <p className="book-class-page__modal-message">{message}</p>

        <button
          type="button"
          className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__modal-btn"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  );
}
