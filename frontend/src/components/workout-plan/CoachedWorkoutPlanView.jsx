import { useMemo, useState } from "react";
import {
  buildMonthWeeks,
  formatSelectedDate,
  getBestDateForWeek,
  getInitialWeekIndex,
  getScheduleForDate,
} from "../../utils/workoutCalendarUtils";
import { getStartOfDay } from "../../utils/calendarDateUtils";
import NutritionMealCard from "./NutritionMealCard";
import NutritionSummaryChart from "./NutritionSummaryChart";
import WorkoutCalendarPanel from "./WorkoutCalendarPanel";
import WorkoutPlanHeader from "./WorkoutPlanHeader";
import WorkoutPlanMetricBar from "./WorkoutPlanMetricBar";
import WorkoutVideoCard from "./WorkoutVideoCard";
import WorkoutWeekTabs from "./WorkoutWeekTabs";

export default function CoachedWorkoutPlanView({
  planData,
  includesNutrition = false,
}) {
  const today = useMemo(() => getStartOfDay(new Date()), []);
  const monthWeeks = useMemo(() => buildMonthWeeks(today), [today]);

  const [activeWeekIndex, setActiveWeekIndex] = useState(() =>
    getInitialWeekIndex(monthWeeks, today)
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const activeDay = getScheduleForDate(selectedDate, planData);

  const handleSelectWeek = (index) => {
    const selectedWeek = monthWeeks[index] ?? monthWeeks[0];

    setActiveWeekIndex(index);
    setSelectedDate(getBestDateForWeek(selectedWeek, today));
  };

  return (
    <div className="my-workout-page__personal">
      <WorkoutPlanHeader
        title={planData.title}
        description={planData.description}
      />

      <WorkoutWeekTabs
        monthWeeks={monthWeeks}
        activeWeekIndex={activeWeekIndex}
        onSelectWeek={handleSelectWeek}
      />

      <div className="my-workout-page__panel my-workout-page__panel--personal gm-surface-card">
        <WorkoutCalendarPanel
          monthWeeks={monthWeeks}
          activeWeekIndex={activeWeekIndex}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <div className="my-workout-page__personal-header">
          <h2 className="my-workout-page__personal-week">
            {monthWeeks[activeWeekIndex]?.label} -{" "}
            {formatSelectedDate(selectedDate)}
          </h2>
          <p className="my-workout-page__personal-day-title">
            {activeDay.title}
          </p>
        </div>

        <WorkoutPlanMetricBar
          metrics={planData.metrics}
          variant="personal"
          integral={includesNutrition}
        />

        {activeDay.sections.map((section) => (
          <section key={section.title} className="my-workout-page__day-section">
            <h3 className="my-workout-page__section-heading my-workout-page__section-heading--personal gm-section-heading-lined">
              {section.title}
            </h3>

            <div className="my-workout-page__videos-grid my-workout-page__videos-grid--personal">
              {section.exercises.map((exercise) => (
                <WorkoutVideoCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>
        ))}

        {includesNutrition && planData.nutrition && (
          <section className="my-workout-page__nutrition-section">
            <h3 className="my-workout-page__section-heading my-workout-page__section-heading--personal gm-section-heading-lined">
              {planData.nutrition.title}
            </h3>

            <div className="my-workout-page__nutrition-layout">
              <div className="my-workout-page__nutrition-meals">
                {planData.nutrition.meals.map((meal) => (
                  <NutritionMealCard key={meal.id} meal={meal} />
                ))}
              </div>

              <NutritionSummaryChart macros={planData.nutrition.macros} />
            </div>
          </section>
        )}

        <div className="my-workout-page__download">
          <button
            type="button"
            className="gm-btn gm-btn--pill gm-btn--outline-yellow"
          >
            {includesNutrition ? "DOWNLOAD FULL PLAN PDF" : "DOWNLOAD WORKOUT PLAN PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
