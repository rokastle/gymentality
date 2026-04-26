import { FormField, FormSelect } from "../forms";

function buildClassName(parts) {
  return parts.filter(Boolean).join(" ");
}

const expiryMonthOptions = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0")
);

function getExpiryYearOptions() {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: 12 }, (_, index) =>
    String(currentYear + index)
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

  const getPaymentFieldProps = (fieldName) => ({
    error: errors[fieldName],
    touched: touched[fieldName],
    submitAttempted,
    className: "credit-card-payment-form__field",
    controlClassName: "credit-card-payment-form__input",
    errorClassName: "credit-card-payment-form__error",
    errorId: `${fieldName}-payment-error`,
    showLabel: false,
  });

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

      <FormField
        ref={setInputRef("cardholder")}
        type="text"
        name="cardholder"
        value={cardForm.cardholder}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="Cardholder name"
        autoComplete="cc-name"
        {...getPaymentFieldProps("cardholder")}
      />

      <FormField
        ref={setInputRef("cardNumber")}
        type="text"
        name="cardNumber"
        value={cardForm.cardNumber}
        onChange={onChange}
        onBlur={onBlur}
        placeholder="Card number"
        inputMode="numeric"
        autoComplete="cc-number"
        {...getPaymentFieldProps("cardNumber")}
      />

      <div className="credit-card-payment-form__grid">
        <FormSelect
          ref={setInputRef("expiryMonth")}
          name="expiryMonth"
          value={cardForm.expiryMonth}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Expiry month"
          options={expiryMonthOptions}
          autoComplete="cc-exp-month"
          {...getPaymentFieldProps("expiryMonth")}
        />

        <FormSelect
          ref={setInputRef("expiryYear")}
          name="expiryYear"
          value={cardForm.expiryYear}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Expiry year"
          options={getExpiryYearOptions()}
          autoComplete="cc-exp-year"
          {...getPaymentFieldProps("expiryYear")}
        />

        <FormField
          ref={setInputRef("cvv")}
          type="text"
          name="cvv"
          value={cardForm.cvv}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="CVV"
          inputMode="numeric"
          maxLength={4}
          autoComplete="cc-csc"
          {...getPaymentFieldProps("cvv")}
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