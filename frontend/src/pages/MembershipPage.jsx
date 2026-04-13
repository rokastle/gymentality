import { Link } from "react-router-dom";

const membershipPlans = [
  {
    id: "monthly",
    title: "MONTHLY PLAN",
    price: "39.99 €/Month",
    subtitleLines: ["No commitment.", "Total flexibility"],
    secondaryLines: ["Cancel anytime"],
    features: [
      "FREE daily-use locker",
      "Book up to 24 hours in advance",
      "Online Workouts",
      "Discounts with partner brands",
      "Automatic monthly renewal",
    ],
  },
  {
    id: "quarterly",
    title: "QUARTERLY PLAN",
    price: "104.97 €",
    subtitleLines: ["every 3 Month"],
    secondaryLines: ["34.99 €/Month", "Save 12%"],
    features: [
      "FREE daily-use locker",
      "Book up to 24 hours in advance",
      "Online Workouts",
      "Discounts with partner brands",
      "Automatic monthly renewal",
    ],
  },
  {
    id: "annual",
    title: "ANNUAL PLAN",
    price: "359.88 €",
    subtitleLines: ["per Year"],
    secondaryLines: ["29.99 €/Month", "Save 25%"],
    features: [
      "FREE daily-use locker",
      "Book up to 24 hours in advance",
      "Online Workouts",
      "Discounts with partner brands",
      "Automatic monthly renewal",
    ],
  },
];

export default function MembershipPage() {
  return (
    <section className="membership-page gm-dark-section-bg">
      <div className="gm-container membership-page__container">
        <h1 className="membership-page__title">MEMBERSHIP</h1>

        <div className="membership-page__grid">
          {membershipPlans.map((plan) => (
            <article key={plan.id} className="membership-card gm-surface-card">
              <h2 className="membership-card__title">{plan.title}</h2>

              <div className="membership-card__pricing">
                <p className="membership-card__price">{plan.price}</p>

                <div className="membership-card__subtitle">
                  {plan.subtitleLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                {plan.secondaryLines && (
                  <div className="membership-card__secondary">
                    {plan.secondaryLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="membership-card__divider gm-divider-accent" />

              <ul className="membership-card__features">
                {plan.features.map((feature) => (
                  <li key={feature} className="membership-card__feature">
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="membership-page__cta">
          <Link
            to="/clubs"
            className="gm-btn gm-btn--pill gm-btn--solid-yellow membership-page__button"
          >
            JOIN NOW
          </Link>
        </div>
      </div>
    </section>
  );
}