function buildClassName(parts) {
  return parts.filter(Boolean).join(" ");
}

function shouldShowError(fieldName, errors, touched, submitAttempted) {
  return Boolean((touched[fieldName] || submitAttempted) && errors[fieldName]);
}

function getFieldStateClass(fieldName, errors, touched, submitAttempted) {
  const shouldShowState = touched[fieldName] || submitAttempted;

  if (!shouldShowState) {
    return "";
  }

  return errors[fieldName] ? "is-invalid" : "is-valid";
}

function renderError(fieldName, errors, touched, submitAttempted) {
  const visible = shouldShowError(fieldName, errors, touched, submitAttempted);

  return (
    <small
      id={`${fieldName}-payment-error`}
      className="credit-card-payment-form__error"
      role={visible ? "alert" : undefined}
      aria-live="polite"
    >
      {visible ? errors[fieldName] : "\u00A0"}
    </small>
  );
}

export default function CreditCardPaymentForm({
  cardForm,
  onChange,
  onBlur,
  errors = {},
  touched = {},
  submitAttempted = false,
  inputRefs,
  compact = false,
  showTitle = true,
  className = "",
}) {
  const setInputRef = (fieldName) => (element) => {
    if (inputRefs) {
      inputRefs[fieldName] = element;
    }
  };

  const getInputClassName = (fieldName) =>
    buildClassName([
      "credit-card-payment-form__input",
      getFieldStateClass(fieldName, errors, touched, submitAttempted),
    ]);

  return (
    <div
      className={buildClassName([
        "credit-card-payment-form",
        compact && "credit-card-payment-form--compact",
        className,
      ])}
    >
      {showTitle && (
        <h3 className="credit-card-payment-form__title">
          Enter your card details:
        </h3>
      )}

      <label className="credit-card-payment-form__field">
        <input
          ref={setInputRef("cardholder")}
          type="text"
          name="cardholder"
          value={cardForm.cardholder}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Cardholder name"
          className={getInputClassName("cardholder")}
          autoComplete="cc-name"
          aria-invalid={shouldShowError(
            "cardholder",
            errors,
            touched,
            submitAttempted
          )}
          aria-describedby="cardholder-payment-error"
        />
        {renderError("cardholder", errors, touched, submitAttempted)}
      </label>

      <label className="credit-card-payment-form__field">
        <input
          ref={setInputRef("cardNumber")}
          type="text"
          name="cardNumber"
          value={cardForm.cardNumber}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Card number"
          inputMode="numeric"
          className={getInputClassName("cardNumber")}
          autoComplete="cc-number"
          aria-invalid={shouldShowError(
            "cardNumber",
            errors,
            touched,
            submitAttempted
          )}
          aria-describedby="cardNumber-payment-error"
        />
        {renderError("cardNumber", errors, touched, submitAttempted)}
      </label>

      <div className="credit-card-payment-form__grid">
        <label className="credit-card-payment-form__field">
          <select
            ref={setInputRef("expiryMonth")}
            name="expiryMonth"
            value={cardForm.expiryMonth}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClassName("expiryMonth")}
            autoComplete="cc-exp-month"
            aria-invalid={shouldShowError(
              "expiryMonth",
              errors,
              touched,
              submitAttempted
            )}
            aria-describedby="expiryMonth-payment-error"
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
          {renderError("expiryMonth", errors, touched, submitAttempted)}
        </label>

        <label className="credit-card-payment-form__field">
          <select
            ref={setInputRef("expiryYear")}
            name="expiryYear"
            value={cardForm.expiryYear}
            onChange={onChange}
            onBlur={onBlur}
            className={getInputClassName("expiryYear")}
            autoComplete="cc-exp-year"
            aria-invalid={shouldShowError(
              "expiryYear",
              errors,
              touched,
              submitAttempted
            )}
            aria-describedby="expiryYear-payment-error"
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
          {renderError("expiryYear", errors, touched, submitAttempted)}
        </label>

        <label className="credit-card-payment-form__field">
          <input
            ref={setInputRef("cvv")}
            type="text"
            name="cvv"
            value={cardForm.cvv}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="CVV"
            inputMode="numeric"
            maxLength={4}
            className={getInputClassName("cvv")}
            autoComplete="cc-csc"
            aria-invalid={shouldShowError("cvv", errors, touched, submitAttempted)}
            aria-describedby="cvv-payment-error"
          />
          {renderError("cvv", errors, touched, submitAttempted)}
        </label>
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