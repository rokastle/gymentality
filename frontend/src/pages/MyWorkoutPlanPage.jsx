import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import BasicWorkoutPlanView from "../components/workout-plan/BasicWorkoutPlanView";
import IntegralWorkoutPlanView from "../components/workout-plan/IntegralWorkoutPlanView";
import PersonalWorkoutPlanView from "../components/workout-plan/PersonalWorkoutPlanView";
import { getWorkoutPlanType } from "../utils/workoutPlanUtils";

export default function MyWorkoutPlanPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const workoutPlanType = getWorkoutPlanType(user);

  if (!workoutPlanType) {
    return (
      <section className="my-workout-page gm-dark-section-bg">
        <div className="gm-container my-workout-page__container">
          <div className="my-workout-page__panel gm-surface-card">
            <h1 className="my-workout-page__title">MY WORKOUT PLAN</h1>
            <p className="my-workout-page__text">
              No workout plan assigned to this user.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-workout-page gm-dark-section-bg">
      <div className="gm-container my-workout-page__container">
        {workoutPlanType === "basic" && <BasicWorkoutPlanView />}
        {workoutPlanType === "personal" && <PersonalWorkoutPlanView />}
        {workoutPlanType === "integral" && <IntegralWorkoutPlanView />}
      </div>
    </section>
  );
}
