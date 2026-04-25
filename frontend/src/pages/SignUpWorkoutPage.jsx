import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import SignUpTimeline from "../components/signup/SignUpTimeline";
import { useClubById } from "../hooks/useClubs";
import {
  getMembershipPlanById,
  mapMembershipPlanFromApi,
  mapWorkoutPlanFromApi,
} from "../data/signupPlansData";
import { useMembershipPlans } from "../hooks/useMembership";
import { useWorkoutPlans } from "../hooks/useWorkoutPlans";

export default function SignUpWorkoutPage() {
  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");
  const membershipId = searchParams.get("membership");

  const {
    club,
    loading: clubLoading,
    error: clubError,
  } = useClubById(clubId);

  const {
    plans: membershipApiPlans,
    loading: membershipsLoading,
    error: membershipsError,
  } = useMembershipPlans();

  const {
    plans: workoutApiPlans,
    loading: workoutPlansLoading,
    error: workoutPlansError,
  } = useWorkoutPlans();

  const membershipPlans = useMemo(
    () => membershipApiPlans.map(mapMembershipPlanFromApi),
    [membershipApiPlans]
  );

  const workoutPlans = useMemo(
    () => workoutApiPlans.map(mapWorkoutPlanFromApi),
    [workoutApiPlans]
  );

  const membershipPlan = getMembershipPlanById(membershipId, membershipPlans);

  if (!clubId) {
    return <Navigate to="/clubs" replace />;
  }

  if (clubLoading || membershipsLoading || workoutPlansLoading) {
    return (
      <section className="signup-selection-page gm-dark-section-bg">
        <div className="gm-container signup-selection-page__container">
          <SignUpTimeline completedSteps={2} />
          <h1 className="signup-selection-page__title">WORKOUT</h1>
          <p className="text-center text-white">Loading workout plans...</p>
        </div>
      </section>
    );
  }

  if (clubError || membershipsError || workoutPlansError || !club || !membershipPlan) {
    return <Navigate to="/clubs" replace />;
  }

  return (
    <section className="signup-selection-page gm-dark-section-bg">
      <div className="gm-container signup-selection-page__container">
        <SignUpTimeline completedSteps={2} />

        <h1 className="signup-selection-page__title">WORKOUT</h1>

        <div className="signup-selection-page__grid">
          {workoutPlans.map((plan) => (
            <article
              key={plan.id}
              className="signup-plan-card signup-plan-card--workout gm-surface-card"
            >
              <h2 className="signup-plan-card__title">{plan.title}</h2>

              <div className="signup-plan-card__pricing">
                <p className="signup-plan-card__price">{plan.priceText}</p>

                <div className="signup-plan-card__description">
                  {plan.descriptionLines.map((line, index) => (
                    <p key={`${plan.id}-${index}`}>{line || "\u00A0"}</p>
                  ))}
                </div>

                <p className="signup-plan-card__includes-label">
                  {plan.includesLabel}
                </p>
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
                  to={`/signup/details?clubId=${club.id}&membership=${membershipPlan.id}&workout=${plan.id}`}
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