export default function ConfirmCancelBookingModal({ open, onConfirm, onClose }) {
  if (!open) return null;

  return (
    <div className="book-class-page__modal-overlay" role="presentation">
      <div
        className="book-class-page__modal"
        role="dialog"
        aria-modal="true"
        aria-label="Cancel reservation"
      >
        <p className="book-class-page__modal-message">
          Are you sure you want to cancel the reservation?
        </p>

        <div className="book-class-page__modal-actions">
          <button
            type="button"
            className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__modal-btn"
            onClick={onConfirm}
          >
            YES
          </button>

          <button
            type="button"
            className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__modal-btn"
            onClick={onClose}
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
