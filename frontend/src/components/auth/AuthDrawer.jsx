import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import IconImage from "../common/IconImage";

export default function AuthDrawer({ open, onClose }) {
  const location = useLocation();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { unreadCount, refetch: refetchNotifications } = useNotifications();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onClose?.();
  }, [location.pathname, location.search, onClose]);

  useEffect(() => {
    if (open && isAuthenticated) {
      refetchNotifications();
    }
  }, [open, isAuthenticated, refetchNotifications]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setApiError("");

    try {
      setIsSubmitting(true);

      await login({
        email: form.email.trim(),
        password: form.password,
      });
    } catch (error) {
      const backendData = error?.response?.data;
      setApiError(
        typeof backendData === "string"
          ? backendData
          : backendData?.message || "No se pudo iniciar sesión."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <div className={`auth-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <button
        type="button"
        className="auth-drawer__backdrop"
        onClick={onClose}
        aria-label="Close panel"
        tabIndex={open ? 0 : -1}
      />

      <aside
        className="auth-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="User menu"
      >
        <button
          type="button"
          className="auth-drawer__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {!isAuthenticated ? (
          <>
            <h2 className="auth-drawer__title">LOG IN</h2>

            <div className="auth-drawer__section">
              <h3 className="auth-drawer__subtitle">I ALREADY HAVE AN ACCOUNT</h3>
              <p className="auth-drawer__text">
                If you have an account with us, please enter the email address and
                password you used to register.
              </p>

              <form className="auth-drawer__form" onSubmit={handleLogin}>
                <label className="auth-drawer__field">
                  <span>Email*</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="auth-drawer__field">
                  <span>Password*</span>
                  <div className="auth-drawer__password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="auth-drawer__toggle-password"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                      aria-pressed={showPassword}
                    >
                      <IconImage
                        name={showPassword ? "hidePasswordIcon" : "showPasswordIcon"}
                        className="auth-drawer__toggle-password-icon"
                        decorative
                        size={18}
                      />
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  className="gm-btn gm-btn--pill gm-btn--solid-yellow auth-drawer__submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "LOGGING IN..." : "LOG IN"}
                </button>

                {apiError && (
                  <p className="auth-drawer__error" role="alert">
                    {apiError}
                  </p>
                )}
              </form>
            </div>

            <div className="auth-drawer__bottom-card gm-surface-card auth-drawer__cta-card">
              <h3 className="auth-drawer__bottom-card-title">CREATE AN ACCOUNT NOW</h3>
              <div className="auth-drawer__bottom-card-divider gm-divider-accent" />
              <p className="auth-drawer__bottom-card-text">
                If you haven't joined one of our GYMENTALITY clubs yet, sign up in seconds.
              </p>
              <Link
                to="/clubs"
                className="gm-btn gm-btn--pill gm-btn--outline-yellow gm-btn--full"
              >
                JOIN NOW
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="auth-drawer__section">
              <h3 className="auth-drawer__subtitle">
                Hi again, {user.firstName}
              </h3>
              <p className="auth-drawer__text">
                You're in control: manage your main actions and check your progress at a glance.
              </p>
            </div>

            <nav className="auth-drawer__menu">
              <Link to="/account/book-class" className="auth-drawer__menu-item">
                <IconImage
                  name="bookClass"
                  className="auth-drawer__menu-icon"
                  decorative
                  size={28}
                />
                <span>BOOK A CLASS</span>
              </Link>

              <Link to="/account/workout" className="auth-drawer__menu-item">
                <IconImage
                  name="myWorkoutPlan"
                  className="auth-drawer__menu-icon"
                  decorative
                  size={28}
                />
                <span>MY WORKOUT PLAN</span>
              </Link>

              <Link to="/account/membership" className="auth-drawer__menu-item">
                <IconImage
                  name="membership"
                  className="auth-drawer__menu-icon"
                  decorative
                  size={28}
                />
                <span>MY MEMBERSHIP</span>
              </Link>

              <Link to="/account/notifications" className="auth-drawer__menu-item">
                <IconImage
                  name="notifications"
                  className="auth-drawer__menu-icon"
                  decorative
                  size={28}
                />
                <span className="auth-drawer__menu-label">MY NOTIFICATIONS</span>
                {unreadCount > 0 && (
                  <span
                    className="auth-drawer__notification-count"
                    aria-label={`${unreadCount} unread notifications`}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link to="/account/profile" className="auth-drawer__menu-item">
                <IconImage
                  name="myProfile"
                  className="auth-drawer__menu-icon"
                  decorative
                  size={28}
                />
                <span>MY PROFILE</span>
              </Link>
            </nav>

            <div className="auth-drawer__bottom-card gm-surface-card auth-drawer__account-card">
              <h3 className="auth-drawer__bottom-card-title">ACCOUNT</h3>
              <div className="auth-drawer__bottom-card-divider" />
              <p className="auth-drawer__bottom-card-text auth-drawer__account-email">
                {user.email}
              </p>
              <button
                type="button"
                className="gm-btn gm-btn--pill gm-btn--outline-danger gm-btn--full"
                onClick={handleLogout}
              >
                LOG OUT
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
