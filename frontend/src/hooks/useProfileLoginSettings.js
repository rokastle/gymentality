import { useCallback, useMemo, useState } from "react";
import { buildTouchedFields } from "../utils/formStateUtils";
import {
  hasValidationErrors,
  profileEmailFieldOrder,
  profilePasswordFieldOrder,
  validateProfileEmailForm,
  validateProfilePasswordForm,
} from "../utils/accountValidation";
import { initialPasswordForm } from "../utils/profilePageUtils";

export default function useProfileLoginSettings({ form, setForm }) {
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);

  const [isEmailChangeEnabled, setIsEmailChangeEnabled] = useState(false);
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailTouched, setEmailTouched] = useState({});
  const [emailSubmitAttempted, setEmailSubmitAttempted] = useState(false);

  const [passwordTouched, setPasswordTouched] = useState({});
  const [passwordSubmitAttempted, setPasswordSubmitAttempted] = useState(false);
  const [passwordBackendErrors, setPasswordBackendErrors] = useState({});

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

  const resetEmailState = useCallback(() => {
    setEmailTouched({});
    setEmailSubmitAttempted(false);
    setIsEmailChangeEnabled(false);
  }, []);

  const resetPasswordState = useCallback(() => {
    setPasswordForm(initialPasswordForm);
    setPasswordTouched({});
    setPasswordSubmitAttempted(false);
    setPasswordBackendErrors({});
    setIsPasswordChangeEnabled(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const resetLoginState = useCallback(() => {
    resetEmailState();
    resetPasswordState();
  }, [resetEmailState, resetPasswordState]);

  const handleEmailBlur = useCallback((event) => {
    const { name } = event.target;

    setEmailTouched((current) => ({
      ...current,
      [name]: true,
    }));
  }, []);

  const handlePasswordChange = useCallback((event) => {
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
  }, []);

  const handlePasswordBlur = useCallback((event) => {
    const { name } = event.target;

    setPasswordTouched((current) => ({
      ...current,
      [name]: true,
    }));
  }, []);

  const handleEmailToggleChange = useCallback((event) => {
    const enabled = event.target.checked;

    setIsEmailChangeEnabled(enabled);
    setEmailTouched({});
    setEmailSubmitAttempted(false);

    setForm((current) => ({
      ...current,
      newEmail: "",
    }));
  }, [setForm]);

  const handlePasswordToggleChange = useCallback((event) => {
    const enabled = event.target.checked;

    setIsPasswordChangeEnabled(enabled);
    setPasswordTouched({});
    setPasswordSubmitAttempted(false);
    setPasswordBackendErrors({});
    setPasswordForm(initialPasswordForm);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const markAllEmailFieldsAsTouched = useCallback(() => {
    setEmailTouched(buildTouchedFields(profileEmailFieldOrder));
    setEmailSubmitAttempted(true);
  }, []);

  const markAllPasswordFieldsAsTouched = useCallback(() => {
    setPasswordTouched(buildTouchedFields(profilePasswordFieldOrder));
    setPasswordSubmitAttempted(true);
  }, []);

  const getEmailFieldProps = useCallback((fieldName) => ({
    error: isEmailChangeEnabled ? emailErrors[fieldName] : "",
    touched: isEmailChangeEnabled ? emailTouched[fieldName] : false,
    submitAttempted: isEmailChangeEnabled ? emailSubmitAttempted : false,
    className: "my-profile-page__field",
    controlClassName: `my-profile-page__input ${
      isEmailChangeEnabled ? "" : "my-profile-page__input--muted"
    }`,
    errorClassName: "my-profile-page__error",
    errorId: `${fieldName}-profile-error`,
  }), [emailErrors, emailSubmitAttempted, emailTouched, isEmailChangeEnabled]);

  const getPasswordFieldProps = useCallback((fieldName) => ({
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
  }), [mergedPasswordErrors, passwordSubmitAttempted, passwordTouched]);

  const validateEnabledEmailChange = useCallback(() => {
    if (!isEmailChangeEnabled) {
      return true;
    }

    markAllEmailFieldsAsTouched();
    return !hasValidationErrors(emailErrors);
  }, [emailErrors, isEmailChangeEnabled, markAllEmailFieldsAsTouched]);

  const validateEnabledPasswordChange = useCallback(() => {
    if (!isPasswordChangeEnabled) {
      return true;
    }

    markAllPasswordFieldsAsTouched();
    return !hasValidationErrors(mergedPasswordErrors);
  }, [isPasswordChangeEnabled, markAllPasswordFieldsAsTouched, mergedPasswordErrors]);

  const registerPasswordBackendError = useCallback((message) => {
    setPasswordTouched((current) => ({
      ...current,
      currentPassword: true,
    }));

    setPasswordSubmitAttempted(true);

    setPasswordBackendErrors({
      currentPassword: message,
    });
  }, []);

  const toggleCurrentPassword = useCallback(() => {
    setShowCurrentPassword((current) => !current);
  }, []);

  const toggleNewPassword = useCallback(() => {
    setShowNewPassword((current) => !current);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((current) => !current);
  }, []);

  return {
    passwordForm,
    isEmailChangeEnabled,
    isPasswordChangeEnabled,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    emailErrors,
    mergedPasswordErrors,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handleEmailToggleChange,
    handlePasswordToggleChange,
    markAllEmailFieldsAsTouched,
    markAllPasswordFieldsAsTouched,
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
  };
}
