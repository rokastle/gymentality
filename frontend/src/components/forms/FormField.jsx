import { forwardRef } from "react";
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

const FormField = forwardRef(function FormField(
  {
    label,
    name,
    value,
    onChange,
    onBlur,
    error = "",
    touched = false,
    submitAttempted = false,
    type = "text",
    placeholder,
    required = false,
    disabled = false,
    autoComplete,
    inputMode,
    maxLength,
    pattern,
    className = "",
    labelClassName = "",
    controlClassName = "",
    errorClassName = "",
    errorId,
    showLabel = true,
  },
  ref
) {
  const shouldShowState = touched || submitAttempted;
  const showError = shouldShowState && Boolean(error);
  const resolvedErrorId = errorId || `${name}-error`;

  return (
    <label className={buildClassName(["gm-form-field", className])}>
      {showLabel && label && (
        <span className={buildClassName(["gm-form-label", labelClassName])}>
          {label}
        </span>
      )}

      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        className={buildClassName([
          "gm-form-control",
          controlClassName,
          getControlStateClass(shouldShowState, error),
        ])}
        aria-invalid={showError}
        aria-describedby={resolvedErrorId}
      />

      <FormError
        id={resolvedErrorId}
        message={error}
        show={showError}
        className={errorClassName}
      />
    </label>
  );
});

export default FormField;