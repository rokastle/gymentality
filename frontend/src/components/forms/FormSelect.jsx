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

const FormSelect = forwardRef(function FormSelect(
  {
    label,
    name,
    value,
    onChange,
    onBlur,
    error = "",
    touched = false,
    submitAttempted = false,
    required = false,
    disabled = false,
    autoComplete,
    placeholder = "Select an option",
    options = [],
    getOptionValue = (option) => option,
    getOptionLabel = (option) => option,
    getOptionKey,
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

      <select
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={buildClassName([
          "gm-form-control",
          "gm-form-control--select",
          controlClassName,
          getControlStateClass(shouldShowState, error),
        ])}
        aria-invalid={showError}
        aria-describedby={resolvedErrorId}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const optionValue = getOptionValue(option);
          const optionLabel = getOptionLabel(option);
          const optionKey = getOptionKey
            ? getOptionKey(option)
            : String(optionValue);

          return (
            <option key={optionKey} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      <FormError
        id={resolvedErrorId}
        message={error}
        show={showError}
        className={errorClassName}
      />
    </label>
  );
});

export default FormSelect;