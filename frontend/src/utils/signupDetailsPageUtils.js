import { normalizeCardNumber } from "./accountValidation";

export const initialSignUpDetailsForm = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  address: "",
  postalCode: "",
  country: "España",
  region: "",
  city: "",
  cardholder: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  saveCardForFuture: true,
  acceptedTerms: false,
};

export function buildSignUpRegistrationPayload({
  form,
  club,
  membershipPlan,
  workoutPlan,
}) {
  const cleanCardNumber = normalizeCardNumber(form.cardNumber);

  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    gender: form.gender,
    dateOfBirth: form.dateOfBirth,
    email: form.email.trim(),
    phone: form.phone.trim(),
    password: form.password,
    address: form.address.trim(),
    postalCode: form.postalCode.trim(),
    city: form.city,
    country: form.country,
    region: form.region,

    paymentMethod: "card",
    cardLast4: cleanCardNumber.slice(-4),
    cardExpiryMonth: form.expiryMonth,
    cardExpiryYear: form.expiryYear,
    saveCardForFuture: form.saveCardForFuture,

    clubId: club.id,
    membershipPlanId: membershipPlan.backendId,
    workoutPlanId: workoutPlan.backendId,
    acceptedTerms: form.acceptedTerms,
  };
}

export function buildSignUpCompleteParams({
  club,
  membershipPlan,
  workoutPlan,
  totals,
  result,
}) {
  return new URLSearchParams({
    clubId: String(club.id),
    membership: membershipPlan.id,
    workout: workoutPlan.id,
    amount: totals.totalFirstPayment.toFixed(2),
    userId: String(result.user.id),
    email: result.user.email,
  }).toString();
}

export function getSignUpApiErrorMessage(error) {
  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data ||
    "No se pudo completar el registro. Inténtalo de nuevo.";

  return typeof backendMessage === "string"
    ? backendMessage
    : "No se pudo completar el registro. Inténtalo de nuevo.";
}