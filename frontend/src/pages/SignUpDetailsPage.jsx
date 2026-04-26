import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import SignUpTimeline from "../components/signup/SignUpTimeline";
import { useClubById } from "../hooks/useClubs";
import useAuth from "../hooks/useAuth";
import CreditCardPaymentForm from "../components/payment/CreditCardPaymentForm";
import { FormField, PasswordField } from "../components/forms";
import {
  formatEuro,
  formatEuroMonth,
  getMembershipPlanById,
  getSignupTotals,
  getWorkoutPlanById,
  mapMembershipPlanFromApi,
  mapWorkoutPlanFromApi,
} from "../data/signupPlansData";
import {
  cityOptionsByRegion,
  countryOptions,
  hasValidationErrors,
  normalizeCardNumber,
  normalizePostalCode,
  regionOptionsByCountry,
  signUpFieldOrder,
  validateSignUpForm,
} from "../utils/accountValidation";
import { useMembershipPlans } from "../hooks/useMembership";
import { useWorkoutPlans } from "../hooks/useWorkoutPlans";

const initialForm = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  address: "",
  postalCode: "",
  country: "España",
  region: "",
  city: "",
  cardholder: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  saveCardForFuture: true,
  acceptedTerms: false,
};

export default function SignUpDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fieldRefs = useRef({});
  const { register } = useAuth();

  const [form, setForm] = useState(initialForm);
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
    loading: clubLoading,
    error: clubError,
  } = useClubById(clubId);

  const {
    plans: membershipApiPlans,
    loading: membershipsLoading,
    error: membershipsError,
  } = useMembershipPlans();

  const {
    plans: workoutApiPlans,
    loading: workoutPlansLoading,
    error: workoutPlansError,
  } = useWorkoutPlans();

  const membershipPlans = useMemo(
    () => membershipApiPlans.map(mapMembershipPlanFromApi),
    [membershipApiPlans]
  );

  const workoutPlans = useMemo(
    () => workoutApiPlans.map(mapWorkoutPlanFromApi),
    [workoutApiPlans]
  );

  const membershipPlan = getMembershipPlanById(membershipId, membershipPlans);
  const workoutPlan = getWorkoutPlanById(workoutId, workoutPlans);

  const cityCatalog = useMemo(() => {
    return Object.entries(cityOptionsByRegion).flatMap(([region, cities]) =>
      cities.map((city) => ({
        city,
        region,
        country: "España",
      }))
    );
  }, []);

  const regionOptions = useMemo(() => {
    return regionOptionsByCountry[form.country] ?? [];
  }, [form.country]);

  const cityOptions = useMemo(() => {
    return cityCatalog.filter((item) => {
      const matchesCountry = !form.country || item.country === form.country;
      const matchesRegion = !form.region || item.region === form.region;

      return matchesCountry && matchesRegion;
    });
  }, [form.country, form.region, cityCatalog]);

  const errors = useMemo(() => validateSignUpForm(form), [form]);

  useEffect(() => {
    if (form.region && !regionOptions.includes(form.region)) {
      setForm((current) => ({
        ...current,
        region: "",
        city: "",
      }));
    }
  }, [form.region, regionOptions]);

  useEffect(() => {
    if (form.city && !cityOptions.some((item) => item.city === form.city)) {
      setForm((current) => ({
        ...current,
        city: "",
      }));
    }
  }, [form.city, cityOptions]);

  if (!clubId) {
    return <Navigate to="/clubs" replace />;
  }

  if (clubLoading || membershipsLoading || workoutPlansLoading) {
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

  if (
    clubError ||
    membershipsError ||
    workoutPlansError ||
    !club ||
    !membershipPlan ||
    !workoutPlan
  ) {
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

      if (name === "country") {
        nextForm.region = "";
        nextForm.city = "";
      }

      if (name === "region") {
        nextForm.city = "";
      }

      if (name === "city") {
        const selectedCity = cityCatalog.find((item) => item.city === nextValue);

        if (selectedCity) {
          nextForm.city = selectedCity.city;
          nextForm.region = selectedCity.region;
          nextForm.country = selectedCity.country;
        }
      }

      return nextForm;
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

  const getControlStateClass = (fieldName) => {
    const shouldShowState = touched[fieldName] || submitAttempted;

    if (!shouldShowState) {
      return "";
    }

    return errors[fieldName] ? "is-invalid" : "is-valid";
  };

  const focusFirstInvalidField = (validationErrors) => {
    const firstInvalidField = signUpFieldOrder.find(
      (fieldName) => validationErrors[fieldName] && fieldRefs.current[fieldName]
    );

    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField].focus();
    }
  };

  const renderError = (fieldName) => {
    const showError =
      (touched[fieldName] || submitAttempted) && errors[fieldName];

    return (
      <small
        id={`${fieldName}-error`}
        className="signup-details-page__error"
        role={showError ? "alert" : undefined}
        aria-live="polite"
      >
        {showError ? errors[fieldName] : "\u00A0"}
      </small>
    );
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

    const allTouched = signUpFieldOrder.reduce((accumulator, fieldName) => {
      accumulator[fieldName] = true;
      return accumulator;
    }, {});

    setTouched(allTouched);
    setApiError("");

    if (hasValidationErrors(errors)) {
      focusFirstInvalidField(errors);
      return;
    }

    const cleanCardNumber = normalizeCardNumber(form.cardNumber);

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      address: form.address.trim(),
      postalCode: form.postalCode.trim(),
      city: form.city,
      country: form.country,
      region: form.region,

      paymentMethod: "card",
      cardLast4: cleanCardNumber.slice(-4),
      cardExpiryMonth: form.expiryMonth,
      cardExpiryYear: form.expiryYear,
      saveCardForFuture: form.saveCardForFuture,

      clubId: club.id,
      membershipPlanId: membershipPlan.backendId,
      workoutPlanId: workoutPlan.backendId,
      acceptedTerms: form.acceptedTerms,
    };

    try {
      setIsSubmitting(true);

      const result = await register(payload);

      const nextParams = new URLSearchParams({
        clubId: String(club.id),
        membership: membershipPlan.id,
        workout: workoutPlan.id,
        amount: totals.totalFirstPayment.toFixed(2),
        userId: String(result.user.id),
        email: result.user.email,
      });

      navigate(`/signup/complete?${nextParams.toString()}`);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "No se pudo completar el registro. Inténtalo de nuevo.";

      setApiError(
        typeof backendMessage === "string"
          ? backendMessage
          : "No se pudo completar el registro. Inténtalo de nuevo."
      );
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

            <section className="signup-details-page__section">
              <h2 className="signup-details-page__section-title">
                Personal details
              </h2>

              <div className="signup-details-page__grid signup-details-page__grid--two">
                <FormField
                  ref={(element) => {
                    fieldRefs.current.firstName = element;
                  }}
                  label="First name*"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="given-name"
                  {...getSignUpFieldProps("firstName")}
                />

                <FormField
                  ref={(element) => {
                    fieldRefs.current.lastName = element;
                  }}
                  label="Last name*"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="family-name"
                  {...getSignUpFieldProps("lastName")}
                />
              </div>

              <div className="signup-details-page__grid signup-details-page__grid--two signup-details-page__gender-row">
                <div className="signup-details-page__field">
                  <span>Gender*</span>

                  <div className="signup-details-page__options">
                    <label>
                      <input
                        ref={(element) => {
                          if (element) {
                            fieldRefs.current.gender = element;
                          }
                        }}
                        type="radio"
                        name="gender"
                        value="female"
                        checked={form.gender === "female"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <span>Female</span>
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={form.gender === "male"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <span>Male</span>
                    </label>
                  </div>

                  {renderError("gender")}
                </div>

                <FormField
                  ref={(element) => {
                    fieldRefs.current.dateOfBirth = element;
                  }}
                  label="Date of birth*"
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  {...getSignUpFieldProps("dateOfBirth")}
                />
              </div>

              <div className="signup-details-page__grid signup-details-page__grid--two">
                <FormField
                  ref={(element) => {
                    fieldRefs.current.email = element;
                  }}
                  label="Email*"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="email"
                  placeholder="usuario@mail.com"
                  {...getSignUpFieldProps("email")}
                />

                <FormField
                  ref={(element) => {
                    fieldRefs.current.phone = element;
                  }}
                  label="Phone number*"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+34 600-123-456"
                  {...getSignUpFieldProps("phone")}
                />
              </div>

              <div className="signup-details-page__grid signup-details-page__grid--two">
                <PasswordField
                  ref={(element) => {
                    fieldRefs.current.password = element;
                  }}
                  label="Password*"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="new-password"
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((prev) => !prev)}
                  showLabelText="Mostrar contraseña"
                  hideLabelText="Ocultar contraseña"
                  {...getSignUpFieldProps("password")}
                />

                <PasswordField
                  ref={(element) => {
                    fieldRefs.current.confirmPassword = element;
                  }}
                  label="Confirm Password*"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="new-password"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword((prev) => !prev)}
                  showLabelText="Mostrar confirmación de contraseña"
                  hideLabelText="Ocultar confirmación de contraseña"
                  {...getSignUpFieldProps("confirmPassword")}
                />
              </div>
            </section>

            <section className="signup-details-page__section">
              <h2 className="signup-details-page__section-title">Address</h2>

              <div className="signup-details-page__grid signup-details-page__grid--one">
                <label className="signup-details-page__field">
                  <span>Address*</span>

                  <input
                    ref={(element) => {
                      fieldRefs.current.address = element;
                    }}
                    className={`signup-details-page__control ${getControlStateClass(
                      "address"
                    )}`}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    autoComplete="street-address"
                    aria-invalid={Boolean(
                      (touched.address || submitAttempted) && errors.address
                    )}
                    aria-describedby="address-error"
                  />

                  {renderError("address")}
                </label>
              </div>

              <div className="signup-details-page__grid signup-details-page__grid--two">
                <label className="signup-details-page__field">
                  <span>Postal code*</span>

                  <input
                    ref={(element) => {
                      fieldRefs.current.postalCode = element;
                    }}
                    className={`signup-details-page__control ${getControlStateClass(
                      "postalCode"
                    )}`}
                    type="text"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    inputMode="numeric"
                    maxLength={5}
                    pattern="\d{5}"
                    placeholder="29001"
                    aria-invalid={Boolean(
                      (touched.postalCode || submitAttempted) &&
                        errors.postalCode
                    )}
                    aria-describedby="postalCode-error"
                  />

                  {renderError("postalCode")}
                </label>

                <label className="signup-details-page__field">
                  <span>City*</span>

                  <select
                    ref={(element) => {
                      fieldRefs.current.city = element;
                    }}
                    className={`signup-details-page__control ${getControlStateClass(
                      "city"
                    )}`}
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={Boolean(
                      (touched.city || submitAttempted) && errors.city
                    )}
                    aria-describedby="city-error"
                  >
                    <option value="">Select a city</option>
                    {cityOptions.map((item) => (
                      <option
                        key={`${item.city}-${item.region}`}
                        value={item.city}
                      >
                        {item.city} ({item.region})
                      </option>
                    ))}
                  </select>

                  {renderError("city")}
                </label>
              </div>

              <div className="signup-details-page__grid signup-details-page__grid--two">
                <label className="signup-details-page__field">
                  <span>Country*</span>

                  <select
                    ref={(element) => {
                      fieldRefs.current.country = element;
                    }}
                    className={`signup-details-page__control ${getControlStateClass(
                      "country"
                    )}`}
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={Boolean(
                      (touched.country || submitAttempted) && errors.country
                    )}
                    aria-describedby="country-error"
                  >
                    <option value="">Select a country</option>
                    {countryOptions.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  {renderError("country")}
                </label>

                <label className="signup-details-page__field">
                  <span>State / Province / Region*</span>

                  <select
                    ref={(element) => {
                      fieldRefs.current.region = element;
                    }}
                    className={`signup-details-page__control ${getControlStateClass(
                      "region"
                    )}`}
                    name="region"
                    value={form.region}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={Boolean(
                      (touched.region || submitAttempted) && errors.region
                    )}
                    aria-describedby="region-error"
                  >
                    <option value="">Select a region</option>
                    {regionOptions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>

                  {renderError("region")}
                </label>
              </div>
            </section>

            <section className="signup-details-page__section">
              <h2 className="signup-details-page__section-title">
                Payment details
              </h2>

              <div className="signup-details-page__payment-box">
                <div className="signup-details-page__payment-option">
                  <div>
                    <strong>Pay by card</strong>
                    <span>Secure payment with Visa and Mastercard</span>
                  </div>

                  <div className="signup-details-page__payment-brands">
                    <span className="signup-details-page__payment-brand-dot signup-details-page__payment-brand-dot--red" />
                    <span className="signup-details-page__payment-brand-dot signup-details-page__payment-brand-dot--orange" />
                    <strong>VISA</strong>
                  </div>
                </div>

                <CreditCardPaymentForm
                  cardForm={{
                    cardholder: form.cardholder,
                    cardNumber: form.cardNumber,
                    expiryMonth: form.expiryMonth,
                    expiryYear: form.expiryYear,
                    cvv: form.cvv,
                    saveForFuture: form.saveCardForFuture,
                  }}
                  onChange={handleCreditCardChange}
                  onBlur={handleBlur}
                  errors={errors}
                  touched={touched}
                  submitAttempted={submitAttempted}
                  inputRefs={fieldRefs.current}
                  compact
                />
              </div>

              <label className="signup-details-page__checkbox">
                <input
                  ref={(element) => {
                    fieldRefs.current.acceptedTerms = element;
                  }}
                  type="checkbox"
                  name="acceptedTerms"
                  checked={form.acceptedTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <span>I accept the terms and privacy policy</span>
              </label>

              {renderError("acceptedTerms")}
            </section>

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

          <aside className="signup-details-page__sidebar">
            <div className="signup-details-page__summary-card gm-surface-card">
              <p className="signup-details-page__summary-label">
                Billing details
              </p>

              <h2 className="signup-details-page__summary-title">
                {club.name}
              </h2>

              <div className="signup-details-page__summary-block">
                <p className="signup-details-page__summary-subtitle">
                  Membership selected
                </p>
                <div className="signup-details-page__summary-row">
                  <span>{membershipPlan.summaryName}</span>
                  <span>{formatEuro(membershipPlan.upfrontPrice)}</span>
                </div>
              </div>

              <div className="signup-details-page__summary-block">
                <p className="signup-details-page__summary-subtitle">
                  Workout selected
                </p>
                <div className="signup-details-page__summary-row">
                  <span>{workoutPlan.summaryName}</span>
                  <span>{formatEuro(workoutPlan.monthlyPrice)}</span>
                </div>
              </div>

              <div className="signup-details-page__summary-block">
                <p className="signup-details-page__summary-subtitle">
                  Monthly installments
                </p>
                <div className="signup-details-page__summary-row">
                  <span>Monthly fee:</span>
                  <span>{formatEuroMonth(totals.monthlyFee)}</span>
                </div>
              </div>

              <div className="signup-details-page__summary-block">
                <p className="signup-details-page__summary-subtitle">
                  Amount due today
                </p>
                <div className="signup-details-page__summary-row">
                  <span>Membership fee:</span>
                  <span>{formatEuro(membershipPlan.upfrontPrice)}</span>
                </div>
                <div className="signup-details-page__summary-row">
                  <span>Workout plan:</span>
                  <span>{formatEuro(workoutPlan.monthlyPrice)}</span>
                </div>
                <div className="signup-details-page__summary-row">
                  <span>Enrollment:</span>
                  <span>0,00€</span>
                </div>
              </div>

              <div className="signup-details-page__summary-total">
                <p>Total first payment</p>
                <strong>{formatEuro(totals.totalFirstPayment)}</strong>
              </div>

              <div className="signup-details-page__summary-block">
                <div className="signup-details-page__summary-row signup-details-page__summary-row--stack">
                  <span>Contract renewal date:</span>
                  <strong>{totals.renewalDate}</strong>
                </div>
              </div>
            </div>

            <div className="signup-details-page__help-card gm-surface-card">
              <div className="signup-details-page__help-icon">?</div>
              <span>Need help?</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}