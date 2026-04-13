import { Navigate } from "react-router-dom";
import { useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
    basicPlanData,
    personalPlanData,
    integralPlanData,
} from "../data/myWorkoutPlansData";

function normalizePlanName(value = "") {
    return value.toLowerCase().trim();
}

function getWorkoutPlanType(user) {
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

function WorkoutVideoCard({ exercise }) {
    return (
        <article className="my-workout-page__video-card">
            <div className="my-workout-page__video-frame">
                <video
                    className="my-workout-page__video"
                    src={exercise.video}
                    controls
                    preload="metadata"
                />
            </div>

            <h3 className="my-workout-page__video-title">{exercise.title}</h3>
            <p className="my-workout-page__video-meta">{exercise.meta}</p>
        </article>
    );
}

function NutritionMacroChart({ macros }) {
    const total = macros.reduce((sum, item) => sum + item.grams, 0);

    let currentPercentage = 0;
    const gradientStops = macros
        .map((item) => {
            const start = currentPercentage;
            const percentage = (item.grams / total) * 100;
            currentPercentage += percentage;
            return `${item.colorVar} ${start}% ${currentPercentage}%`;
        })
        .join(", ");

    return (
        <div className="my-workout-page__nutrition-chart-card">
            <h4 className="my-workout-page__nutrition-summary-title">
                DAILY SUMMARY
            </h4>

            <div
                className="my-workout-page__nutrition-chart"
                style={{ background: `conic-gradient(${gradientStops})` }}
            >
                <div className="my-workout-page__nutrition-chart-inner">
                    <strong>{total} g</strong>
                    <span>TOTAL</span>
                </div>
            </div>

            <div className="my-workout-page__nutrition-legend">
                {macros.map((item) => (
                    <div key={item.id} className="my-workout-page__nutrition-legend-item">
                        <span
                            className="my-workout-page__nutrition-legend-dot"
                            style={{ backgroundColor: item.colorVar }}
                        />
                        <span className="my-workout-page__nutrition-legend-label">
                            {item.label}
                        </span>
                        <strong className="my-workout-page__nutrition-legend-value">
                            {item.grams} g
                        </strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

function BasicWorkoutPlanView() {
    const [activeTabId, setActiveTabId] = useState(basicPlanData.tabs[0].id);

    const activeTab = useMemo(() => {
        return (
            basicPlanData.tabs.find((tab) => tab.id === activeTabId) ??
            basicPlanData.tabs[0]
        );
    }, [activeTabId]);

    return (
        <div className="my-workout-page__basic">
            <header className="my-workout-page__header">
                <h1 className="my-workout-page__title">{basicPlanData.title}</h1>
                <p className="my-workout-page__intro">{basicPlanData.description}</p>
            </header>

            <div className="my-workout-page__tabbar">
                {basicPlanData.tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`my-workout-page__tab ${tab.id === activeTab.id ? "is-active" : ""
                            }`}
                        onClick={() => setActiveTabId(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="my-workout-page__panel my-workout-page__panel--basic gm-surface-card">
                <div className="my-workout-page__routine-header">
                    <h2 className="my-workout-page__routine-title">
                        {activeTab.routineTitle}
                    </h2>
                    <p className="my-workout-page__routine-meta">{activeTab.routineMeta}</p>
                </div>

                <div className="my-workout-page__metrics">
                    {basicPlanData.metrics.map((metric, index) => (
                        <div key={metric.id} className="my-workout-page__metric">
                            <div className="my-workout-page__metric-main">
                                <img
                                    src={metric.icon}
                                    alt=""
                                    className="my-workout-page__metric-icon"
                                />
                                <span>{metric.text}</span>
                            </div>

                            {index < basicPlanData.metrics.length - 1 && (
                                <div className="my-workout-page__metric-divider" />
                            )}
                        </div>
                    ))}
                </div>

                <h3 className="my-workout-page__section-heading gm-section-heading-lined">
                    {activeTab.sectionTitle}
                </h3>

                <div className="my-workout-page__videos-grid">
                    {activeTab.exercises.map((exercise) => (
                        <WorkoutVideoCard key={exercise.id} exercise={exercise} />
                    ))}
                </div>
            </div>
        </div>
    );
}

const WEEKDAY_IDS = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
];

const WEEKDAY_SHORT_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function getStartOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(dateA, dateB) {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate()
    );
}

function getMondayBasedDayIndex(date) {
    return (date.getDay() + 6) % 7;
}

function formatMonthTitle(date) {
    return date.toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    }).toUpperCase();
}

function formatSelectedDate(date) {
    return date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
    });
}

function buildMonthWeeks(baseDate) {
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

function getScheduleForDate(date) {
    const weekdayId = WEEKDAY_IDS[getMondayBasedDayIndex(date)];

    return (
        personalPlanData.days.find((day) => day.id === weekdayId) ??
        personalPlanData.days[0]
    );
}

function PersonalWorkoutPlanView() {
    const today = getStartOfDay(new Date());
    const monthWeeks = useMemo(() => buildMonthWeeks(today), [today]);

    const initialWeekIndex = monthWeeks.findIndex((week) =>
        week.days.some((day) => day && isSameDay(day, today))
    );

    const [activeWeekIndex, setActiveWeekIndex] = useState(
        initialWeekIndex >= 0 ? initialWeekIndex : 0
    );
    const [selectedDate, setSelectedDate] = useState(today);

    const activeWeek = monthWeeks[activeWeekIndex] ?? monthWeeks[0];
    const activeDay = getScheduleForDate(selectedDate);

    return (
        <div className="my-workout-page__personal">
            <header className="my-workout-page__header">
                <h1 className="my-workout-page__title">{personalPlanData.title}</h1>
                <p className="my-workout-page__intro">{personalPlanData.description}</p>
            </header>

            <div className="my-workout-page__week-tabs">
                {monthWeeks.map((week, index) => (
                    <button
                        key={week.id}
                        type="button"
                        className={`my-workout-page__week-tab ${index === activeWeekIndex ? "is-active" : ""
                            }`}
                        onClick={() => setActiveWeekIndex(index)}
                    >
                        <span>{week.label}</span>
                        <small>{week.range}</small>
                    </button>
                ))}
            </div>

            <div className="my-workout-page__panel my-workout-page__panel--personal gm-surface-card">
                <div className="my-workout-page__personal-header">
                    <h2 className="my-workout-page__personal-week">
                        {monthWeeks[activeWeekIndex]?.label} · {formatSelectedDate(selectedDate)}
                    </h2>
                    <p className="my-workout-page__personal-day-title">{activeDay.title}</p>
                </div>

                <div className="my-workout-page__personal-metrics">
                    {personalPlanData.metrics.map((metric, index) => (
                        <div key={metric.id} className="my-workout-page__personal-metric">
                            <div className="my-workout-page__personal-metric-main">
                                {metric.icon ? (
                                    <>
                                        <img
                                            src={metric.icon}
                                            alt=""
                                            className="my-workout-page__personal-metric-icon"
                                        />
                                        <span className="my-workout-page__personal-metric-value">
                                            {metric.label}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="my-workout-page__personal-metric-label">
                                            {metric.label}
                                        </span>
                                        <span className="my-workout-page__personal-metric-value">
                                            {metric.value}
                                        </span>
                                    </>
                                )}
                            </div>

                            {index < personalPlanData.metrics.length - 1 && (
                                <div className="my-workout-page__personal-metric-divider" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="my-workout-page__calendar-card">
                    <div className="my-workout-page__calendar-title">
                        {formatMonthTitle(today)}
                    </div>

                    <div className="my-workout-page__calendar-days">
                        {activeWeek.days.map((day, index) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="my-workout-page__calendar-day my-workout-page__calendar-day--empty"
                                    />
                                );
                            }

                            const dayStart = getStartOfDay(day);
                            const isSelected = isSameDay(dayStart, selectedDate);
                            const isToday = isSameDay(dayStart, today);
                            const isCompleted = dayStart < today;
                            const isFuture = dayStart > today;

                            return (
                                <button
                                    key={day.toISOString()}
                                    type="button"
                                    className={`my-workout-page__calendar-day ${isCompleted ? "is-completed" : ""
                                        } ${isToday ? "is-today" : ""} ${isFuture ? "is-future" : ""
                                        } ${isSelected ? "is-selected" : ""}`}
                                    onClick={() => setSelectedDate(dayStart)}
                                >
                                    <span className="my-workout-page__calendar-weekday">
                                        {WEEKDAY_SHORT_LABELS[index]}
                                    </span>
                                    <span className="my-workout-page__calendar-number">
                                        {day.getDate()}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

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

                <div className="my-workout-page__download">
                    <button
                        type="button"
                        className="gm-btn gm-btn--pill gm-btn--outline-yellow"
                    >
                        DOWNLOAD WORKOUT PLAN PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

function IntegralWorkoutPlanView() {
    const today = getStartOfDay(new Date());
    const monthWeeks = useMemo(() => buildMonthWeeks(today), [today]);

    const initialWeekIndex = monthWeeks.findIndex((week) =>
        week.days.some((day) => day && isSameDay(day, today))
    );

    const [activeWeekIndex, setActiveWeekIndex] = useState(
        initialWeekIndex >= 0 ? initialWeekIndex : 0
    );
    const [selectedDate, setSelectedDate] = useState(today);

    const activeWeek = monthWeeks[activeWeekIndex] ?? monthWeeks[0];
    const activeDay = getScheduleForDate(selectedDate);

    return (
        <div className="my-workout-page__personal">
            <header className="my-workout-page__header">
                <h1 className="my-workout-page__title">{integralPlanData.title}</h1>
                <p className="my-workout-page__intro">{integralPlanData.description}</p>
            </header>

            <div className="my-workout-page__week-tabs">
                {monthWeeks.map((week, index) => (
                    <button
                        key={week.id}
                        type="button"
                        className={`my-workout-page__week-tab ${index === activeWeekIndex ? "is-active" : ""
                            }`}
                        onClick={() => setActiveWeekIndex(index)}
                    >
                        <span>{week.label}</span>
                        <small>{week.range}</small>
                    </button>
                ))}
            </div>

            <div className="my-workout-page__panel my-workout-page__panel--personal gm-surface-card">
                <div className="my-workout-page__personal-header">
                    <h2 className="my-workout-page__personal-week">
                        {monthWeeks[activeWeekIndex]?.label} · {formatSelectedDate(selectedDate)}
                    </h2>
                    <p className="my-workout-page__personal-day-title">{activeDay.title}</p>
                </div>

                <div className="my-workout-page__personal-metrics my-workout-page__personal-metrics--integral">
                    {integralPlanData.metrics.map((metric, index) => (
                        <div key={metric.id} className="my-workout-page__personal-metric">
                            <div className="my-workout-page__personal-metric-main">
                                {metric.icon ? (
                                    <>
                                        <img
                                            src={metric.icon}
                                            alt=""
                                            className="my-workout-page__personal-metric-icon"
                                        />
                                        <span className="my-workout-page__personal-metric-value">
                                            {metric.label}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="my-workout-page__personal-metric-label">
                                            {metric.label}
                                        </span>
                                        <span className="my-workout-page__personal-metric-value">
                                            {metric.value}
                                        </span>
                                    </>
                                )}
                            </div>

                            {index < integralPlanData.metrics.length - 1 && (
                                <div className="my-workout-page__personal-metric-divider" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="my-workout-page__calendar-card">
                    <div className="my-workout-page__calendar-title">
                        {formatMonthTitle(today)}
                    </div>

                    <div className="my-workout-page__calendar-days">
                        {activeWeek.days.map((day, index) => {
                            if (!day) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="my-workout-page__calendar-day my-workout-page__calendar-day--empty"
                                    />
                                );
                            }

                            const dayStart = getStartOfDay(day);
                            const isSelected = isSameDay(dayStart, selectedDate);
                            const isToday = isSameDay(dayStart, today);
                            const isCompleted = dayStart < today;
                            const isFuture = dayStart > today;

                            return (
                                <button
                                    key={day.toISOString()}
                                    type="button"
                                    className={`my-workout-page__calendar-day ${isCompleted ? "is-completed" : ""
                                        } ${isToday ? "is-today" : ""} ${isFuture ? "is-future" : ""
                                        } ${isSelected ? "is-selected" : ""}`}
                                    onClick={() => setSelectedDate(dayStart)}
                                >
                                    <span className="my-workout-page__calendar-weekday">
                                        {WEEKDAY_SHORT_LABELS[index]}
                                    </span>
                                    <span className="my-workout-page__calendar-number">
                                        {day.getDate()}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

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

                <section className="my-workout-page__nutrition-section">
                    <h3 className="my-workout-page__section-heading my-workout-page__section-heading--personal gm-section-heading-lined">
                        {integralPlanData.nutrition.title}
                    </h3>

                    <div className="my-workout-page__nutrition-layout">
                        <div className="my-workout-page__nutrition-meals">
                            {integralPlanData.nutrition.meals.map((meal) => (
                                <article
                                    key={meal.id}
                                    className="my-workout-page__nutrition-meal-card"
                                >
                                    <div className="my-workout-page__nutrition-meal-image-wrapper">
                                        <img
                                            src={meal.image}
                                            alt={meal.title}
                                            className="my-workout-page__nutrition-meal-image"
                                        />
                                    </div>

                                    <h4 className="my-workout-page__nutrition-meal-title">
                                        {meal.title}
                                    </h4>
                                    <p className="my-workout-page__nutrition-meal-description">
                                        {meal.description}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <NutritionMacroChart macros={integralPlanData.nutrition.macros} />
                    </div>
                </section>

                <div className="my-workout-page__download">
                    <button
                        type="button"
                        className="gm-btn gm-btn--pill gm-btn--outline-yellow"
                    >
                        DOWNLOAD FULL PLAN PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MyWorkoutPlanPage() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return <Navigate to="/" replace />;
    }

    const workoutPlanType = getWorkoutPlanType(user);

    if (!workoutPlanType) {
        return (
            <section className="my-workout-page gm-dark-section-bg">
                <div className="gm-container my-workout-page__container">
                    <div className="my-workout-page__panel gm-surface-card">
                        <h1 className="my-workout-page__title">MY WORKOUT PLAN</h1>
                        <p className="my-workout-page__text">
                            No workout plan assigned to this user.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="my-workout-page gm-dark-section-bg">
            <div className="gm-container my-workout-page__container">
                {workoutPlanType === "basic" && <BasicWorkoutPlanView />}

                {workoutPlanType === "personal" && <PersonalWorkoutPlanView />}

                {workoutPlanType === "integral" && <IntegralWorkoutPlanView />}
            </div>
        </section>
    );
}