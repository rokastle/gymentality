import { getMondayBasedDayIndex, getStartOfDay, isSameDay } from "./calendarDateUtils";

export const WEEKDAY_IDS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const WEEKDAY_SHORT_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function formatSelectedDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

export function buildMonthWeeks(baseDate) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayNumber = new Date(year, month + 1, 0).getDate();
  const firstWeekdayIndex = getMondayBasedDayIndex(firstDayOfMonth);

  const cells = [];

  for (let i = 0; i < firstWeekdayIndex; i += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= lastDayNumber; day += 1) {
    cells.push(new Date(year, month, day));
  }

  const weeks = [];

  for (let i = 0; i < cells.length; i += 7) {
    const weekDays = cells.slice(i, i + 7);

    while (weekDays.length < 7) {
      weekDays.push(null);
    }

    const realDays = weekDays.filter(Boolean);
    const firstRealDay = realDays[0];
    const lastRealDay = realDays[realDays.length - 1];

    weeks.push({
      id: `week-${weeks.length + 1}`,
      label: `WEEK ${weeks.length + 1}`,
      range:
        firstRealDay && lastRealDay
          ? `${firstRealDay.getDate()} - ${lastRealDay.getDate()}`
          : "",
      days: weekDays,
    });
  }

  return weeks;
}

export function getScheduleForDate(date, planData) {
  const weekdayId = WEEKDAY_IDS[getMondayBasedDayIndex(date)];

  return planData.days.find((day) => day.id === weekdayId) ?? planData.days[0];
}

export function getInitialWeekIndex(monthWeeks, today) {
  const index = monthWeeks.findIndex((week) =>
    week.days.some((day) => day && isSameDay(day, today))
  );

  return index >= 0 ? index : 0;
}

export function getBestDateForWeek(week, today) {
  const realDays = week.days.filter(Boolean);
  const todayInWeek = realDays.find((day) => isSameDay(day, today));

  if (todayInWeek) {
    return getStartOfDay(todayInWeek);
  }

  return getStartOfDay(realDays[0] ?? today);
}
