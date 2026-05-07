import { buildWeekDays } from "./calendarDateUtils";

export const BOOK_CLASS_WEEKDAY_LABELS = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

const CATEGORY_LABELS = {
  AQUA: "Aqua",
  BODY_AND_MIND: "Body & Mind",
  CARDIO: "Cardio",
  DANCE: "Dance",
  EXPRESS: "Express",
  FUNCTIONAL: "Functional",
  STRENGTH: "Strength",
};

export function formatPrettyTime(timeText = "00:00") {
  return timeText.slice(0, 5);
}

export function addOneHour(timeText = "00:00") {
  const [hour, minute] = timeText.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setHours(date.getHours() + 1);

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatBookingOpensAt(bookingOpensAt) {
  const date = new Date(bookingOpensAt);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getCardMeta(item) {
  const categoryLabel = CATEGORY_LABELS[item.category] || item.category;
  return `${categoryLabel} (1 hour)`;
}

export function isSelectableDate(date, today, maxSelectableDate) {
  return date >= today && date <= maxSelectableDate;
}

export function weekHasSelectableDates(weekStart, today, maxSelectableDate) {
  return buildWeekDays(weekStart).some((day) =>
    isSelectableDate(day, today, maxSelectableDate)
  );
}

export function getFirstSelectableDayInWeek(
  weekStart,
  today,
  maxSelectableDate
) {
  return buildWeekDays(weekStart).find((day) =>
    isSelectableDate(day, today, maxSelectableDate)
  );
}

export function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data || fallback;
}
