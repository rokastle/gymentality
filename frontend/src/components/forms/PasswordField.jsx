import { forwardRef } from "react";
import IconImage from "../common/IconImage";
import FormError from "./FormError";

function buildClassName(parts) {
  return parts.filter(Boolean).join(" ");
}

function getControlStateClass(shouldShowState, error) {
  if (!shouldShowState) {
    return "";
  }

  return error ? "is-invalid" : "is-valid";
}

const PasswordField = forwardRef(function PasswordField(
  {
    label,
    name,
    value,
    onChange,
    onBlur,
    error = "",
    touched = false,
    submitAttempted = false,
    showPassword = false,
    onTogglePassword,
    placeholder,
    required = false,
    disabled = false,
    autoComplete = "new-password",
    className = "",
    labelClassName = "",
    wrapperClassName = "",
    controlClassName = "",
    toggleClassName = "",
    iconClassName = "",
    errorClassName = "",
    errorId,
    showLabel = true,
    showLabelText,
    hideLabelText,
  },
  ref
) {
  const shouldShowState = touched || submitAttempted;
  const showError = shouldShowState && Boolean(error);
  const resolvedErrorId = errorId || `${name}-error`;

  const defaultShowLabel = showLabelText || "Mostrar contraseña";
  const defaultHideLabel = hideLabelText || "Ocultar contraseña";

  return (
    <label className={buildClassName(["gm-form-field", className])}>
      {showLabel && label && (
        <span className={buildClassName(["gm-form-label", labelClassName])}>
          {label}
        </span>
      )}

      <div className={buildClassName(["gm-password-wrapper", wrapperClassName])}>
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={buildClassName([
            "gm-form-control",
            controlClassName,
            getControlStateClass(shouldShowState, error),
          ])}
          aria-invalid={showError}
          aria-describedby={resolvedErrorId}
        />

        <button
          type="button"
          className={buildClassName(["gm-password-toggle", toggleClassName])}
          onClick={onTogglePassword}
          aria-label={showPassword ? defaultHideLabel : defaultShowLabel}
          aria-pressed={showPassword}
          disabled={disabled}
        >
          <IconImage
            name={showPassword ? "hidePasswordIcon" : "showPasswordIcon"}
            className={buildClassName([
              "gm-password-toggle-icon",
              iconClassName,
            ])}
            decorative
            size={20}
          />
        </button>
      </div>

      <FormError
        id={resolvedErrorId}
        message={error}
        show={showError}
        className={errorClassName}
      />
    </label>
  );
});

export default PasswordField;