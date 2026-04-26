import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import IconImage from "../components/common/IconImage";
import CreditCardPaymentForm from "../components/payment/CreditCardPaymentForm";

const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function formatDateForInput(value) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toISOString().slice(0, 10);
}

function getInitialProfileForm(user) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: formatDateForInput(user?.dateOfBirth),
    phone: user?.phone || "",
    address: user?.address || "",
    postalCode: user?.postalCode || "",
    city: user?.city || "",
    country: user?.country || "España",
    region: user?.region || "",
    email: user?.email || "",
    newEmail: "",
  };
}

function getInitialStoredCard(user) {
  const hasStoredCard = Boolean(user?.cardLast4);

  return {
    brand: user?.paymentMethod?.toUpperCase() === "CARD" ? "VISA" : "VISA",
    last4: user?.cardLast4 || "----",
    expiryMonth: user?.cardExpiryMonth || "",
    expiryYear: user?.cardExpiryYear || "",
    saveCardForFuture: user?.saveCardForFuture ?? true,
    hasStoredCard,
  };
}

function getCardBrand(cardNumber) {
  const cleanNumber = cardNumber.replace(/\D/g, "");

  if (cleanNumber.startsWith("4")) {
    return "VISA";
  }

  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return "MASTERCARD";
  }

  return "CARD";
}

export default function MyProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const initialForm = useMemo(() => getInitialProfileForm(user), [user]);
  const initialStoredCard = useMemo(() => getInitialStoredCard(user), [user]);

  const [form, setForm] = useState(initialForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [isEmailChangeEnabled, setIsEmailChangeEnabled] = useState(false);
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [storedCard, setStoredCard] = useState(initialStoredCard);

  const [cardForm, setCardForm] = useState({
    cardholder: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    saveForFuture: true,
  });

  useEffect(() => {
    setForm(initialForm);
    setStoredCard(initialStoredCard);
  }, [initialForm, initialStoredCard]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleCardFormChange = (event) => {
    const { name, type, value, checked } = event.target;

    setCardForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenPaymentModal = () => {
    setCardForm({
      cardholder: "",
      cardNumber: "",
      expiryMonth: storedCard.expiryMonth || "",
      expiryYear: storedCard.expiryYear || "",
      cvv: "",
      saveForFuture: storedCard.saveCardForFuture ?? true,
    });

    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handleSaveCard = (event) => {
    event.preventDefault();

    const cleanNumber = cardForm.cardNumber.replace(/\D/g, "");
    const last4 = cleanNumber.slice(-4);

    if (
      !cardForm.cardholder.trim() ||
      cleanNumber.length < 12 ||
      !cardForm.expiryMonth ||
      !cardForm.expiryYear ||
      !cardForm.cvv.trim()
    ) {
      setFeedbackMessage("Please complete all card details before saving.");
      return;
    }

    setStoredCard({
      brand: getCardBrand(cleanNumber),
      last4: last4 || "0000",
      expiryMonth: cardForm.expiryMonth,
      expiryYear: cardForm.expiryYear,
      saveCardForFuture: cardForm.saveForFuture,
      hasStoredCard: true,
    });

    setFeedbackMessage(
      "Payment method updated locally. Backend profile update will be connected in the next integration step."
    );
    setIsPaymentModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setFeedbackMessage(
      "Profile changes saved locally. Backend profile update will be connected in the next integration step."
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <section className="my-profile-page gm-dark-section-bg">
      <div className="gm-container my-profile-page__container">
        <header className="my-profile-page__header">
          <h1 className="my-profile-page__title">MY PROFILE</h1>
          <p className="my-profile-page__intro">
            Check your personal info and complete your profile.
            <br />
            This helps us provide a better experience for you as a member.
          </p>
        </header>

        <form
          className="my-profile-page__card gm-surface-card"
          onSubmit={handleSubmit}
        >
          {feedbackMessage && (
            <p className="my-profile-page__feedback" role="status">
              {feedbackMessage}
            </p>
          )}

          <section className="my-profile-page__section">
            <h2 className="my-profile-page__section-title">PERSONAL DETAIL</h2>

            <div className="my-profile-page__section-divider" />

            <div className="my-profile-page__grid my-profile-page__grid--one">
              <label className="my-profile-page__field">
                <span>First name*</span>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>

              <label className="my-profile-page__field">
                <span>Last name*</span>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>
            </div>

            <div className="my-profile-page__grid my-profile-page__grid--two">
              <label className="my-profile-page__field">
                <span>Date of birth*</span>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>

              <label className="my-profile-page__field">
                <span>Phone number*</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>
            </div>
          </section>

          <section className="my-profile-page__section">
            <h2 className="my-profile-page__section-title">ADDRESS</h2>

            <div className="my-profile-page__section-divider" />

            <div className="my-profile-page__grid my-profile-page__grid--one">
              <label className="my-profile-page__field">
                <span>Address*</span>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>
            </div>

            <div className="my-profile-page__grid my-profile-page__grid--two">
              <label className="my-profile-page__field">
                <span>Postal code*</span>
                <input
                  type="text"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>

              <label className="my-profile-page__field">
                <span>City*</span>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>
            </div>

            <div className="my-profile-page__grid my-profile-page__grid--two">
              <label className="my-profile-page__field">
                <span>Country*</span>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>

              <label className="my-profile-page__field">
                <span>State / Province / Region*</span>
                <input
                  type="text"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  className="my-profile-page__input"
                  required
                />
              </label>
            </div>
          </section>

          <section className="my-profile-page__section">
            <h2 className="my-profile-page__section-title">LOGIN</h2>

            <div className="my-profile-page__section-divider" />

            <div className="my-profile-page__login-block">
              <div>
                <p className="my-profile-page__login-title">Login email</p>
                <p className="my-profile-page__login-text">
                  Current email: <strong>{form.email}</strong>
                </p>
                <p className="my-profile-page__login-text">
                  If you change your email address, you will receive an email at
                  the new account to confirm the change.
                </p>
              </div>

              <label className="my-profile-page__toggle-row">
                <input
                  type="checkbox"
                  checked={isEmailChangeEnabled}
                  onChange={(event) =>
                    setIsEmailChangeEnabled(event.target.checked)
                  }
                />
                <span className="my-profile-page__toggle-track">
                  <span className="my-profile-page__toggle-thumb" />
                </span>
              </label>
            </div>

            <input
              type="email"
              name="newEmail"
              value={form.newEmail}
              onChange={handleChange}
              disabled={!isEmailChangeEnabled}
              placeholder="Update my email address"
              className="my-profile-page__input my-profile-page__input--muted"
            />

            <div className="my-profile-page__login-block my-profile-page__login-block--spaced">
              <div>
                <p className="my-profile-page__login-title">
                  Change account password
                </p>
              </div>

              <label className="my-profile-page__toggle-row">
                <input
                  type="checkbox"
                  checked={isPasswordChangeEnabled}
                  onChange={(event) =>
                    setIsPasswordChangeEnabled(event.target.checked)
                  }
                />
                <span className="my-profile-page__toggle-track">
                  <span className="my-profile-page__toggle-thumb" />
                </span>
              </label>
            </div>

            {!isPasswordChangeEnabled ? (
              <input
                type="text"
                disabled
                placeholder="Update my password"
                className="my-profile-page__input my-profile-page__input--muted"
              />
            ) : (
              <div className="my-profile-page__password-grid">
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Current password"
                  className="my-profile-page__input my-profile-page__input--muted"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="New password"
                  className="my-profile-page__input my-profile-page__input--muted"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  className="my-profile-page__input my-profile-page__input--muted"
                />
              </div>
            )}
          </section>

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
                  {storedCard.hasStoredCard
                    ? storedCard.brand
                    : "No payment method"}
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

              <button
                type="button"
                className="my-profile-page__payment-action"
                onClick={handleOpenPaymentModal}
              >
                {storedCard.hasStoredCard ? "Edit" : "Add"}
              </button>
            </div>

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
          </section>

          <div className="my-profile-page__actions">
            <button
              type="submit"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow my-profile-page__action-btn"
            >
              SAVE CHANGES
            </button>

            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--outline-danger my-profile-page__action-btn"
              onClick={handleLogout}
            >
              LOG OUT
            </button>
          </div>
        </form>

        {isPaymentModalOpen && (
          <div className="my-profile-page__modal-backdrop">
            <div
              className="my-profile-page__payment-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="payment-modal-title"
            >
              <h2
                id="payment-modal-title"
                className="my-profile-page__payment-modal-title"
              >
                How would you like to pay?
              </h2>

              <div className="my-profile-page__payment-option">
                <div>
                  <strong>Pay by card</strong>
                  <span>Secure payment with Visa and Mastercard</span>
                </div>

                <div className="my-profile-page__payment-brands">
                  <span className="my-profile-page__payment-brand-dot my-profile-page__payment-brand-dot--red" />
                  <span className="my-profile-page__payment-brand-dot my-profile-page__payment-brand-dot--orange" />
                  <strong>VISA</strong>
                </div>
              </div>

              <form
                className="my-profile-page__card-form"
                onSubmit={handleSaveCard}
              >
                <CreditCardPaymentForm
                  cardForm={cardForm}
                  onChange={handleCardFormChange}
                />

                <div className="my-profile-page__payment-modal-actions">
                  <button
                    type="button"
                    className="my-profile-page__payment-cancel"
                    onClick={handleClosePaymentModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="gm-btn gm-btn--pill my-profile-page__payment-save-btn"
                  >
                    Save card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}