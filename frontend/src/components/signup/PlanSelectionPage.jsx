import { Link, Navigate, useSearchParams } from "react-router-dom";
import SignUpTimeline from "./SignUpTimeline";
import { clubs } from "../../data/clubsData";

/**
 * Componente genérico para páginas de selección de planes en el flujo de signup
 * @param {number} completedSteps - Pasos completados en el timeline
 * @param {string} title - Título de la página (ej: "MEMBERSHIP", "WORKOUT")
 * @param {Array} plans - Array de planes a mostrar
 * @param {Function} getNextUrl - Función que retorna la URL del siguiente paso (plan, clubId) => string
 * @param {string} cardModifier - Modificador CSS para el card (ej: "membership", "workout")
 * @param {string} planIdField - Campo del ID en cada plan (default: "id")
 * @param {boolean} requireMembership - Si es true, requiere que membershipId esté en los query params
 */
export default function PlanSelectionPage({
  completedSteps,
  title,
  plans,
  getNextUrl,
  cardModifier = "default",
  planIdField = "id",
  requireMembership = false,
}) {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const membershipId = searchParams.get("membership");

  const club = clubs.find((item) => String(item.id) === String(clubId));

  // Validar que existe el club
  if (!club) {
    return <Navigate to="/clubs" replace />;
  }

  // Validar que existe membership si es requerido (para SignUpWorkoutPage)
  if (requireMembership && !membershipId) {
    return <Navigate to="/clubs" replace />;
  }

  return (
    <section className="signup-selection-page gm-dark-section-bg">
      <div className="gm-container signup-selection-page__container">
        <SignUpTimeline completedSteps={completedSteps} />

        <h1 className="signup-selection-page__title">{title}</h1>

        <div className="signup-selection-page__grid">
          {plans.map((plan) => (
            <article
              key={plan[planIdField]}
              className={`signup-plan-card signup-plan-card--${cardModifier} gm-surface-card`}
            >
              <h2 className="signup-plan-card__title">{plan.title}</h2>

              <div className="signup-plan-card__pricing">
                <p className="signup-plan-card__price">{plan.priceText}</p>

                {plan.subtitleLines && (
                  <div className="signup-plan-card__subtitle">
                    {plan.subtitleLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}

                {plan.descriptionLines && (
                  <div className="signup-plan-card__description">
                    {plan.descriptionLines.map((line, index) => (
                      <p key={`${plan.id}-${index}`}>{line || "\u00A0"}</p>
                    ))}
                  </div>
                )}

                {plan.includesLabel && (
                  <p className="signup-plan-card__includes-label">
                    {plan.includesLabel}
                  </p>
                )}

                {plan.secondaryLines?.length > 0 && (
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
                  to={getNextUrl(plan, clubId)}
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