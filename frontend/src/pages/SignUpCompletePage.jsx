import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import SignUpTimeline from "../components/signup/SignUpTimeline";
import { clubs } from "../data/clubsData";
import {
  formatEuro,
  getMembershipPlanById,
  getWorkoutPlanById,
  mapMembershipPlanFromApi,
  mapWorkoutPlanFromApi,
} from "../data/signupPlansData";
import { useMembershipPlans } from "../hooks/useMembership";
import { useWorkoutPlans } from "../hooks/useWorkoutPlans";

export default function SignUpCompletePage() {
  const [searchParams] = useSearchParams();

  const clubId = searchParams.get("clubId");
  const membershipId = searchParams.get("membership");
  const workoutId = searchParams.get("workout");
  const amount = Number(searchParams.get("amount") || 0);

  const club = clubs.find((item) => String(item.id) === String(clubId));

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
  const workoutPlan = getWorkoutPlanById(workoutId, workoutPlans);

  if (!club) {
    return <Navigate to="/clubs" replace />;
  }

  if (membershipsLoading || workoutPlansLoading) {
    return (
      <section className="signup-complete-page gm-dark-section-bg">
        <div className="gm-container signup-complete-page__container">
          <SignUpTimeline completedSteps={4} />

          <h1 className="signup-complete-page__title">
            Loading registration summary...
          </h1>
        </div>
      </section>
    );
  }

  if (membershipsError || workoutPlansError || !membershipPlan || !workoutPlan) {
    return <Navigate to="/clubs" replace />;
  }

  const registrationId = `349${club.id}6414${String(membershipPlan.id).length}`;
  const invoiceNumber = `74${club.id}${String(workoutPlan.id).length}67`;

  return (
    <section className="signup-complete-page gm-dark-section-bg">
      <div className="gm-container signup-complete-page__container">
        <SignUpTimeline completedSteps={4} />

        <h1 className="signup-complete-page__title">
          Your payment has been completed successfully!
        </h1>

        <div className="signup-complete-page__card gm-surface-card">
          <div className="signup-complete-page__rows">
            <div className="signup-complete-page__row">
              <span>Registration name:</span>
              <strong>{registrationId}</strong>
            </div>

            <div className="signup-complete-page__row">
              <span>Club:</span>
              <strong>{club.shortName}</strong>
            </div>

            <div className="signup-complete-page__row">
              <span>Membership:</span>
              <strong>{membershipPlan.summaryName}</strong>
            </div>

            <div className="signup-complete-page__row">
              <span>Workout plan:</span>
              <strong>{workoutPlan.summaryName}</strong>
            </div>

            <div className="signup-complete-page__row">
              <span>Organization ID:</span>
              <strong>AR-IMC013-LACNIC</strong>
            </div>

            <div className="signup-complete-page__row">
              <span>Invoice number:</span>
              <strong>{invoiceNumber}</strong>
            </div>

            <div className="signup-complete-page__row">
              <span>Amount:</span>
              <strong>{formatEuro(amount)}</strong>
            </div>
          </div>

          <div className="signup-complete-page__actions">
            <Link
              to="/"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow signup-complete-page__button"
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}