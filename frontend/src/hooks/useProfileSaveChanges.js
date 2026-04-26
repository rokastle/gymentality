import { useState } from "react";
import { getErrorMessage } from "../utils/profilePageUtils";

function scrollToPageTop() {
  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function buildProfilePayload(form) {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    dateOfBirth: form.dateOfBirth,
    phone: form.phone.trim(),
    address: form.address.trim(),
    postalCode: form.postalCode.trim(),
    city: form.city.trim(),
    country: form.country.trim(),
    region: form.region.trim(),
  };
}

function isCurrentPasswordBackendError(status, message) {
  const normalizedMessage = String(message || "").toLowerCase();

  return (
    status === 401 ||
    normalizedMessage.includes("current password") ||
    normalizedMessage.includes("password is incorrect") ||
    normalizedMessage.includes("incorrect")
  );
}

export default function useProfileSaveChanges({
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
}) {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const showErrorFeedback = (message) => {
    setFeedbackType("error");
    setFeedbackMessage(message);
    scrollToPageTop();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateProfileDetails()) {
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

      await updateProfile(buildProfilePayload(form));

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

      resetProfileValidationState();
      setFeedbackType("success");
      setFeedbackMessage("Profile changes saved successfully.");
      scrollToPageTop();
    } catch (error) {
      const message = getErrorMessage(error, "We could not update your profile.");
      const status = error?.response?.status;

      setFeedbackType("error");

      if (
        isPasswordChangeEnabled &&
        isCurrentPasswordBackendError(status, message)
      ) {
        registerPasswordBackendError(message);
      }

      setFeedbackMessage(message);
      scrollToPageTop();
    } finally {
      setIsSavingProfile(false);
    }
  };

  return {
    feedbackMessage,
    feedbackType,
    isSavingProfile,
    handleSubmit,
  };
}