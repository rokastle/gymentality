import { forwardRef } from "react";
import FormError from "./FormError";

const FormCheckbox = forwardRef(function FormCheckbox(
  {
    label,
    name,
    checked,
    onChange,
    onBlur,
    error = "",
    touched = false,
    submitAttempted = false,
    required = false,
    className = "",
    checkboxClassName = "",
    errorClassName = "",
  },
  ref
) {
  const shouldShowState = touched || submitAttempted;
  const showError = shouldShowState && Boolean(error);
  const errorId = `${name}-error`;

  return (
    <>
      <label className={`gm-form-checkbox ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={checkboxClassName}
          aria-invalid={showError}
          aria-describedby={errorId}
        />
        <span>{label}</span>
      </label>

      <FormError
        id={errorId}
        message={error}
        show={showError}
        className={errorClassName}
      />
    </>
  );
});

export default FormCheckbox;