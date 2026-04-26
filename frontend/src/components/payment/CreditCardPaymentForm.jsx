export default function CreditCardPaymentForm({
  cardForm,
  onChange,
  compact = false,
  showTitle = true,
}) {
  return (
    <div
      className={`credit-card-payment-form ${
        compact ? "credit-card-payment-form--compact" : ""
      }`}
    >
      {showTitle && (
        <h3 className="credit-card-payment-form__title">
          Enter your card details:
        </h3>
      )}

      <input
        type="text"
        name="cardholder"
        value={cardForm.cardholder}
        onChange={onChange}
        placeholder="Cardholder name"
        className="credit-card-payment-form__input"
        autoComplete="cc-name"
      />

      <input
        type="text"
        name="cardNumber"
        value={cardForm.cardNumber}
        onChange={onChange}
        placeholder="Card number"
        inputMode="numeric"
        className="credit-card-payment-form__input"
        autoComplete="cc-number"
      />

      <div className="credit-card-payment-form__grid">
        <select
          name="expiryMonth"
          value={cardForm.expiryMonth}
          onChange={onChange}
          className="credit-card-payment-form__input"
          autoComplete="cc-exp-month"
        >
          <option value="">Expiry month</option>
          {Array.from({ length: 12 }, (_, index) => {
            const month = String(index + 1).padStart(2, "0");

            return (
              <option key={month} value={month}>
                {month}
              </option>
            );
          })}
        </select>

        <select
          name="expiryYear"
          value={cardForm.expiryYear}
          onChange={onChange}
          className="credit-card-payment-form__input"
          autoComplete="cc-exp-year"
        >
          <option value="">Expiry year</option>
          {Array.from({ length: 12 }, (_, index) => {
            const year = String(new Date().getFullYear() + index);

            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>

        <input
          type="text"
          name="cvv"
          value={cardForm.cvv}
          onChange={onChange}
          placeholder="CVV"
          inputMode="numeric"
          maxLength={4}
          className="credit-card-payment-form__input"
          autoComplete="cc-csc"
        />
      </div>

      <label className="credit-card-payment-form__save-row">
        <input
          type="checkbox"
          name="saveForFuture"
          checked={cardForm.saveForFuture}
          onChange={onChange}
        />
        <span>Save card for future purchases</span>
      </label>
    </div>
  );
}