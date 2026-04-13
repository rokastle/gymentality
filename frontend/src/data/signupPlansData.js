export const membershipSignUpPlans = [
  {
    id: "monthly",
    backendId: 1,
    title: "MONTHLY PLAN",
    priceText: "39,99 €/Month",
    subtitleLines: ["No commitment.", "Total flexibility"],
    secondaryLines: [],
    features: [
      "FREE daily-use locker",
      "Book up to 24 hours in advance",
      "Online Workouts",
      "Discounts with partner brands",
      "Automatic monthly renewal",
    ],
    summaryName: "Monthly plan",
    monthlyEquivalent: 39.99,
    upfrontPrice: 39.99,
    renewalDays: 30,
  },
  {
    id: "quarterly",
    backendId: 2,
    title: "QUATERLY PLAN",
    priceText: "104,97 €",
    subtitleLines: ["every 3 Month"],
    secondaryLines: ["34.99 €/Month", "Save 12%"],
    features: [
      "FREE daily-use locker",
      "Book up to 24 hours in advance",
      "Online Workouts",
      "Discounts with partner brands",
      "Automatic monthly renewal",
    ],
    summaryName: "Quarterly plan",
    monthlyEquivalent: 34.99,
    upfrontPrice: 104.97,
    renewalDays: 90,
  },
  {
    id: "annual",
    backendId: 3,
    title: "ANNUAL PLAN",
    priceText: "359,88 €",
    subtitleLines: ["per Year"],
    secondaryLines: ["29.99 €/Month", "Save 25%"],
    features: [
      "FREE daily-use locker",
      "Book up to 24 hours in advance",
      "Online Workouts",
      "Discounts with partner brands",
      "Automatic monthly renewal",
    ],
    summaryName: "Annual plan",
    monthlyEquivalent: 29.99,
    upfrontPrice: 359.88,
    renewalDays: 365,
  },
];

export const workoutSignUpPlans = [
  {
    id: "basic",
    backendId: 4,
    title: "BASIC PLAN",
    priceText: "FREE",
    descriptionLines: [
      "Perfect for experienced or",
      "self-motivated members.",
    ],
    includesLabel: "What’s included:",
    features: [
      "Access to all training areas during opening hours.",
      "Use of cardio, strength, and functional equipment.",
      "Freedom to follow your own routine at your own pace.",
    ],
    summaryName: "Basic plan",
    monthlyPrice: 0,
  },
  {
    id: "personal",
    backendId: 5,
    title: "PERSONAL PLAN",
    priceText: "30 €/ Month",
    descriptionLines: [
      "Work one-on-one with",
      "a certified personal trainer",
      "",
    ],
    includesLabel: "What’s included:",
    features: [
      "Personalized training program tailored to your goals.",
      "One-on-one coaching sessions.",
      "Technique correction and injury-prevention guidance.",
      "Weekly progress check-ins and program adjustments.",
    ],
    summaryName: "Personal plan",
    monthlyPrice: 30,
  },
  {
    id: "integral",
    backendId: 6,
    title: "INTEGRAL PLAN",
    priceText: "50 €/ Month",
    descriptionLines: [
      "Best choice for members who want",
      "results with full professional support.",
    ],
    includesLabel: "What’s included:",
    features: [
      "Customized nutrition advice based on your goals.",
      "Meal guidance and healthy habit strategies.",
      "Ongoing trainer + nutrition follow-ups.",
      "Adjustments based on progress and lifestyle.",
    ],
    summaryName: "Integral plan",
    monthlyPrice: 50,
  },
];

export function getMembershipPlanById(planId) {
  return membershipSignUpPlans.find((plan) => plan.id === planId);
}

export function getWorkoutPlanById(planId) {
  return workoutSignUpPlans.find((plan) => plan.id === planId);
}

export function formatEuro(value) {
  return `${value.toFixed(2).replace(".", ",")}€`;
}

export function formatEuroMonth(value) {
  return `${value.toFixed(2).replace(".", ",")} €/ Month`;
}

export function getRenewalDate(daysToAdd) {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  const day = String(nextDate.getDate()).padStart(2, "0");
  const month = String(nextDate.getMonth() + 1).padStart(2, "0");
  const year = nextDate.getFullYear();

  return `${day}/${month}/${year}`;
}

export function getSignupTotals(membershipPlan, workoutPlan) {
  const monthlyFee =
    membershipPlan.monthlyEquivalent + workoutPlan.monthlyPrice;

  const totalFirstPayment =
    membershipPlan.upfrontPrice + workoutPlan.monthlyPrice;

  return {
    monthlyFee,
    totalFirstPayment,
    renewalDate: getRenewalDate(membershipPlan.renewalDays),
  };
}