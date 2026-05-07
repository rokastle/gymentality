import { useMemo } from "react";
import useAuth from "../hooks/useAuth";
import { useWorkoutPlans } from "../hooks/useWorkoutPlans";
import PlanChangePage from "../components/signup/PlanChangePage";
import { mapWorkoutPlanFromApi } from "../data/signupPlansData";
import {
  getWorkoutKeyword,
  isCurrentPlanByKeyword,
} from "../utils/planChangeUtils";

export default function ChangeMyWorkoutPlanPage() {
  const { user } = useAuth();
  const { plans, loading, error } = useWorkoutPlans();

  const workoutPlans = useMemo(
    () => plans.map(mapWorkoutPlanFromApi),
    [plans]
  );

  return (
    <PlanChangePage
      cardVariant="workout"
      confirmApplyText="This change will be scheduled and applied at the start of your next monthly training cycle."
      confirmTitle="Change workout plan?"
      currentPlanName={user?.workoutPlanName}
      error={error}
      errorText="No se pudieron cargar los planes de entrenamiento."
      isCurrentPlan={(plan, currentPlanName) =>
        isCurrentPlanByKeyword(plan, currentPlanName, getWorkoutKeyword)
      }
      loading={loading}
      loadingText="Loading workout plans..."
      pageTitle="CHANGE MY WORKOUT PLAN"
      plans={workoutPlans}
      renderPricing={renderWorkoutPricing}
      scheduledApplyText="will be applied at the start of your next monthly training cycle."
      storageKeyPrefix="gm_pending_workout_change"
      targetLabel="workout plan"
    />
  );
}

function renderWorkoutPricing(plan) {
  return (
    <div className="signup-plan-card__pricing">
      <p className="signup-plan-card__price">{plan.priceText}</p>

      <div className="signup-plan-card__description">
        {plan.descriptionLines.map((line, index) => (
          <p key={`${plan.id}-${index}`}>{line || "\u00A0"}</p>
        ))}
      </div>

      <p className="signup-plan-card__includes-label">{plan.includesLabel}</p>
    </div>
  );
}
