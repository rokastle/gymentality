import { useMemo, useRef, useState } from "react";
import useLocationFields from "./useLocationFields";
import { buildTouchedFields } from "../utils/formStateUtils";
import {
  hasValidationErrors,
  normalizePostalCode,
  signUpFieldOrder,
  validateSignUpForm,
} from "../utils/accountValidation";
import {
  buildSignUpCompleteParams,
  buildSignUpRegistrationPayload,
  getSignUpApiErrorMessage,
  initialSignUpDetailsForm,
} from "../utils/signupDetailsPageUtils";

export default function useSignUpDetailsForm({
  club,
  membershipPlan,
  workoutPlan,
  totals,
  register,
  navigate,
}) {
  const fieldRefs = useRef({});

  const [form, setForm] = useState(initialSignUpDetailsForm);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { regionOptions, cityOptions, applyLocationChange } = useLocationFields({
    country: form.country,
    region: form.region,
    city: form.city,
    setForm,
  });

  const errors = useMemo(() => validateSignUpForm(form), [form]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;

    setForm((current) => {
      let nextValue = type === "checkbox" ? checked : value;

      if (name === "postalCode") {
        nextValue = normalizePostalCode(value);
      }

      const nextForm = {
        ...current,
        [name]: nextValue,
      };

      return applyLocationChange({
        name,
        value: nextValue,
        nextForm,
      });
    });
  };

  const handleCreditCardChange = (event) => {
    const { name, type, value, checked } = event.target;
    const mappedName = name === "saveForFuture" ? "saveCardForFuture" : name;

    handleChange({
      target: {
        name: mappedName,
        type,
        value,
        checked,
      },
    });
  };

  const handleBlur = (event) => {
    const { name } = event.target;

    setTouched((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const focusFirstInvalidField = (validationErrors) => {
    const firstInvalidField = signUpFieldOrder.find(
      (fieldName) => validationErrors[fieldName] && fieldRefs.current[fieldName]
    );

    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField].focus();
    }
  };

  const getSignUpFieldProps = (fieldName) => ({
    error: errors[fieldName],
    touched: touched[fieldName],
    submitAttempted,
    className: "signup-details-page__field",
    controlClassName: "signup-details-page__control",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || !club || !membershipPlan || !workoutPlan || !totals) {
      return;
    }

    setSubmitAttempted(true);
    setTouched(buildTouchedFields(signUpFieldOrder));
    setApiError("");

    if (hasValidationErrors(errors)) {
      focusFirstInvalidField(errors);
      return;
    }

    const payload = buildSignUpRegistrationPayload({
      form,
      club,
      membershipPlan,
      workoutPlan,
    });

    try {
      setIsSubmitting(true);

      const result = await register(payload);

      const nextParams = buildSignUpCompleteParams({
        club,
        membershipPlan,
        workoutPlan,
        totals,
        result,
      });

      navigate(`/signup/complete?${nextParams}`);
    } catch (error) {
      setApiError(getSignUpApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    touched,
    errors,
    fieldRefs,
    apiError,
    isSubmitting,
    submitAttempted,
    showPassword,
    showConfirmPassword,
    regionOptions,
    cityOptions,
    handleChange,
    handleCreditCardChange,
    handleBlur,
    handleSubmit,
    getSignUpFieldProps,
    togglePassword: () => setShowPassword((current) => !current),
    toggleConfirmPassword: () =>
      setShowConfirmPassword((current) => !current),
  };
}