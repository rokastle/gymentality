export default function NutritionSummaryChart({ macros }) {
  const total = macros.reduce((sum, item) => sum + item.grams, 0);

  const gradientStops = macros
    .reduce(
      (result, item) => {
        const start = result.currentPercentage;
        const percentage = (item.grams / total) * 100;
        const end = start + percentage;

        return {
          currentPercentage: end,
          stops: [...result.stops, `${item.colorVar} ${start}% ${end}%`],
        };
      },
      { currentPercentage: 0, stops: [] }
    )
    .stops.join(", ");

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
