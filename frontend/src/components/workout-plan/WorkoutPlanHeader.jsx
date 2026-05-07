export default function WorkoutPlanHeader({ title, description }) {
  return (
    <header className="my-workout-page__header">
      <h1 className="my-workout-page__title">{title}</h1>
      <p className="my-workout-page__intro">{description}</p>
    </header>
  );
}
