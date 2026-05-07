export default function NutritionMealCard({ meal }) {
  return (
    <article className="my-workout-page__nutrition-meal-card">
      <div className="my-workout-page__nutrition-meal-image-wrapper">
        <img
          src={meal.image}
          alt={meal.title}
          className="my-workout-page__nutrition-meal-image"
        />
      </div>

      <h4 className="my-workout-page__nutrition-meal-title">{meal.title}</h4>
      <p className="my-workout-page__nutrition-meal-description">
        {meal.description}
      </p>
    </article>
  );
}
