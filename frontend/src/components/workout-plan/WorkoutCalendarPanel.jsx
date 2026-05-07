import WeeklyCalendar from "../common/WeeklyCalendar";
import IconImage from "../common/IconImage";
import {
  formatMonthTitle,
  getStartOfDay,
  isSameDay,
} from "../../utils/calendarDateUtils";
import { WEEKDAY_SHORT_LABELS } from "../../utils/workoutCalendarUtils";

function getWorkoutCalendarDayStateClassName({ day }) {
  const today = getStartOfDay(new Date());
  const dayStart = getStartOfDay(day);

  if (dayStart < today) {
    return "is-completed";
  }

  if (isSameDay(dayStart, today)) {
    return "is-today";
  }

  if (dayStart > today) {
    return "is-future";
  }

  return "";
}

function renderWorkoutCalendarDayExtra({ day }) {
  const today = getStartOfDay(new Date());
  const dayStart = getStartOfDay(day);

  if (dayStart < today) {
    return (
      <IconImage
        name="check"
        decorative
        className="my-workout-page__calendar-check"
      />
    );
  }

  return null;
}

export default function WorkoutCalendarPanel({
  monthWeeks,
  activeWeekIndex,
  selectedDate,
  onSelectDate,
}) {
  const today = getStartOfDay(new Date());
  const activeWeek = monthWeeks[activeWeekIndex] ?? monthWeeks[0];

  return (
    <div className="my-workout-page__calendar-wrapper">
      <WeeklyCalendar
        monthTitle={formatMonthTitle(today)}
        days={activeWeek.days}
        selectedDate={selectedDate}
        onSelectDate={(day) => {
          if (day) {
            onSelectDate(getStartOfDay(day));
          }
        }}
        getDayStateClassName={getWorkoutCalendarDayStateClassName}
        renderDayExtra={renderWorkoutCalendarDayExtra}
        weekdayLabels={WEEKDAY_SHORT_LABELS}
      />
    </div>
  );
}
