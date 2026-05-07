import { useMemo } from "react";
import useAuth from "../hooks/useAuth";
import { useMembershipPlans } from "../hooks/useMembership";
import PlanChangePage from "../components/signup/PlanChangePage";
import { mapMembershipPlanFromApi } from "../data/signupPlansData";
import {
  getMembershipKeyword,
  isCurrentPlanByKeyword,
} from "../utils/planChangeUtils";

export default function ChangeMyMembershipPage() {
  const { user } = useAuth();
  const { plans, loading, error } = useMembershipPlans();

  const membershipPlans = useMemo(
    () => plans.map(mapMembershipPlanFromApi),
    [plans]
  );

  return (
    <PlanChangePage
      cardVariant="membership"
      confirmApplyText="This change will be scheduled and applied at the end of your current billing period."
      confirmTitle="Change membership plan?"
      currentPlanName={user?.membershipPlanName}
      error={error}
      errorText="No se pudieron cargar las membresias."
      isCurrentPlan={(plan, currentPlanName) =>
        isCurrentPlanByKeyword(plan, currentPlanName, getMembershipKeyword)
      }
      loading={loading}
      loadingText="Loading membership plans..."
      pageTitle="CHANGE MY MEMBERSHIP PLAN"
      plans={membershipPlans}
      renderPricing={renderMembershipPricing}
      scheduledApplyText="will be applied at the end of your current billing period."
      storageKeyPrefix="gm_pending_membership_change"
      targetLabel="membership"
    />
  );
}

function renderMembershipPricing(plan) {
  return (
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
  );
}
