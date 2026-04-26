export const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export const emptyCardForm = {
  cardholder: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  saveForFuture: true,
};

export function formatDateForInput(value) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toISOString().slice(0, 10);
}

export function getInitialProfileForm(user) {
  return {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: formatDateForInput(user?.dateOfBirth),
    phone: user?.phone || "",
    address: user?.address || "",
    postalCode: user?.postalCode || "",
    city: user?.city || "",
    country: user?.country || "España",
    region: user?.region || "",
    email: user?.email || "",
    newEmail: "",
  };
}

export function getInitialStoredCard(user) {
  const hasStoredCard = Boolean(user?.cardLast4);

  return {
    brand: user?.paymentMethod?.toUpperCase() === "CARD" ? "VISA" : "VISA",
    last4: user?.cardLast4 || "----",
    expiryMonth: user?.cardExpiryMonth || "",
    expiryYear: user?.cardExpiryYear || "",
    saveCardForFuture: user?.saveCardForFuture ?? true,
    hasStoredCard,
  };
}

export function getCardBrand(cardNumber) {
  const cleanNumber = String(cardNumber ?? "").replace(/\D/g, "");

  if (cleanNumber.startsWith("4")) {
    return "VISA";
  }

  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return "MASTERCARD";
  }

  return "CARD";
}

export function getErrorMessage(error, fallbackMessage) {
  const backendData = error?.response?.data;

  if (typeof backendData === "string") {
    return backendData;
  }

  if (typeof backendData?.message === "string") {
    return backendData.message;
  }

  return fallbackMessage;
}