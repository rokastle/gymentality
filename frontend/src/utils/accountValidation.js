import {
  normalizeCardNumber,
  validatePaymentField,
} from "./paymentValidation";

export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
  phone: /^\+34 \d{3}-\d{3}-\d{3}$/,
  postalCode: /^\d{5}$/,
};

export const countryOptions = ["España"];

export const regionOptionsByCountry = {
  España: [
    "Andalucía",
    "Comunidad de Madrid",
    "Cataluña",
    "Comunidad Valenciana",
  ],
};

export const cityOptionsByRegion = {
  Andalucía: ["Málaga", "Sevilla", "Granada", "Córdoba"],
  "Comunidad de Madrid": ["Madrid", "Alcalá de Henares", "Getafe", "Móstoles"],
  Cataluña: ["Barcelona", "Girona", "Tarragona", "Lleida"],
  "Comunidad Valenciana": ["Valencia", "Alicante", "Castellón", "Elche"],
};

export const profileFieldOrder = [
  "firstName",
  "lastName",
  "dateOfBirth",
  "phone",
  "address",
  "postalCode",
  "country",
  "region",
  "city",
];

export const profileEmailFieldOrder = ["newEmail"];

export const profilePasswordFieldOrder = [
  "currentPassword",
  "newPassword",
  "confirmPassword",
];

export const signUpFieldOrder = [
  "firstName",
  "lastName",
  "gender",
  "dateOfBirth",
  "email",
  "phone",
  "password",
  "confirmPassword",
  "address",
  "postalCode",
  "country",
  "region",
  "city",
  "cardholder",
  "cardNumber",
  "expiryMonth",
  "expiryYear",
  "cvv",
  "acceptedTerms",
];

export function normalizeText(value) {
  return String(value ?? "").trim();
}

export function normalizePostalCode(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 5);
}

export { normalizeCardNumber };

export function validateAccountField(name, value, form = {}) {
  const textValue = normalizeText(value);

  switch (name) {
    case "firstName":
    case "lastName":
    case "dateOfBirth":
    case "address":
      return textValue ? "" : "Required field";

    case "gender":
      return textValue ? "" : "Select an option";

    case "email":
      if (!textValue) {
        return "Required field";
      }

      return regex.email.test(textValue)
        ? ""
        : "Invalid email (e.g., user@mail.com)";

    case "newEmail":
      if (!textValue) {
        return "Required field";
      }

      if (!regex.email.test(textValue)) {
        return "Invalid email (e.g., user@mail.com)";
      }

      if (
        form.email &&
        textValue.toLowerCase() === normalizeText(form.email).toLowerCase()
      ) {
        return "New email must be different from current email";
      }

      return "";

    case "phone":
      if (!textValue) {
        return "Required field";
      }

      return regex.phone.test(textValue) ? "" : "Format: +34 600-123-456";

    case "password":
      if (!textValue) {
        return "Required field";
      }

      return regex.password.test(textValue)
        ? ""
        : "Min 8 characters, uppercase, lowercase, number, symbol (@$!%*?&)";

    case "currentPassword":
      if (!textValue) {
        return "Current password is required";
      }

      return regex.password.test(textValue)
        ? ""
        : "Min 8 characters, uppercase, lowercase, number, symbol (@$!%*?&)";

    case "newPassword":
      if (!textValue) {
        return "Required field";
      }

      return regex.password.test(textValue)
        ? ""
        : "Min 8 characters, uppercase, lowercase, number, symbol (@$!%*?&)";

    case "confirmPassword": {
      if (!textValue) {
        return "Required field";
      }

      const expectedPassword = form.newPassword ?? form.password ?? "";

      return textValue === expectedPassword ? "" : "Passwords do not match";
    }

    case "postalCode":
      if (!textValue) {
        return "Required field";
      }

      return regex.postalCode.test(textValue)
        ? ""
        : "The postal code must have 5 digits";

    case "country":
      return textValue ? "" : "Select a country";

    case "region":
      return textValue ? "" : "Select a province or region";

    case "city":
      return textValue ? "" : "Select a city";

    case "cardholder":
    case "cardNumber":
    case "expiryMonth":
    case "expiryYear":
    case "cvv":
      return validatePaymentField(name, value, form);

    case "acceptedTerms":
      return value ? "" : "You must accept the terms and privacy policy";

    default:
      return "";
  }
}

export function validateProfileForm(form) {
  return profileFieldOrder.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = validateAccountField(
      fieldName,
      form[fieldName],
      form
    );

    return accumulator;
  }, {});
}

export function validateProfileEmailForm(form) {
  return profileEmailFieldOrder.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = validateAccountField(
      fieldName,
      form[fieldName],
      form
    );

    return accumulator;
  }, {});
}

export function validateProfilePasswordForm(form) {
  return profilePasswordFieldOrder.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = validateAccountField(
      fieldName,
      form[fieldName],
      form
    );

    return accumulator;
  }, {});
}

export function validateSignUpField(name, value, form) {
  return validateAccountField(name, value, form);
}

export function validateSignUpForm(form) {
  return signUpFieldOrder.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = validateSignUpField(
      fieldName,
      form[fieldName],
      form
    );

    return accumulator;
  }, {});
}

export function hasValidationErrors(errors) {
  return Object.values(errors).some(Boolean);
}