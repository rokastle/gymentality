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
  "iban",
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

function normalizeIban(value) {
  return String(value ?? "")
    .toUpperCase()
    .replace(/\s+/g, "");
}

function getIbanExpectedLength(countryCode) {
  const ibanLengths = {
    ES: 24,
    DE: 22,
    FR: 27,
    NO: 15,
  };

  return ibanLengths[countryCode] ?? null;
}

function ibanToNumericString(iban) {
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;

  return rearranged
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);

      if (code >= 65 && code <= 90) {
        return String(code - 55);
      }

      return char;
    })
    .join("");
}

function hasValidIbanChecksum(iban) {
  const numericIban = ibanToNumericString(iban);
  let remainder = 0;

  for (const digit of numericIban) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
}

export function isValidIban(value) {
  const iban = normalizeIban(value);

  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
    return false;
  }

  const expectedLength = getIbanExpectedLength(iban.slice(0, 2));

  if (!expectedLength || iban.length !== expectedLength) {
    return false;
  }

  if (iban.startsWith("ES") && !/^ES\d{22}$/.test(iban)) {
    return false;
  }

  return hasValidIbanChecksum(iban);
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

    case "iban":
      if (!textValue) {
        return "Required field";
      }
      return isValidIban(textValue)
        ? ""
        : "Invalid IBAN (e.g., ES12 1234 1234 12 1234567890)";

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