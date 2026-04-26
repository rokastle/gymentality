import IconImage from "../common/IconImage";
import CreditCardPaymentForm from "../payment/CreditCardPaymentForm";

export default function ProfilePaymentMethodSection({
  storedCard,
  isPaymentEditOpen,
  cardForm,
  paymentErrors,
  paymentTouched,
  paymentSubmitAttempted,
  onOpenPaymentEdit,
  onCancelPaymentEdit,
  onCardFormChange,
  onCardBlur,
}) {
  return (
    <section className="my-profile-page__section">
      <h2 className="my-profile-page__section-title">PAYMENT METHOD</h2>

      <div className="my-profile-page__section-divider" />

      <div className="my-profile-page__payment-card">
        <div className="my-profile-page__payment-icon">
          <IconImage
            name="creditCard"
            alt="Credit card"
            decorative={false}
            className="my-profile-page__payment-icon-image"
          />
        </div>

        <div className="my-profile-page__payment-info">
          <strong>
            {storedCard.hasStoredCard ? storedCard.brand : "No payment method"}
          </strong>

          {storedCard.hasStoredCard ? (
            <>
              <span>Card number: XXXX-XXXX-XXXX-{storedCard.last4}</span>
              <span>
                Expiration date: {storedCard.expiryYear}/
                {storedCard.expiryMonth}
              </span>
            </>
          ) : (
            <span>No saved card yet.</span>
          )}
        </div>

        {!isPaymentEditOpen && (
          <button
            type="button"
            className="my-profile-page__payment-action"
            onClick={onOpenPaymentEdit}
          >
            {storedCard.hasStoredCard ? "Edit" : "Add"}
          </button>
        )}
      </div>

      {!isPaymentEditOpen && (
        <>
          <label className="my-profile-page__checkbox-row">
            <input
              type="checkbox"
              checked={storedCard.saveCardForFuture ?? true}
              readOnly
            />
            <span>Save card for future payments</span>
          </label>

          <p className="my-profile-page__payment-note">
            Card details are protected according to payment card industry
            security standards.
          </p>
        </>
      )}

      {isPaymentEditOpen && (
        <div className="my-profile-page__payment-edit">
          <CreditCardPaymentForm
            cardForm={cardForm}
            onChange={onCardFormChange}
            onBlur={onCardBlur}
            errors={paymentErrors}
            touched={paymentTouched}
            submitAttempted={paymentSubmitAttempted}
          />

          <button
            type="button"
            className="my-profile-page__payment-cancel"
            onClick={onCancelPaymentEdit}
          >
            Cancel payment edit
          </button>
        </div>
      )}
    </section>
  );
}