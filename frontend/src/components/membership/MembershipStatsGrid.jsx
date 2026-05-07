import IconImage from "../common/IconImage";
import { formatEuroPerMonth, formatLongDate } from "../../utils/membershipPageUtils";

export default function MembershipStatsGrid({
  membershipStatusClass,
  membershipStatusLabel,
  membershipPlanName,
  nextPaymentDate,
  nextPaymentLabel,
  totalMonthlyFee,
}) {
  const stats = [
    {
      id: "status",
      iconName: "check",
      iconAlt: "Status",
      label: "STATUS",
      value: membershipStatusLabel,
      valueClassName: membershipStatusClass,
    },
    {
      id: "plan",
      iconName: "membership",
      iconAlt: "Plan",
      label: "PLAN",
      value: membershipPlanName,
    },
    {
      id: "fee",
      iconName: "creditCard",
      iconAlt: "Monthly fee",
      label: "MONTHLY FEE",
      value: formatEuroPerMonth(totalMonthlyFee),
    },
    {
      id: "next-payment",
      iconName: "calendar",
      iconAlt: "Next payment",
      label: nextPaymentLabel,
      value: formatLongDate(nextPaymentDate),
    },
  ];

  return (
    <div className="my-membership-page__stats-grid">
      {stats.map((stat) => (
        <article
          key={stat.id}
          className="my-membership-page__stat-card gm-surface-card"
        >
          <IconImage
            name={stat.iconName}
            alt={stat.iconAlt}
            decorative={false}
            className="my-membership-page__stat-icon"
          />

          <div>
            <p className="my-membership-page__stat-label">{stat.label}</p>
            <p
              className={`my-membership-page__stat-value ${
                stat.valueClassName ?? ""
              }`}
            >
              {stat.value}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
