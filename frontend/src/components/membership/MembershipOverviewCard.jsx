import { Link } from "react-router-dom";
import IconImage from "../common/IconImage";
import {
  formatEuro,
  formatLongDate,
  formatShortDate,
} from "../../utils/membershipPageUtils";

export default function MembershipOverviewCard({
  badgeStatusClass,
  clubName,
  isCancellationScheduled,
  memberSinceDate,
  membershipPlan,
  membershipPlanName,
  membershipStatusLabel,
  nextPaymentDate,
  onCancelMembership,
  paymentMethodLabel,
  renewalLabel,
  renewalValueClass,
  totalMonthlyFee,
  workoutPlanName,
}) {
  return (
    <section className="my-membership-page__main-card gm-surface-card">
      <div className="my-membership-page__main-grid">
        <div className="my-membership-page__main-column my-membership-page__main-column--plan">
          <p className="my-membership-page__section-kicker">YOUR MEMBERSHIP</p>

          <div className="my-membership-page__plan-header">
            <IconImage
              name="membership"
              alt={membershipPlanName}
              decorative={false}
              className="my-membership-page__plan-icon"
            />

            <div>
              <h2 className="my-membership-page__plan-name">
                {membershipPlanName}
              </h2>
              <p className="my-membership-page__plan-description">
                {membershipPlan.description}
              </p>
            </div>
          </div>

          <div className="my-membership-page__badge-row">
            <span className={badgeStatusClass}>{membershipStatusLabel}</span>
            <span className="my-membership-page__member-since">
              Member since {formatShortDate(memberSinceDate)}
            </span>
          </div>
        </div>

        <div className="my-membership-page__main-column">
          <MembershipDetail label="Billing" value={membershipPlan.billingLabel} />
          <MembershipDetail label="Monthly fee" value={formatEuro(totalMonthlyFee)} />
          <MembershipDetail
            label={isCancellationScheduled ? "Membership ends" : "Next payment"}
            value={formatLongDate(nextPaymentDate)}
          />
          <MembershipDetail
            label="Renews automatically"
            value={renewalLabel}
            valueClassName={renewalValueClass}
          />
        </div>

        <div className="my-membership-page__main-column">
          <MembershipDetail label="Gym Location" value={clubName} />
          <MembershipDetail label="Payment method" value={paymentMethodLabel} />
          <MembershipDetail label="Workout plan" value={workoutPlanName} />
        </div>
      </div>

      <div className="my-membership-page__actions">
        <Link
          to="/account/membership/change"
          className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__action-btn"
        >
          CHANGE MEMBERSHIP
        </Link>

        <Link
          to="/account/workout/change"
          className="gm-btn gm-btn--pill gm-btn--outline-yellow my-membership-page__action-btn"
        >
          CHANGE WORKOUT PLAN
        </Link>

        <button
          type="button"
          className={`gm-btn gm-btn--pill my-membership-page__action-btn ${
            isCancellationScheduled
              ? "gm-btn--locked"
              : "my-membership-page__action-btn--danger"
          }`}
          onClick={onCancelMembership}
          disabled={isCancellationScheduled}
        >
          {isCancellationScheduled
            ? "CANCELLATION SCHEDULED"
            : "CANCEL MEMBERSHIP"}
        </button>
      </div>
    </section>
  );
}

function MembershipDetail({ label, value, valueClassName }) {
  return (
    <div className="my-membership-page__detail-block">
      <span className="my-membership-page__detail-label">{label}</span>
      <strong
        className={valueClassName ?? "my-membership-page__detail-value"}
      >
        {value}
      </strong>
    </div>
  );
}
