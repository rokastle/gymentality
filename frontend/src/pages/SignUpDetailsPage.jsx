import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { AddressFields } from "../components/forms";
import SignUpPaymentDetailsSection from "../components/signup/SignUpPaymentDetailsSection";
import SignUpPersonalDetailsSection from "../components/signup/SignUpPersonalDetailsSection";
import SignUpSummarySidebar from "../components/signup/SignUpSummarySidebar";
import SignUpTimeline from "../components/signup/SignUpTimeline";
import useAuth from "../hooks/useAuth";
import useSignUpDetailsForm from "../hooks/useSignUpDetailsForm";
import useSignUpDetailsSelection from "../hooks/useSignUpDetailsSelection";
import { getSignupTotals } from "../data/signupPlansData";

export default function SignUpDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

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

  const totals =
    membershipPlan && workoutPlan
      ? getSignupTotals(membershipPlan, workoutPlan)
      : null;

  const {
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
    togglePassword,
    toggleConfirmPassword,
  } = useSignUpDetailsForm({
    club,
    membershipPlan,
    workoutPlan,
    totals,
    register,
    navigate,
  });

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

  if (isInvalidSelection || !club || !membershipPlan || !workoutPlan || !totals) {
    return <Navigate to="/clubs" replace />;
  }

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
              <p
                className="signup-details-page__feedback signup-details-page__feedback--error signup-details-page__api-error"
                role="alert"
              >
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
              onTogglePassword={togglePassword}
              onToggleConfirmPassword={toggleConfirmPassword}
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
