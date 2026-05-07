import { formatLongDate } from "../../utils/membershipPageUtils";

export default function CancellationModals({
  cancelModalStep,
  nextPaymentDate,
  onCloseCancellationNotice,
  onConfirmCancellation,
  onKeepMembership,
}) {
  if (cancelModalStep === "confirm") {
    return (
      <div className="my-membership-page__modal-backdrop">
        <div
          className="my-membership-page__modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-membership-title"
        >
          <h2
            id="cancel-membership-title"
            className="my-membership-page__modal-title"
          >
            Are you sure you want to cancel your membership?
          </h2>

          <p className="my-membership-page__modal-text">
            Your membership will remain active until:
          </p>

          <p className="my-membership-page__modal-highlight">
            {formatLongDate(nextPaymentDate)}
          </p>

          <p className="my-membership-page__modal-text">
            You can continue using all member benefits until that date.
          </p>

          <div className="my-membership-page__modal-actions">
            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
              onClick={onConfirmCancellation}
            >
              YES, CANCEL
            </button>

            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
              onClick={onKeepMembership}
            >
              NO, KEEP IT
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cancelModalStep === "scheduled") {
    return (
      <div className="my-membership-page__modal-backdrop">
        <div
          className="my-membership-page__modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="membership-cancelled-title"
        >
          <h2
            id="membership-cancelled-title"
            className="my-membership-page__modal-title"
          >
            Cancellation scheduled
          </h2>

          <p className="my-membership-page__modal-text">
            Your membership will stay active until:
          </p>

          <p className="my-membership-page__modal-highlight">
            {formatLongDate(nextPaymentDate)}
          </p>

          <p className="my-membership-page__modal-text">
            After that date, your member access will be disabled automatically.
          </p>

          <div className="my-membership-page__modal-actions my-membership-page__modal-actions--single">
            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
              onClick={onCloseCancellationNotice}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
