export function getStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return getStartOfDay(next);
}

export function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function getMondayBasedDayIndex(date) {
  return (date.getDay() + 6) % 7;
}

export function getWeekStart(date) {
  return addDays(date, -getMondayBasedDayIndex(date));
}

export function buildWeekDays(weekStart) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function formatMonthTitle(date, locale = "en-GB") {
  return date
    .toLocaleDateString(locale, {
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

export function formatIsoDate(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}