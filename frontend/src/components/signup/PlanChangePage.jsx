import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  getPendingPlanId,
  savePendingPlanChange,
} from "../../utils/planChangeUtils";

export default function PlanChangePage({
  backPath = "/account/membership",
  cardVariant,
  confirmApplyText,
  confirmTitle,
  currentPlanName,
  error,
  errorText,
  isCurrentPlan,
  loading,
  loadingText,
  pageTitle,
  plans,
  renderPricing,
  scheduledApplyText,
  scheduledTitle = "Change scheduled",
  storageKeyPrefix,
  targetLabel,
}) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalStep, setModalStep] = useState(null);
  const [confirmedPendingPlanId, setConfirmedPendingPlanId] = useState(null);

  const pendingStorageKey = user?.id ? `${storageKeyPrefix}_${user.id}` : null;
  const pendingPlanId =
    confirmedPendingPlanId ?? getPendingPlanId(pendingStorageKey);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleSelectPlan = (plan) => {
    const current = isCurrentPlan(plan, currentPlanName);
    const pending = pendingPlanId === plan.id;

    if (current || pending) {
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

    savePendingPlanChange(pendingStorageKey, selectedPlan);
    setConfirmedPendingPlanId(selectedPlan.id);
    setModalStep("scheduled");
  };

  return (
    <section className="signup-selection-page gm-dark-section-bg">
      <div className="gm-container signup-selection-page__container">
        <h1 className="signup-selection-page__title">{pageTitle}</h1>

        {loading && <p className="text-center text-white">{loadingText}</p>}

        {error && <p className="text-center text-white">{errorText}</p>}

        {!loading && !error && (
          <div className="signup-selection-page__grid">
            {plans.map((plan) => {
              const current = isCurrentPlan(plan, currentPlanName);
              const pending = pendingPlanId === plan.id;

              return (
                <PlanChangeCard
                  key={plan.id}
                  current={current}
                  pending={pending}
                  plan={plan}
                  renderPricing={renderPricing}
                  cardVariant={cardVariant}
                  onSelectPlan={handleSelectPlan}
                />
              );
            })}
          </div>
        )}

        <div className="signup-plan-card__footer">
          <button
            type="button"
            className="gm-btn gm-btn--pill gm-btn--outline-yellow"
            onClick={() => navigate(backPath)}
          >
            BACK TO MY MEMBERSHIP
          </button>
        </div>
      </div>

      <PlanChangeModal
        applyText={confirmApplyText}
        modalStep={modalStep}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmChange}
        plan={selectedPlan}
        targetLabel={targetLabel}
        title={confirmTitle}
        titleId={`${storageKeyPrefix}-confirm-title`}
      />

      <PlanChangeScheduledModal
        applyText={scheduledApplyText}
        modalStep={modalStep}
        onClose={() => navigate(backPath)}
        plan={selectedPlan}
        targetLabel={targetLabel}
        title={scheduledTitle}
        titleId={`${storageKeyPrefix}-scheduled-title`}
      />
    </section>
  );
}

function PlanChangeCard({
  cardVariant,
  current,
  onSelectPlan,
  pending,
  plan,
  renderPricing,
}) {
  return (
    <article
      className={`signup-plan-card signup-plan-card--${cardVariant} gm-surface-card`}
    >
      <h2 className="signup-plan-card__title">{plan.title}</h2>

      {renderPricing(plan)}

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
            current || pending ? "gm-btn--locked" : "gm-btn--solid-yellow"
          }`}
          disabled={current || pending}
          onClick={() => onSelectPlan(plan)}
        >
          {current ? "CURRENT PLAN" : pending ? "CHANGE SCHEDULED" : "SELECT"}
        </button>
      </div>
    </article>
  );
}

function PlanChangeModal({
  applyText,
  modalStep,
  onCancel,
  onConfirm,
  plan,
  targetLabel,
  title,
  titleId,
}) {
  if (modalStep !== "confirm" || !plan) {
    return null;
  }

  return (
    <div className="my-membership-page__modal-backdrop">
      <div
        className="my-membership-page__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="my-membership-page__modal-title">
          {title}
        </h2>

        <p className="my-membership-page__modal-text">
          You are about to change your {targetLabel} to:
        </p>

        <p className="my-membership-page__modal-highlight">
          {plan.summaryName}
        </p>

        <p className="my-membership-page__modal-text">{applyText}</p>

        <div className="my-membership-page__modal-actions">
          <button
            type="button"
            className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
            onClick={onConfirm}
          >
            YES, CHANGE
          </button>

          <button
            type="button"
            className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
            onClick={onCancel}
          >
            NO, KEEP CURRENT
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanChangeScheduledModal({
  applyText,
  modalStep,
  onClose,
  plan,
  targetLabel,
  title,
  titleId,
}) {
  if (modalStep !== "scheduled" || !plan) {
    return null;
  }

  return (
    <div className="my-membership-page__modal-backdrop">
      <div
        className="my-membership-page__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId} className="my-membership-page__modal-title">
          {title}
        </h2>

        <p className="my-membership-page__modal-text">
          Your {targetLabel} change to:
        </p>

        <p className="my-membership-page__modal-highlight">
          {plan.summaryName}
        </p>

        <p className="my-membership-page__modal-text">{applyText}</p>

        <div className="my-membership-page__modal-actions my-membership-page__modal-actions--single">
          <button
            type="button"
            className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
