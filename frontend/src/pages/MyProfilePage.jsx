import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import useProfilePersonalForm from "../hooks/useProfilePersonalForm";
import useProfileLoginSettings from "../hooks/useProfileLoginSettings";
import useProfilePaymentMethod from "../hooks/useProfilePaymentMethod";
import useProfileSaveChanges from "../hooks/useProfileSaveChanges";
import ProfilePersonalDetailsSection from "../components/profile/ProfilePersonalDetailsSection";
import ProfileLoginSection from "../components/profile/ProfileLoginSection";
import ProfilePaymentMethodSection from "../components/profile/ProfilePaymentMethodSection";
import { AddressFields } from "../components/forms";

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

  const {
    form,
    setForm,
    regionOptions,
    cityOptions,
    handleChange,
    handleProfileBlur,
    getProfileFieldProps,
    validateProfileDetails,
    resetProfileForm,
    resetProfileValidationState,
  } = useProfilePersonalForm({ user });

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

  const {
    feedbackMessage,
    feedbackType,
    isSavingProfile,
    handleSubmit,
  } = useProfileSaveChanges({
    form,
    setForm,
    passwordForm,
    isEmailChangeEnabled,
    isPasswordChangeEnabled,
    isPaymentEditOpen,
    updateProfile,
    updateEmail,
    updatePassword,
    validateProfileDetails,
    validateEnabledEmailChange,
    validateEnabledPasswordChange,
    markAllPaymentFieldsAsTouched,
    hasPaymentErrors,
    savePaymentMethod,
    resetProfileValidationState,
    resetEmailState,
    resetPasswordState,
    registerPasswordBackendError,
  });

  useEffect(() => {
    resetProfileForm();
    resetLoginState();
  }, [resetLoginState, resetProfileForm, user?.id]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

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
