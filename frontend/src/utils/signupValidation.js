export const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
  phone: /^\+34 \d{3}-\d{3}-\d{3}$/,
  postalCode: /^\d{5}$/,
  cvv: /^\d{3,4}$/,
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

function normalizeText(value) {
  return String(value ?? "").trim();
}

export function normalizePostalCode(value) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 5);
}

export function normalizeCardNumber(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function hasValidCardLength(cardNumber) {
  return cardNumber.length >= 13 && cardNumber.length <= 19;
}

function hasValidLuhnChecksum(cardNumber) {
  let sum = 0;
  let shouldDouble = false;

  for (let index = cardNumber.length - 1; index >= 0; index -= 1) {
    let digit = Number(cardNumber[index]);

    if (shouldDouble) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function isValidCardNumber(value) {
  const cardNumber = normalizeCardNumber(value);

  if (!/^\d+$/.test(cardNumber)) {
    return false;
  }

  if (!hasValidCardLength(cardNumber)) {
    return false;
  }

  return hasValidLuhnChecksum(cardNumber);
}

function isExpiryDateValid(month, year) {
  const normalizedMonth = normalizeText(month);
  const normalizedYear = normalizeText(year);

  if (!normalizedMonth || !normalizedYear) {
    return false;
  }

  const monthNumber = Number(normalizedMonth);
  const yearNumber = Number(normalizedYear);

  if (
    Number.isNaN(monthNumber) ||
    Number.isNaN(yearNumber) ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    return false;
  }

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  if (yearNumber > currentYear) {
    return true;
  }

  return yearNumber === currentYear && monthNumber >= currentMonth;
}

export function validateSignUpField(name, value, form) {
  const textValue = normalizeText(value);

  switch (name) {
    case "firstName":
    case "lastName":
      return textValue ? "" : "Required field";

    case "gender":
      return textValue ? "" : "Select an option";

    case "dateOfBirth":
      return textValue ? "" : "Required field";

    case "email":
      if (!textValue) {
        return "Required field";
      }

      return regex.email.test(textValue)
        ? ""
        : "Invalid email (e.g., user@mail.com)";

    case "phone":
      if (!textValue) {
        return "Required field";
      }

      return regex.phone.test(textValue)
        ? ""
        : "Format: +34 600-123-456";

    case "password":
      if (!textValue) {
        return "Required field";
      }

      return regex.password.test(textValue)
        ? ""
        : "Min 8 characters, uppercase, lowercase, number, symbol (@$!%*?&)";

    case "confirmPassword":
      if (!textValue) {
        return "Required field";
      }

      return textValue === form.password ? "" : "Passwords do not match";

    case "address":
      return textValue ? "" : "Required field";

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
      return textValue ? "" : "Required field";

    case "cardNumber":
      if (!textValue) {
        return "Required field";
      }

      return isValidCardNumber(textValue)
        ? ""
        : "Invalid card number";

    case "expiryMonth":
      if (!textValue) {
        return "Select expiry month";
      }

      return isExpiryDateValid(form.expiryMonth, form.expiryYear)
        ? ""
        : "Invalid expiry date";

    case "expiryYear":
      if (!textValue) {
        return "Select expiry year";
      }

      return isExpiryDateValid(form.expiryMonth, form.expiryYear)
        ? ""
        : "Invalid expiry date";

    case "cvv":
      if (!textValue) {
        return "Required field";
      }

      return regex.cvv.test(textValue) ? "" : "CVV must have 3 or 4 digits";

    case "acceptedTerms":
      return value ? "" : "You must accept the terms and privacy policy";

    default:
      return "";
  }
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