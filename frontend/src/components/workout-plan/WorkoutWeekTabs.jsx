export default function WorkoutWeekTabs({
  monthWeeks,
  activeWeekIndex,
  onSelectWeek,
}) {
  return (
    <div className="my-workout-page__week-tabs">
      {monthWeeks.map((week, index) => (
        <button
          key={week.id}
          type="button"
          className={`my-workout-page__week-tab ${
            index === activeWeekIndex ? "is-active" : ""
          }`}
          onClick={() => onSelectWeek(index)}
        >
          <span>{week.label}</span>
          <small>{week.range}</small>
        </button>
      ))}
    </div>
  );
}
