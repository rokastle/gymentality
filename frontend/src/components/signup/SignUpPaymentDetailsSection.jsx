import CreditCardPaymentForm from "../payment/CreditCardPaymentForm";
import { FormCheckbox } from "../forms";

export default function SignUpPaymentDetailsSection({
  form,
  onCreditCardChange,
  onBlur,
  errors,
  touched,
  submitAttempted,
  fieldRefs,
}) {
  const setFieldRef = (fieldName) => (element) => {
    if (fieldRefs?.current) {
      fieldRefs.current[fieldName] = element;
    }
  };

  return (
    <section className="signup-details-page__section">
      <h2 className="signup-details-page__section-title">Payment details</h2>

      <div className="signup-details-page__payment-box">
        <div className="signup-details-page__payment-option">
          <div>
            <strong>Pay by card</strong>
            <span>Secure payment with Visa and Mastercard</span>
          </div>

          <div className="signup-details-page__payment-brands">
            <span className="signup-details-page__payment-brand-dot signup-details-page__payment-brand-dot--red" />
            <span className="signup-details-page__payment-brand-dot signup-details-page__payment-brand-dot--orange" />
            <strong>VISA</strong>
          </div>
        </div>

        <CreditCardPaymentForm
          cardForm={{
            cardholder: form.cardholder,
            cardNumber: form.cardNumber,
            expiryMonth: form.expiryMonth,
            expiryYear: form.expiryYear,
            cvv: form.cvv,
            saveForFuture: form.saveCardForFuture,
          }}
          onChange={onCreditCardChange}
          onBlur={onBlur}
          errors={errors}
          touched={touched}
          submitAttempted={submitAttempted}
          inputRefs={fieldRefs?.current}
          compact
        />
      </div>

      <FormCheckbox
        ref={setFieldRef("acceptedTerms")}
        label="I accept the terms and privacy policy"
        name="acceptedTerms"
        checked={form.acceptedTerms}
        onChange={onCreditCardChange}
        onBlur={onBlur}
        required
        error={errors.acceptedTerms}
        touched={touched.acceptedTerms}
        submitAttempted={submitAttempted}
        className="signup-details-page__checkbox"
        errorClassName="signup-details-page__error"
      />
    </section>
  );
}