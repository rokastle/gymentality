import { Navigate, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import IconImage from "../components/common/IconImage";

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

export default function MyProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const initialForm = useMemo(() => getInitialProfileForm(user), [user]);

  const [form, setForm] = useState(initialForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [isEmailChangeEnabled, setIsEmailChangeEnabled] = useState(false);
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

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
                <strong>VISA</strong>
                <span>Card number: XXXX-XXXX-XXXX-0962</span>
                <span>Expiration date: 2031/06</span>
              </div>

              <button
                type="button"
                className="my-profile-page__payment-action"
              >
                Edit
              </button>
            </div>

            <label className="my-profile-page__checkbox-row">
              <input type="checkbox" />
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
      </div>
    </section>
  );
}