import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useLocationFields from "../hooks/useLocationFields";
import useAuth from "../hooks/useAuth";
import useProfileLoginSettings from "../hooks/useProfileLoginSettings";
import useProfilePaymentMethod from "../hooks/useProfilePaymentMethod";
import ProfilePersonalDetailsSection from "../components/profile/ProfilePersonalDetailsSection";
import ProfileLoginSection from "../components/profile/ProfileLoginSection";
import ProfilePaymentMethodSection from "../components/profile/ProfilePaymentMethodSection";
import { AddressFields } from "../components/forms";
import { buildTouchedFields } from "../utils/formStateUtils";
import {
  hasValidationErrors,
  normalizePostalCode,
  profileFieldOrder,
  validateProfileForm,
} from "../utils/accountValidation";
import {
  getErrorMessage,
  getInitialProfileForm,
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

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [profileTouched, setProfileTouched] = useState({});
  const [profileSubmitAttempted, setProfileSubmitAttempted] = useState(false);

  const profileErrors = useMemo(() => validateProfileForm(form), [form]);

  const {
    passwordForm,
    isEmailChangeEnabled,
    isPasswordChangeEnabled,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handleEmailToggleChange,
    handlePasswordToggleChange,
    getEmailFieldProps,
    getPasswordFieldProps,
    validateEnabledEmailChange,
    validateEnabledPasswordChange,
    registerPasswordBackendError,
    resetEmailState,
    resetPasswordState,
    resetLoginState,
    toggleCurrentPassword,
    toggleNewPassword,
    toggleConfirmPassword,
  } = useProfileLoginSettings({
    form,
    setForm,
  });

  const {
    storedCard,
    isPaymentEditOpen,
    cardForm,
    paymentTouched,
    paymentSubmitAttempted,
    paymentErrors,
    hasPaymentErrors,
    handleCardFormChange,
    handleCardBlur,
    handleOpenPaymentEdit,
    handleCancelPaymentEdit,
    markAllPaymentFieldsAsTouched,
    savePaymentMethod,
  } = useProfilePaymentMethod({
    user,
    updatePaymentMethod,
  });

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
    resetLoginState();
  }, [user?.id]);

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

  const getProfileFieldProps = (fieldName) => ({
    error: profileErrors[fieldName],
    touched: profileTouched[fieldName],
    submitAttempted: profileSubmitAttempted,
    className: "my-profile-page__field",
    controlClassName: "my-profile-page__input",
    errorClassName: "my-profile-page__error",
    errorId: `${fieldName}-profile-error`,
  });

  const markAllProfileFieldsAsTouched = () => {
    setProfileTouched(buildTouchedFields(profileFieldOrder));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setProfileSubmitAttempted(true);
    markAllProfileFieldsAsTouched();

    if (hasValidationErrors(profileErrors)) {
      showErrorFeedback("Please review your personal details before saving.");
      return;
    }

    if (isEmailChangeEnabled && !validateEnabledEmailChange()) {
      showErrorFeedback("Please review your email details before saving.");
      return;
    }

    if (isPasswordChangeEnabled && !validateEnabledPasswordChange()) {
      showErrorFeedback("Please review your password details before saving.");
      return;
    }

    if (isPaymentEditOpen) {
      markAllPaymentFieldsAsTouched();

      if (hasPaymentErrors) {
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

        resetEmailState();
      }

      if (isPasswordChangeEnabled) {
        await updatePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        });

        resetPasswordState();
      }

      if (isPaymentEditOpen) {
        await savePaymentMethod();
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
        registerPasswordBackendError(message);
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
            onToggleCurrentPassword={toggleCurrentPassword}
            onToggleNewPassword={toggleNewPassword}
            onToggleConfirmPassword={toggleConfirmPassword}
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