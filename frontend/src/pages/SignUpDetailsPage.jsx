import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import useLocationFields from "../hooks/useLocationFields";
import SignUpTimeline from "../components/signup/SignUpTimeline";
import SignUpPersonalDetailsSection from "../components/signup/SignUpPersonalDetailsSection";
import SignUpPaymentDetailsSection from "../components/signup/SignUpPaymentDetailsSection";
import SignUpSummarySidebar from "../components/signup/SignUpSummarySidebar";
import { AddressFields } from "../components/forms";
import { buildTouchedFields } from "../utils/formStateUtils";
import useAuth from "../hooks/useAuth";
import { getSignupTotals } from "../data/signupPlansData";
import useSignUpDetailsSelection from "../hooks/useSignUpDetailsSelection";
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

export default function SignUpDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fieldRefs = useRef({});
  const { register } = useAuth();

  const [form, setForm] = useState(initialSignUpDetailsForm);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const clubId = searchParams.get("clubId");
  const membershipId = searchParams.get("membership");
  const workoutId = searchParams.get("workout");

  const {
    club,
    membershipPlan,
    workoutPlan,
    loading: selectionLoading,
    isInvalidSelection,
  } = useSignUpDetailsSelection({
    clubId,
    membershipId,
    workoutId,
  });

  const { regionOptions, cityOptions, applyLocationChange } = useLocationFields({
    country: form.country,
    region: form.region,
    city: form.city,
    setForm,
  });

  const errors = useMemo(() => validateSignUpForm(form), [form]);

  if (!clubId) {
    return <Navigate to="/clubs" replace />;
  }

  if (selectionLoading) {
    return (
      <section className="signup-details-page gm-dark-section-bg">
        <div className="gm-container signup-details-page__container">
          <SignUpTimeline completedSteps={3} />
          <h1 className="signup-details-page__title">RESUME</h1>
          <p className="text-center text-white">Loading selected plans...</p>
        </div>
      </section>
    );
  }

  if (isInvalidSelection) {
    return <Navigate to="/clubs" replace />;
  }

  const totals = getSignupTotals(membershipPlan, workoutPlan);

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

    if (isSubmitting) {
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

  return (
    <section className="signup-details-page gm-dark-section-bg">
      <div className="gm-container signup-details-page__container">
        <SignUpTimeline completedSteps={3} />

        <h1 className="signup-details-page__title">RESUME</h1>

        <div className="signup-details-page__layout">
          <form
            className="signup-details-page__form-card gm-surface-card"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isSubmitting}
          >
            {apiError && (
              <p className="signup-details-page__api-error" role="alert">
                {apiError}
              </p>
            )}

            <SignUpPersonalDetailsSection
              form={form}
              onChange={handleChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
              submitAttempted={submitAttempted}
              fieldRefs={fieldRefs}
              getFieldProps={getSignUpFieldProps}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onTogglePassword={() => setShowPassword((prev) => !prev)}
              onToggleConfirmPassword={() =>
                setShowConfirmPassword((prev) => !prev)
              }
            />

            <AddressFields
              title="Address"
              baseClassName="signup-details-page"
              form={form}
              onChange={handleChange}
              onBlur={handleBlur}
              getFieldProps={getSignUpFieldProps}
              regionOptions={regionOptions}
              cityOptions={cityOptions}
              inputRefs={fieldRefs.current}
              required
            />

            <SignUpPaymentDetailsSection
              form={form}
              onCreditCardChange={handleCreditCardChange}
              onBlur={handleBlur}
              errors={errors}
              touched={touched}
              submitAttempted={submitAttempted}
              fieldRefs={fieldRefs}
            />

            <div className="signup-details-page__submit">
              <button
                type="submit"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow signup-details-page__submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "PROCESSING..." : "MAKE PAYMENT"}
              </button>
            </div>
          </form>

          <SignUpSummarySidebar
            club={club}
            membershipPlan={membershipPlan}
            workoutPlan={workoutPlan}
            totals={totals}
          />
        </div>
      </div>
    </section>
  );
}