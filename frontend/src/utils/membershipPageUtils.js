const EURO_SYMBOL = String.fromCharCode(8364);

export function normalizeValue(value = "") {
  return value.toLowerCase().trim();
}

export function getMembershipPlanKey(name = "") {
  const normalized = normalizeValue(name);

  if (normalized.includes("quarter") || normalized.includes("quater")) {
    return "quarterly";
  }

  if (normalized.includes("annual") || normalized.includes("year")) {
    return "annual";
  }

  return "monthly";
}

export function getWorkoutPlanKey(name = "") {
  const normalized = normalizeValue(name);

  if (normalized.includes("personal")) {
    return "personal";
  }

  if (normalized.includes("integral")) {
    return "integral";
  }

  return "basic";
}

export function formatEuro(value) {
  return `${Number(value || 0).toFixed(2)} ${EURO_SYMBOL}`;
}

export function formatEuroPerMonth(value) {
  return `${Number(value || 0).toFixed(2)} ${EURO_SYMBOL}/Month`;
}

export function formatLongDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function getSafeMemberSinceDate(user) {
  const rawDate =
    user?.createdAt || user?.memberSince || user?.registrationDate || "";

  if (rawDate) {
    const parsed = new Date(rawDate);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const fallback = new Date();
  fallback.setMonth(fallback.getMonth() - 3);
  return fallback;
}

export function getNextRenewalDate(memberSinceDate, cycleInMonths) {
  const today = new Date();
  let nextDate = addMonths(memberSinceDate, cycleInMonths);

  while (nextDate <= today) {
    nextDate = addMonths(nextDate, cycleInMonths);
  }

  return nextDate;
}

export function getPaymentBrand(user) {
  const paymentMethod = normalizeValue(user?.paymentMethod);

  if (paymentMethod === "card") {
    return "VISA";
  }

  return "CARD";
}

export function getPaymentExpiryLabel(user) {
  if (!user?.cardExpiryMonth || !user?.cardExpiryYear) {
    return "No expiration date";
  }

  const month = String(user.cardExpiryMonth).padStart(2, "0");

  return `Expires ${user.cardExpiryYear}/${month}`;
}

export function getPaymentMethodLabel(user) {
  if (!user?.cardLast4) {
    return "No payment method";
  }

  return `${getPaymentBrand(user)} ending in ${user.cardLast4}`;
}

export function buildPaymentHistory({
  nextPaymentDate,
  cycleInMonths,
  totalMonthlyFee,
}) {
  return Array.from({ length: 12 }, (_, index) => {
    const paymentDate = addMonths(
      nextPaymentDate,
      -(index + 1) * Math.max(1, cycleInMonths)
    );

    return {
      id: `payment-${index + 1}`,
      date: formatShortDate(paymentDate),
      dateISO: paymentDate.toISOString().slice(0, 10),
      status: "Paid",
      description: "Membership and workout fee",
      amount: formatEuro(totalMonthlyFee),
      invoice: `INV-${paymentDate.getFullYear()}${String(
        paymentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
    };
  });
}

export function getCancellationStorageKey(user) {
  return user?.id ? `gm_membership_cancellation_${user.id}` : null;
}

export function hasStoredCancellation(storageKey) {
  return Boolean(storageKey && localStorage.getItem(storageKey) === "true");
}
