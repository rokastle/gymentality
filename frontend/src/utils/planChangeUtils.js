export function normalizePlanValue(value = "") {
  return value.toLowerCase().trim();
}

export function getMembershipKeyword(value = "") {
  const normalized = normalizePlanValue(value);

  if (normalized.includes("quarter")) {
    return "quarter";
  }

  if (normalized.includes("annual") || normalized.includes("year")) {
    return "annual";
  }

  if (normalized.includes("month")) {
    return "month";
  }

  return normalized;
}

export function getWorkoutKeyword(value = "") {
  const normalized = normalizePlanValue(value);

  if (normalized.includes("personal")) {
    return "personal";
  }

  if (normalized.includes("integral")) {
    return "integral";
  }

  if (normalized.includes("basic")) {
    return "basic";
  }

  return normalized;
}

export function isCurrentPlanByKeyword(plan, currentPlanName, getKeyword) {
  const currentKeyword = getKeyword(currentPlanName);
  const planText = normalizePlanValue(`${plan.title} ${plan.summaryName}`);

  return Boolean(currentKeyword && planText.includes(currentKeyword));
}

export function getPendingPlanId(storageKey) {
  if (!storageKey) {
    return null;
  }

  try {
    const rawPendingChange = localStorage.getItem(storageKey);
    const pendingChange = rawPendingChange ? JSON.parse(rawPendingChange) : null;

    return pendingChange?.planId ?? null;
  } catch {
    return null;
  }
}

export function savePendingPlanChange(storageKey, plan) {
  const pendingChange = {
    planId: plan.id,
    planName: plan.summaryName,
    requestedAt: new Date().toISOString(),
    status: "scheduled",
  };

  localStorage.setItem(storageKey, JSON.stringify(pendingChange));
}
