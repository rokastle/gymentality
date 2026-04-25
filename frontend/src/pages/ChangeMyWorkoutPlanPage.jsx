import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useWorkoutPlans } from "../hooks/useWorkoutPlans";
import { mapWorkoutPlanFromApi } from "../data/signupPlansData";

function normalizeValue(value = "") {
  return value.toLowerCase().trim();
}

function getWorkoutKeyword(value = "") {
  const normalized = normalizeValue(value);

  if (normalized.includes("personal")) {
    return "personal";
  }

  if (normalized.includes("integral")) {
    return "integral";
  }

  if (normalized.includes("basic")) {
    return "basic";
  }

  return normalized;
}

function isCurrentWorkoutPlan(plan, currentPlanName) {
  const currentKeyword = getWorkoutKeyword(currentPlanName);
  const planText = normalizeValue(`${plan.title} ${plan.summaryName}`);

  return Boolean(currentKeyword && planText.includes(currentKeyword));
}

export default function ChangeMyWorkoutPlanPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { plans, loading, error } = useWorkoutPlans();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalStep, setModalStep] = useState(null);
  const [pendingPlanId, setPendingPlanId] = useState(null);

  const workoutPlans = useMemo(
    () => plans.map(mapWorkoutPlanFromApi),
    [plans]
  );

  const pendingStorageKey = user?.id
    ? `gm_pending_workout_change_${user.id}`
    : null;

  useEffect(() => {
    if (!pendingStorageKey) {
      return;
    }

    try {
      const rawPendingChange = localStorage.getItem(pendingStorageKey);
      const pendingChange = rawPendingChange
        ? JSON.parse(rawPendingChange)
        : null;

      if (pendingChange?.planId) {
        setPendingPlanId(pendingChange.planId);
      }
    } catch {
      setPendingPlanId(null);
    }
  }, [pendingStorageKey]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleSelectPlan = (plan) => {
    const isCurrent = isCurrentWorkoutPlan(plan, user.workoutPlanName);
    const isPending = pendingPlanId === plan.id;

    if (isCurrent || isPending) {
      return;
    }

    setSelectedPlan(plan);
    setModalStep("confirm");
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setModalStep(null);
  };

  const handleConfirmChange = () => {
    if (!selectedPlan || !pendingStorageKey) {
      return;
    }

    const pendingChange = {
      planId: selectedPlan.id,
      planName: selectedPlan.summaryName,
      requestedAt: new Date().toISOString(),
      status: "scheduled",
    };

    localStorage.setItem(pendingStorageKey, JSON.stringify(pendingChange));
    setPendingPlanId(selectedPlan.id);
    setModalStep("scheduled");
  };

  return (
    <section className="signup-selection-page gm-dark-section-bg">
      <div className="gm-container signup-selection-page__container">
        <h1 className="signup-selection-page__title">
          CHANGE MY WORKOUT PLAN
        </h1>

        {loading && (
          <p className="text-center text-white">Loading workout plans...</p>
        )}

        {error && (
          <p className="text-center text-white">
            No se pudieron cargar los planes de entrenamiento.
          </p>
        )}

        {!loading && !error && (
          <div className="signup-selection-page__grid">
            {workoutPlans.map((plan) => {
              const current = isCurrentWorkoutPlan(plan, user.workoutPlanName);
              const pending = pendingPlanId === plan.id;

              return (
                <article
                  key={plan.id}
                  className="signup-plan-card signup-plan-card--workout gm-surface-card"
                >
                  <h2 className="signup-plan-card__title">{plan.title}</h2>

                  <div className="signup-plan-card__pricing">
                    <p className="signup-plan-card__price">{plan.priceText}</p>

                    <div className="signup-plan-card__description">
                      {plan.descriptionLines.map((line, index) => (
                        <p key={`${plan.id}-${index}`}>
                          {line || "\u00A0"}
                        </p>
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
                    <button
                      type="button"
                      className={`gm-btn gm-btn--pill signup-plan-card__button ${
                        current || pending
                          ? "gm-btn--locked"
                          : "gm-btn--solid-yellow"
                      }`}
                      disabled={current || pending}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      {current
                        ? "CURRENT PLAN"
                        : pending
                          ? "CHANGE SCHEDULED"
                          : "SELECT"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="signup-plan-card__footer">
          <button
            type="button"
            className="gm-btn gm-btn--pill gm-btn--outline-yellow"
            onClick={() => navigate("/account/membership")}
          >
            BACK TO MY MEMBERSHIP
          </button>
        </div>
      </div>

      {modalStep === "confirm" && selectedPlan && (
        <div className="my-membership-page__modal-backdrop">
          <div
            className="my-membership-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-workout-title"
          >
            <h2
              id="change-workout-title"
              className="my-membership-page__modal-title"
            >
              Change workout plan?
            </h2>

            <p className="my-membership-page__modal-text">
              You are about to change your workout plan to:
            </p>

            <p className="my-membership-page__modal-highlight">
              {selectedPlan.summaryName}
            </p>

            <p className="my-membership-page__modal-text">
              TThis change will be scheduled and applied at the start of your next monthly training cycle.
            </p>

            <div className="my-membership-page__modal-actions">
              <button
                type="button"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
                onClick={handleConfirmChange}
              >
                YES, CHANGE
              </button>

              <button
                type="button"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
                onClick={handleCloseModal}
              >
                NO, KEEP CURRENT
              </button>
            </div>
          </div>
        </div>
      )}

      {modalStep === "scheduled" && selectedPlan && (
        <div className="my-membership-page__modal-backdrop">
          <div
            className="my-membership-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="workout-change-scheduled-title"
          >
            <h2
              id="workout-change-scheduled-title"
              className="my-membership-page__modal-title"
            >
              Change scheduled
            </h2>

            <p className="my-membership-page__modal-text">
              Your workout plan change to:
            </p>

            <p className="my-membership-page__modal-highlight">
              {selectedPlan.summaryName}
            </p>

            <p className="my-membership-page__modal-text">
              will be applied at the start of your next monthly training cycle.
            </p>

            <div className="my-membership-page__modal-actions my-membership-page__modal-actions--single">
              <button
                type="button"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
                onClick={() => navigate("/account/membership")}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}