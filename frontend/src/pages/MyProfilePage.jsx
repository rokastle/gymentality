import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useLocationFields from "../hooks/useLocationFields";
import useAuth from "../hooks/useAuth";
import ProfilePersonalDetailsSection from "../components/profile/ProfilePersonalDetailsSection";
import ProfileLoginSection from "../components/profile/ProfileLoginSection";
import ProfilePaymentMethodSection from "../components/profile/ProfilePaymentMethodSection";
import { buildTouchedFields } from "../utils/formStateUtils";
import { AddressFields } from "../components/forms";
import {
  hasValidationErrors,
  normalizePostalCode,
  profileEmailFieldOrder,
  profileFieldOrder,
  profilePasswordFieldOrder,
  validateProfileEmailForm,
  validateProfileForm,
  validateProfilePasswordForm,
} from "../utils/accountValidation";
import {
  hasPaymentValidationErrors,
  normalizeCardNumber,
  paymentFieldNames,
  validatePaymentForm,
} from "../utils/paymentValidation";
import {
  emptyCardForm,
  getCardBrand,
  getErrorMessage,
  getInitialProfileForm,
  getInitialStoredCard,
  initialPasswordForm,
} from "../utils/profilePageUtils";

export default function MyProfilePage() {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
    updateProfile,
    updatePaymentMethod,
    updateEmail,
    updatePassword,
  } = useAuth();

  const [form, setForm] = useState(() => getInitialProfileForm(user));
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);

  const [isEmailChangeEnabled, setIsEmailChangeEnabled] = useState(false);
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [profileTouched, setProfileTouched] = useState({});
  const [profileSubmitAttempted, setProfileSubmitAttempted] = useState(false);

  const [emailTouched, setEmailTouched] = useState({});
  const [emailSubmitAttempted, setEmailSubmitAttempted] = useState(false);

  const [passwordTouched, setPasswordTouched] = useState({});
  const [passwordSubmitAttempted, setPasswordSubmitAttempted] = useState(false);
  const [passwordBackendErrors, setPasswordBackendErrors] = useState({});

  const [storedCard, setStoredCard] = useState(() => getInitialStoredCard(user));
  const [isPaymentEditOpen, setIsPaymentEditOpen] = useState(false);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [paymentTouched, setPaymentTouched] = useState({});
  const [paymentSubmitAttempted, setPaymentSubmitAttempted] = useState(false);

  const profileErrors = useMemo(() => validateProfileForm(form), [form]);

  const emailErrors = useMemo(
    () =>
      validateProfileEmailForm({
        email: form.email,
        newEmail: form.newEmail,
      }),
    [form.email, form.newEmail]
  );

  const passwordErrors = useMemo(
    () => validateProfilePasswordForm(passwordForm),
    [passwordForm]
  );

  const mergedPasswordErrors = useMemo(() => {
    const activeBackendErrors = Object.entries(passwordBackendErrors).reduce(
      (accumulator, [fieldName, errorMessage]) => {
        if (errorMessage) {
          accumulator[fieldName] = errorMessage;
        }

        return accumulator;
      },
      {}
    );

    return {
      ...passwordErrors,
      ...activeBackendErrors,
    };
  }, [passwordErrors, passwordBackendErrors]);

  const paymentErrors = useMemo(() => validatePaymentForm(cardForm), [cardForm]);

  const { regionOptions, cityOptions, applyLocationChange } = useLocationFields({
    country: form.country,
    region: form.region,
    city: form.city,
    setForm,
  });

  useEffect(() => {
    setForm(getInitialProfileForm(user));
    setProfileTouched({});
    setProfileSubmitAttempted(false);
    setEmailTouched({});
    setEmailSubmitAttempted(false);
    setPasswordTouched({});
    setPasswordSubmitAttempted(false);
    setPasswordBackendErrors({});
    setPasswordForm(initialPasswordForm);
    setIsEmailChangeEnabled(false);
    setIsPasswordChangeEnabled(false);
  }, [user?.id]);

  useEffect(() => {
    setStoredCard(getInitialStoredCard(user));
  }, [
    user?.paymentMethod,
    user?.cardLast4,
    user?.cardExpiryMonth,
    user?.cardExpiryYear,
    user?.saveCardForFuture,
  ]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const scrollToPageTop = () => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  const showErrorFeedback = (message) => {
    setFeedbackType("error");
    setFeedbackMessage(message);
    scrollToPageTop();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      let nextValue = value;

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

  const handleProfileBlur = (event) => {
    const { name } = event.target;

    setProfileTouched((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const handleEmailBlur = (event) => {
    const { name } = event.target;

    setEmailTouched((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));

    setPasswordTouched((current) => ({
      ...current,
      [name]: true,
    }));

    setPasswordBackendErrors((current) => {
      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handlePasswordBlur = (event) => {
    const { name } = event.target;

    setPasswordTouched((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const handleEmailToggleChange = (event) => {
    const enabled = event.target.checked;

    setIsEmailChangeEnabled(enabled);
    setEmailTouched({});
    setEmailSubmitAttempted(false);

    setForm((current) => ({
      ...current,
      newEmail: "",
    }));
  };

  const handlePasswordToggleChange = (event) => {
    const enabled = event.target.checked;

    setIsPasswordChangeEnabled(enabled);
    setPasswordTouched({});
    setPasswordSubmitAttempted(false);
    setPasswordBackendErrors({});
    setPasswordForm(initialPasswordForm);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleCardFormChange = (event) => {
    const { name, type, value, checked } = event.target;

    setCardForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "cardNumber" || name === "cvv"
            ? value.replace(/\D/g, "")
            : value,
    }));
  };

  const handleCardBlur = (event) => {
    const { name } = event.target;

    setPaymentTouched((current) => ({
      ...current,
      [name]: true,
    }));
  };

  const handleOpenPaymentEdit = () => {
    setCardForm({
      cardholder: "",
      cardNumber: "",
      expiryMonth: storedCard.expiryMonth || "",
      expiryYear: storedCard.expiryYear || "",
      cvv: "",
      saveForFuture: storedCard.saveCardForFuture ?? true,
    });

    setPaymentTouched({});
    setPaymentSubmitAttempted(false);
    setIsPaymentEditOpen(true);
  };

  const handleCancelPaymentEdit = () => {
    setCardForm(emptyCardForm);
    setPaymentTouched({});
    setPaymentSubmitAttempted(false);
    setIsPaymentEditOpen(false);
  };

  const getProfileFieldProps = (fieldName) => ({
    error: profileErrors[fieldName],
    touched: profileTouched[fieldName],
    submitAttempted: profileSubmitAttempted,
    className: "my-profile-page__field",
    controlClassName: "my-profile-page__input",
    errorClassName: "my-profile-page__error",
    errorId: `${fieldName}-profile-error`,
  });

  const getEmailFieldProps = (fieldName) => ({
    error: isEmailChangeEnabled ? emailErrors[fieldName] : "",
    touched: isEmailChangeEnabled ? emailTouched[fieldName] : false,
    submitAttempted: isEmailChangeEnabled ? emailSubmitAttempted : false,
    className: "my-profile-page__field",
    controlClassName: `my-profile-page__input ${isEmailChangeEnabled ? "" : "my-profile-page__input--muted"
      }`,
    errorClassName: "my-profile-page__error",
    errorId: `${fieldName}-profile-error`,
  });

  const getPasswordFieldProps = (fieldName) => ({
    error: mergedPasswordErrors[fieldName],
    touched: passwordTouched[fieldName],
    submitAttempted: passwordSubmitAttempted,
    className: "my-profile-page__field",
    wrapperClassName: "my-profile-page__password-wrapper",
    controlClassName: "my-profile-page__input",
    toggleClassName: "my-profile-page__password-toggle",
    iconClassName: "my-profile-page__password-toggle-icon",
    errorClassName: "my-profile-page__error",
    errorId: `${fieldName}-profile-error`,
    showLabel: false,
  });

  const markAllProfileFieldsAsTouched = () => {
    setProfileTouched(buildTouchedFields(profileFieldOrder));
  };

  const markAllEmailFieldsAsTouched = () => {
    setEmailTouched(buildTouchedFields(profileEmailFieldOrder));
  };

  const markAllPasswordFieldsAsTouched = () => {
    setPasswordTouched(buildTouchedFields(profilePasswordFieldOrder));
  };

  const markAllPaymentFieldsAsTouched = () => {
    setPaymentTouched(buildTouchedFields(paymentFieldNames));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setProfileSubmitAttempted(true);
    markAllProfileFieldsAsTouched();

    if (hasValidationErrors(profileErrors)) {
      showErrorFeedback("Please review your personal details before saving.");
      return;
    }

    if (isEmailChangeEnabled) {
      setEmailSubmitAttempted(true);
      markAllEmailFieldsAsTouched();

      if (hasValidationErrors(emailErrors)) {
        showErrorFeedback("Please review your email details before saving.");
        return;
      }
    }

    if (isPasswordChangeEnabled) {
      setPasswordSubmitAttempted(true);
      markAllPasswordFieldsAsTouched();

      if (hasValidationErrors(mergedPasswordErrors)) {
        showErrorFeedback("Please review your password details before saving.");
        return;
      }
    }

    if (isPaymentEditOpen) {
      setPaymentSubmitAttempted(true);
      markAllPaymentFieldsAsTouched();

      if (hasPaymentValidationErrors(paymentErrors)) {
        showErrorFeedback("Please review your card details before saving.");
        return;
      }
    }

    try {
      setIsSavingProfile(true);
      setFeedbackMessage("");
      setFeedbackType("success");

      await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth,
        phone: form.phone.trim(),
        address: form.address.trim(),
        postalCode: form.postalCode.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        region: form.region.trim(),
      });

      if (isEmailChangeEnabled) {
        await updateEmail({
          newEmail: form.newEmail.trim(),
        });

        setForm((current) => ({
          ...current,
          email: form.newEmail.trim().toLowerCase(),
          newEmail: "",
        }));

        setEmailTouched({});
        setEmailSubmitAttempted(false);
        setIsEmailChangeEnabled(false);
      }

      if (isPasswordChangeEnabled) {
        await updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        });

        setPasswordForm(initialPasswordForm);
        setPasswordTouched({});
        setPasswordSubmitAttempted(false);
        setPasswordBackendErrors({});
        setIsPasswordChangeEnabled(false);
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }

      if (isPaymentEditOpen) {
        const cleanCardNumber = normalizeCardNumber(cardForm.cardNumber);
        const last4 = cleanCardNumber.slice(-4);

        await updatePaymentMethod({
          paymentMethod: "card",
          cardLast4: last4,
          cardExpiryMonth: cardForm.expiryMonth,
          cardExpiryYear: cardForm.expiryYear,
          saveCardForFuture: cardForm.saveForFuture,
        });

        setStoredCard({
          brand: getCardBrand(cleanCardNumber),
          last4,
          expiryMonth: cardForm.expiryMonth,
          expiryYear: cardForm.expiryYear,
          saveCardForFuture: cardForm.saveForFuture,
          hasStoredCard: true,
        });

        setCardForm(emptyCardForm);
        setPaymentTouched({});
        setPaymentSubmitAttempted(false);
        setIsPaymentEditOpen(false);
      }

      setProfileTouched({});
      setProfileSubmitAttempted(false);
      setFeedbackType("success");
      setFeedbackMessage("Profile changes saved successfully.");
      scrollToPageTop();
    } catch (error) {
      const message = getErrorMessage(error, "We could not update your profile.");
      const status = error?.response?.status;

      setFeedbackType("error");

      if (
        isPasswordChangeEnabled &&
        (status === 401 ||
          message.toLowerCase().includes("current password") ||
          message.toLowerCase().includes("password is incorrect") ||
          message.toLowerCase().includes("incorrect"))
      ) {
        setPasswordTouched((current) => ({
          ...current,
          currentPassword: true,
        }));

        setPasswordSubmitAttempted(true);

        setPasswordBackendErrors({
          currentPassword: message,
        });
      }

      setFeedbackMessage(message);
      scrollToPageTop();
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <section className="my-profile-page gm-dark-section-bg">
      <div className="gm-container my-profile-page__container">
        <header className="my-profile-page__header">
          <h1 className="my-profile-page__title">MY PROFILE</h1>
          <p className="my-profile-page__intro">
            Check your personal info and complete your profile.
            <br />
            This helps us provide a better experience for you as a member.
          </p>
        </header>

        <form
          className="my-profile-page__card gm-surface-card"
          onSubmit={handleSubmit}
          noValidate
        >
          {feedbackMessage && (
            <p
              className={`my-profile-page__feedback my-profile-page__feedback--${feedbackType}`}
              role={feedbackType === "error" ? "alert" : "status"}
            >
              {feedbackMessage}
            </p>
          )}

          <ProfilePersonalDetailsSection
            form={form}
            onChange={handleChange}
            onBlur={handleProfileBlur}
            getFieldProps={getProfileFieldProps}
          />

          <AddressFields
            title="ADDRESS"
            baseClassName="my-profile-page"
            form={form}
            onChange={handleChange}
            onBlur={handleProfileBlur}
            getFieldProps={getProfileFieldProps}
            regionOptions={regionOptions}
            cityOptions={cityOptions}
            showDivider
          />

          <ProfileLoginSection
            form={form}
            passwordForm={passwordForm}
            isEmailChangeEnabled={isEmailChangeEnabled}
            isPasswordChangeEnabled={isPasswordChangeEnabled}
            showCurrentPassword={showCurrentPassword}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            onEmailToggleChange={handleEmailToggleChange}
            onPasswordToggleChange={handlePasswordToggleChange}
            onEmailChange={handleChange}
            onEmailBlur={handleEmailBlur}
            onPasswordChange={handlePasswordChange}
            onPasswordBlur={handlePasswordBlur}
            onToggleCurrentPassword={() =>
              setShowCurrentPassword((current) => !current)
            }
            onToggleNewPassword={() => setShowNewPassword((current) => !current)}
            onToggleConfirmPassword={() =>
              setShowConfirmPassword((current) => !current)
            }
            getEmailFieldProps={getEmailFieldProps}
            getPasswordFieldProps={getPasswordFieldProps}
          />

          <ProfilePaymentMethodSection
            storedCard={storedCard}
            isPaymentEditOpen={isPaymentEditOpen}
            cardForm={cardForm}
            paymentErrors={paymentErrors}
            paymentTouched={paymentTouched}
            paymentSubmitAttempted={paymentSubmitAttempted}
            onOpenPaymentEdit={handleOpenPaymentEdit}
            onCancelPaymentEdit={handleCancelPaymentEdit}
            onCardFormChange={handleCardFormChange}
            onCardBlur={handleCardBlur}
          />

          <div className="my-profile-page__actions">
            <button
              type="submit"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow my-profile-page__action-btn"
              disabled={isSavingProfile}
            >
              {isSavingProfile ? "SAVING..." : "SAVE CHANGES"}
            </button>

            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--outline-danger my-profile-page__action-btn"
              onClick={handleLogout}
              disabled={isSavingProfile}
            >
              LOG OUT
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}