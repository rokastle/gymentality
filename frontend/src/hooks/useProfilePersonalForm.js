import { useCallback, useMemo, useState } from "react";
import useLocationFields from "./useLocationFields";
import { buildTouchedFields } from "../utils/formStateUtils";
import {
  hasValidationErrors,
  normalizePostalCode,
  profileFieldOrder,
  validateProfileForm,
} from "../utils/accountValidation";
import { getInitialProfileForm } from "../utils/profilePageUtils";

export default function useProfilePersonalForm({ user }) {
  const [form, setForm] = useState(() => getInitialProfileForm(user));
  const [profileTouched, setProfileTouched] = useState({});
  const [profileSubmitAttempted, setProfileSubmitAttempted] = useState(false);

  const profileErrors = useMemo(() => validateProfileForm(form), [form]);

  const { regionOptions, cityOptions, applyLocationChange } = useLocationFields({
    country: form.country,
    region: form.region,
    city: form.city,
    setForm,
  });

  const handleChange = useCallback((event) => {
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
  }, [applyLocationChange]);

  const handleProfileBlur = useCallback((event) => {
    const { name } = event.target;

    setProfileTouched((current) => ({
      ...current,
      [name]: true,
    }));
  }, []);

  const getProfileFieldProps = useCallback((fieldName) => ({
    error: profileErrors[fieldName],
    touched: profileTouched[fieldName],
    submitAttempted: profileSubmitAttempted,
    className: "my-profile-page__field",
    controlClassName: "my-profile-page__input",
    errorClassName: "my-profile-page__error",
    errorId: `${fieldName}-profile-error`,
  }), [profileErrors, profileSubmitAttempted, profileTouched]);

  const resetProfileValidationState = useCallback(() => {
    setProfileTouched({});
    setProfileSubmitAttempted(false);
  }, []);

  const resetProfileForm = useCallback(() => {
    setForm(getInitialProfileForm(user));
    resetProfileValidationState();
  }, [resetProfileValidationState, user]);

  const validateProfileDetails = useCallback(() => {
    setProfileSubmitAttempted(true);
    setProfileTouched(buildTouchedFields(profileFieldOrder));

    return !hasValidationErrors(profileErrors);
  }, [profileErrors]);

  return {
    form,
    setForm,
    regionOptions,
    cityOptions,
    profileErrors,
    handleChange,
    handleProfileBlur,
    getProfileFieldProps,
    validateProfileDetails,
    resetProfileForm,
    resetProfileValidationState,
  };
}
