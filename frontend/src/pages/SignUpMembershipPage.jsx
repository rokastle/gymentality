import { Link, Navigate, useSearchParams } from "react-router-dom";
import SignUpTimeline from "../components/signup/SignUpTimeline";
import { clubs } from "../data/clubsData";
import { membershipSignUpPlans } from "../data/signupPlansData";

export default function SignUpMembershipPage() {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  const club = clubs.find((item) => String(item.id) === String(clubId));

  if (!club) {
    return <Navigate to="/clubs" replace />;
  }

  return (
    <section className="signup-selection-page gm-dark-section-bg">
      <div className="gm-container signup-selection-page__container">
        <SignUpTimeline completedSteps={1} />

        <h1 className="signup-selection-page__title">MEMBERSHIP</h1>

        <div className="signup-selection-page__grid">
          {membershipSignUpPlans.map((plan) => (
            <article
              key={plan.id}
              className="signup-plan-card signup-plan-card--membership gm-surface-card"
            >
              <h2 className="signup-plan-card__title">{plan.title}</h2>

              <div className="signup-plan-card__pricing">
                <p className="signup-plan-card__price">{plan.priceText}</p>

                <div className="signup-plan-card__subtitle">
                  {plan.subtitleLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>

                {!!plan.secondaryLines.length && (
                  <div className="signup-plan-card__secondary">
                    {plan.secondaryLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="signup-plan-card__divider gm-divider-accent" />

              <ul className="signup-plan-card__features">
                {plan.features.map((feature) => (
                  <li key={feature} className="signup-plan-card__feature">
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="signup-plan-card__footer">
                <Link
                  to={`/signup/workout?clubId=${club.id}&membership=${plan.id}`}
                  className="gm-btn gm-btn--pill gm-btn--solid-yellow signup-plan-card__button"
                >
                  SELECT
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}