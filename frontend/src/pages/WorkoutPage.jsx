import { Link } from "react-router-dom";

const workoutPlans = [
  {
    id: "basic",
    title: "BASIC PLAN",
    price: "FREE",
    descriptionLines: [
      "Perfect for experienced or",
      "self-motivated members.",
    ],
    includesLabel: "What's included:",
    features: [
      "Access to all training areas during opening hours.",
      "Use of cardio, strength, and functional equipment.",
      "Freedom to follow your own routine at your own pace.",
    ],
  },
  {
    id: "personal",
    title: "PERSONAL PLAN",
    price: "30 €/ Month",
    descriptionLines: [
      "Work one-on-one with",
      "a certified personal trainer",
    ],
    includesLabel: "What's included:",
    features: [
      "Personalized training program tailored to your goals.",
      "One-on-one coaching sessions.",
      "Technique correction and injury-prevention guidance.",
      "Weekly progress check-ins and program adjustments.",
    ],
  },
  {
    id: "integral",
    title: "INTEGRAL PLAN",
    price: "50 €/ Month",
    descriptionLines: [
      "Best choice for members who want",
      "results with full professional support.",
    ],
    includesLabel: "What's included:",
    features: [
      "Customized nutrition advice based on your goals.",
      "Meal guidance and healthy habit strategies.",
      "Ongoing trainer + nutrition follow-ups.",
      "Adjustments based on progress and lifestyle.",
    ],
  },
];

export default function WorkoutPage() {
  return (
    <section className="workout-page gm-dark-section-bg">
      <div className="gm-container workout-page__container">
        <h1 className="workout-page__title">WORKOUT</h1>

        <div className="workout-page__grid">
          {workoutPlans.map((plan) => (
            <article key={plan.id} className="workout-card gm-surface-card">
              <h2 className="workout-card__title">{plan.title}</h2>

              <div className="workout-card__pricing">
                <p className="workout-card__price">{plan.price}</p>

                <div className="workout-card__description">
                  {plan.descriptionLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                <p className="workout-card__includes-label">
                  {plan.includesLabel}
                </p>
              </div>

              <div className="workout-card__divider gm-divider-accent" />

              <ul className="workout-card__features">
                {plan.features.map((feature) => (
                  <li key={feature} className="workout-card__feature">
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="workout-page__cta">
          <Link
            to="/clubs"
            className="gm-btn gm-btn--pill gm-btn--solid-yellow workout-page__button"
          >
            JOIN NOW
          </Link>
        </div>
      </div>
    </section>
  );
}