import { FormField, PasswordField } from "../forms";

export default function ProfileLoginSection({
  form,
  passwordForm,
  isEmailChangeEnabled,
  isPasswordChangeEnabled,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  onEmailToggleChange,
  onPasswordToggleChange,
  onEmailChange,
  onEmailBlur,
  onPasswordChange,
  onPasswordBlur,
  onToggleCurrentPassword,
  onToggleNewPassword,
  onToggleConfirmPassword,
  getEmailFieldProps,
  getPasswordFieldProps,
}) {
  return (
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
            If you change your email address, you will receive an email at the
            new account to confirm the change.
          </p>
        </div>

        <label className="my-profile-page__toggle-row">
          <input
            type="checkbox"
            checked={isEmailChangeEnabled}
            onChange={onEmailToggleChange}
          />
          <span className="my-profile-page__toggle-track">
            <span className="my-profile-page__toggle-thumb" />
          </span>
        </label>
      </div>

      <FormField
        type="email"
        name="newEmail"
        value={form.newEmail}
        onChange={onEmailChange}
        onBlur={onEmailBlur}
        disabled={!isEmailChangeEnabled}
        placeholder="Update my email address"
        showLabel={false}
        {...getEmailFieldProps("newEmail")}
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
            onChange={onPasswordToggleChange}
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
          <PasswordField
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={onPasswordChange}
            onBlur={onPasswordBlur}
            placeholder="Current password"
            showPassword={showCurrentPassword}
            onTogglePassword={onToggleCurrentPassword}
            showLabelText="Mostrar contraseña actual"
            hideLabelText="Ocultar contraseña actual"
            autoComplete="current-password"
            {...getPasswordFieldProps("currentPassword")}
          />

          <PasswordField
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={onPasswordChange}
            onBlur={onPasswordBlur}
            placeholder="New password"
            showPassword={showNewPassword}
            onTogglePassword={onToggleNewPassword}
            showLabelText="Mostrar nueva contraseña"
            hideLabelText="Ocultar nueva contraseña"
            autoComplete="new-password"
            {...getPasswordFieldProps("newPassword")}
          />

          <PasswordField
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={onPasswordChange}
            onBlur={onPasswordBlur}
            placeholder="Confirm new password"
            showPassword={showConfirmPassword}
            onTogglePassword={onToggleConfirmPassword}
            showLabelText="Mostrar confirmación de contraseña"
            hideLabelText="Ocultar confirmación de contraseña"
            autoComplete="new-password"
            {...getPasswordFieldProps("confirmPassword")}
          />
        </div>
      )}
    </section>
  );
}