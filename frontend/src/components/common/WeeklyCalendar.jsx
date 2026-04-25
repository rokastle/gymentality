import { isSameDay as defaultIsSameDay } from "../../utils/calendarDateUtils";
import "../../styles/components/weekly-calendar.css";

const DEFAULT_WEEKDAY_LABELS = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

function buildClassName(parts) {
  return parts.filter(Boolean).join(" ");
}

export default function WeeklyCalendar({
  monthTitle,
  days = [],
  selectedDate,
  onSelectDate,
  isDayDisabled,
  getDayStateClassName,
  renderDayExtra,
  showPreviousArrow = false,
  showNextArrow = false,
  onPrevious,
  onNext,
  previousAriaLabel = "Previous week",
  nextAriaLabel = "Next week",
  previousIcon,
  nextIcon,
  weekdayLabels = DEFAULT_WEEKDAY_LABELS,
  isSameDay = defaultIsSameDay,
  className = "",
}) {
  return (
    <div className={buildClassName(["weekly-calendar", className])}>
      <div className="weekly-calendar__month-title">{monthTitle}</div>

      <div className="weekly-calendar__body">
        {showPreviousArrow ? (
          <button
            type="button"
            className="weekly-calendar__nav"
            onClick={onPrevious}
            aria-label={previousAriaLabel}
          >
            {previousIcon ? (
              <img
                src={previousIcon}
                alt=""
                className="weekly-calendar__nav-icon weekly-calendar__nav-icon--left"
              />
            ) : (
              <span className="weekly-calendar__nav-fallback">‹</span>
            )}
          </button>
        ) : (
          <div
            className="weekly-calendar__nav weekly-calendar__nav--placeholder"
            aria-hidden="true"
          />
        )}

        <div className="weekly-calendar__days">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="weekly-calendar__day weekly-calendar__day--empty"
                  aria-hidden="true"
                />
              );
            }

            const disabled = isDayDisabled ? isDayDisabled(day) : false;
            const selected =
              selectedDate && day ? isSameDay(day, selectedDate) : false;

            const extraStateClassName = getDayStateClassName
              ? getDayStateClassName({
                  day,
                  index,
                  selected,
                  disabled,
                })
              : "";

            const dayExtra = renderDayExtra
              ? renderDayExtra({
                  day,
                  index,
                  selected,
                  disabled,
                })
              : null;

            return (
              <button
                key={day.toISOString()}
                type="button"
                className={buildClassName([
                  "weekly-calendar__day",
                  selected && "is-selected",
                  disabled && "is-disabled",
                  extraStateClassName,
                ])}
                onClick={() => onSelectDate?.(day)}
                disabled={disabled}
              >
                <span className="weekly-calendar__weekday">
                  {weekdayLabels[index] ?? ""}
                </span>

                <span className="weekly-calendar__number-wrap">
                  <span className="weekly-calendar__number">
                    {day.getDate()}
                  </span>

                  {dayExtra ? (
                    <span className="weekly-calendar__extra">{dayExtra}</span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        {showNextArrow ? (
          <button
            type="button"
            className="weekly-calendar__nav"
            onClick={onNext}
            aria-label={nextAriaLabel}
          >
            {nextIcon ? (
              <img
                src={nextIcon}
                alt=""
                className="weekly-calendar__nav-icon"
              />
            ) : (
              <span className="weekly-calendar__nav-fallback">›</span>
            )}
          </button>
        ) : (
          <div
            className="weekly-calendar__nav weekly-calendar__nav--placeholder"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}