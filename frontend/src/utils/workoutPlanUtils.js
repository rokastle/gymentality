function normalizePlanName(value = "") {
  return value.toLowerCase().trim();
}

export function getWorkoutPlanType(user) {
  const planName = normalizePlanName(user?.workoutPlanName);

  if (planName.includes("basic")) {
    return "basic";
  }

  if (planName.includes("personal")) {
    return "personal";
  }

  if (planName.includes("integral")) {
    return "integral";
  }

  return null;
}
