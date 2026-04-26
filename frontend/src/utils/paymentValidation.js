export const paymentFieldNames = [
  "cardholder",
  "cardNumber",
  "expiryMonth",
  "expiryYear",
  "cvv",
];

export const paymentRegex = {
  cvv: /^\d{3,4}$/,
};

function normalizeText(value) {
  return String(value ?? "").trim();
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
    return true;
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

export function validatePaymentField(name, value, form) {
  const textValue = normalizeText(value);

  switch (name) {
    case "cardholder":
      return textValue ? "" : "Required field";

    case "cardNumber":
      if (!textValue) {
        return "Required field";
      }

      return isValidCardNumber(textValue) ? "" : "Invalid card number";

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

      return paymentRegex.cvv.test(textValue)
        ? ""
        : "CVV must have 3 or 4 digits";

    default:
      return "";
  }
}

export function validatePaymentForm(form) {
  return paymentFieldNames.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = validatePaymentField(
      fieldName,
      form[fieldName],
      form
    );

    return accumulator;
  }, {});
}

export function hasPaymentValidationErrors(errors) {
  return Object.values(errors).some(Boolean);
}