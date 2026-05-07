export default function WorkoutPlanMetricBar({
  metrics,
  variant = "basic",
  integral = false,
}) {
  const isPersonal = variant === "personal";
  const listClassName = isPersonal
    ? `my-workout-page__personal-metrics ${
        integral ? "my-workout-page__personal-metrics--integral" : ""
      }`
    : "my-workout-page__metrics";

  return (
    <div className={listClassName}>
      {metrics.map((metric, index) =>
        isPersonal ? (
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

            {index < metrics.length - 1 && (
              <div className="my-workout-page__personal-metric-divider" />
            )}
          </div>
        ) : (
          <div key={metric.id} className="my-workout-page__metric">
            <div className="my-workout-page__metric-main">
              <img
                src={metric.icon}
                alt=""
                className="my-workout-page__metric-icon"
              />
              <span>{metric.text}</span>
            </div>

            {index < metrics.length - 1 && (
              <div className="my-workout-page__metric-divider" />
            )}
          </div>
        )
      )}
    </div>
  );
}
