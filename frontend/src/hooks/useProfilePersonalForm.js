import { useMemo, useState } from "react";
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

  const resetProfileValidationState = () => {
    setProfileTouched({});
    setProfileSubmitAttempted(false);
  };

  const resetProfileForm = () => {
    setForm(getInitialProfileForm(user));
    resetProfileValidationState();
  };

  const validateProfileDetails = () => {
    setProfileSubmitAttempted(true);
    setProfileTouched(buildTouchedFields(profileFieldOrder));

    return !hasValidationErrors(profileErrors);
  };

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