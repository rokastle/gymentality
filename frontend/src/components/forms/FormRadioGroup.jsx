import { forwardRef } from "react";
import FormError from "./FormError";

const FormRadioGroup = forwardRef(function FormRadioGroup(
  {
    label,
    name,
    value,
    options = [],
    onChange,
    onBlur,
    error = "",
    touched = false,
    submitAttempted = false,
    className = "",
  },
  ref
) {
  const shouldShowState = touched || submitAttempted;
  const showError = shouldShowState && Boolean(error);
  const errorId = `${name}-error`;

  return (
    <div className={`gm-form-field ${className}`}>
      {label && <span className="gm-form-label">{label}</span>}

      <div className="signup-details-page__options">
        {options.map((option, index) => (
          <label key={option.value}>
            <input
              ref={index === 0 ? ref : undefined}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={showError}
              aria-describedby={errorId}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>

      <FormError
        id={errorId}
        message={error}
        show={showError}
        className="signup-details-page__error"
      />
    </div>
  );
});

export default FormRadioGroup;