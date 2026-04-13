export default function RegisterPage() {
  return (
    <section className="register-page gm-dark-section-bg">
      <div className="gm-container register-page__container">
        <div className="register-page__card gm-surface-card">
          <p className="register-page__eyebrow">REGISTER</p>
          <h1 className="register-page__title">JOIN GYMENTALITY</h1>

          <form className="register-page__form">
            <label className="register-page__field">
              <span className="register-page__label">First name</span>
              <input
                type="text"
                placeholder="First name"
                className="register-page__input"
              />
            </label>

            <label className="register-page__field">
              <span className="register-page__label">Last name</span>
              <input
                type="text"
                placeholder="Last name"
                className="register-page__input"
              />
            </label>

            <label className="register-page__field register-page__field--full">
              <span className="register-page__label">Email</span>
              <input
                type="email"
                placeholder="Email"
                className="register-page__input"
              />
            </label>

            <label className="register-page__field register-page__field--full">
              <span className="register-page__label">Password</span>
              <input
                type="password"
                placeholder="Password"
                className="register-page__input"
              />
            </label>

            <button
              type="submit"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow register-page__submit"
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}