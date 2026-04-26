import {
  formatEuro,
  formatEuroMonth,
} from "../../data/signupPlansData";

export default function SignUpSummarySidebar({
  club,
  membershipPlan,
  workoutPlan,
  totals,
}) {
  return (
    <aside className="signup-details-page__sidebar">
      <div className="signup-details-page__summary-card gm-surface-card">
        <p className="signup-details-page__summary-label">Billing details</p>

        <h2 className="signup-details-page__summary-title">{club.name}</h2>

        <div className="signup-details-page__summary-block">
          <p className="signup-details-page__summary-subtitle">
            Membership selected
          </p>
          <div className="signup-details-page__summary-row">
            <span>{membershipPlan.summaryName}</span>
            <span>{formatEuro(membershipPlan.upfrontPrice)}</span>
          </div>
        </div>

        <div className="signup-details-page__summary-block">
          <p className="signup-details-page__summary-subtitle">
            Workout selected
          </p>
          <div className="signup-details-page__summary-row">
            <span>{workoutPlan.summaryName}</span>
            <span>{formatEuro(workoutPlan.monthlyPrice)}</span>
          </div>
        </div>

        <div className="signup-details-page__summary-block">
          <p className="signup-details-page__summary-subtitle">
            Monthly installments
          </p>
          <div className="signup-details-page__summary-row">
            <span>Monthly fee:</span>
            <span>{formatEuroMonth(totals.monthlyFee)}</span>
          </div>
        </div>

        <div className="signup-details-page__summary-block">
          <p className="signup-details-page__summary-subtitle">
            Amount due today
          </p>
          <div className="signup-details-page__summary-row">
            <span>Membership fee:</span>
            <span>{formatEuro(membershipPlan.upfrontPrice)}</span>
          </div>
          <div className="signup-details-page__summary-row">
            <span>Workout plan:</span>
            <span>{formatEuro(workoutPlan.monthlyPrice)}</span>
          </div>
          <div className="signup-details-page__summary-row">
            <span>Enrollment:</span>
            <span>0,00€</span>
          </div>
        </div>

        <div className="signup-details-page__summary-total">
          <p>Total first payment</p>
          <strong>{formatEuro(totals.totalFirstPayment)}</strong>
        </div>

        <div className="signup-details-page__summary-block">
          <div className="signup-details-page__summary-row signup-details-page__summary-row--stack">
            <span>Contract renewal date:</span>
            <strong>{totals.renewalDate}</strong>
          </div>
        </div>
      </div>

      <div className="signup-details-page__help-card gm-surface-card">
        <div className="signup-details-page__help-icon">?</div>
        <span>Need help?</span>
      </div>
    </aside>
  );
}