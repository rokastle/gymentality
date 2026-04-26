import { Link, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import IconImage from "../components/common/IconImage";

const PAYMENTS_PER_PAGE = 5;

const membershipPlanCatalog = {
  monthly: {
    description:
      "Flexible membership with full gym access, daily-use locker and online workout support.",
    billingLabel: "Monthly",
    monthlyPrice: 39.99,
    cycleInMonths: 1,
  },
  quarterly: {
    description:
      "Quarterly membership with better monthly value, flexible training and partner discounts.",
    billingLabel: "Every 3 months",
    monthlyPrice: 34.99,
    cycleInMonths: 3,
  },
  annual: {
    description:
      "Best-value annual membership with full club access and long-term savings.",
    billingLabel: "Annual",
    monthlyPrice: 29.99,
    cycleInMonths: 12,
  },
};

const workoutPlanCatalog = {
  basic: {
    monthlyPrice: 0,
  },
  personal: {
    monthlyPrice: 30,
  },
  integral: {
    monthlyPrice: 50,
  },
};

function normalizeValue(value = "") {
  return value.toLowerCase().trim();
}

function getMembershipPlanKey(name = "") {
  const normalized = normalizeValue(name);

  if (normalized.includes("quarter") || normalized.includes("quater")) {
    return "quarterly";
  }

  if (normalized.includes("annual") || normalized.includes("year")) {
    return "annual";
  }

  return "monthly";
}

function getWorkoutPlanKey(name = "") {
  const normalized = normalizeValue(name);

  if (normalized.includes("personal")) {
    return "personal";
  }

  if (normalized.includes("integral")) {
    return "integral";
  }

  return "basic";
}

function formatEuro(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

function formatEuroPerMonth(value) {
  return `${Number(value || 0).toFixed(2)} €/Month`;
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getSafeMemberSinceDate(user) {
  const rawDate =
    user?.createdAt || user?.memberSince || user?.registrationDate || "";

  if (rawDate) {
    const parsed = new Date(rawDate);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const fallback = new Date();
  fallback.setMonth(fallback.getMonth() - 3);
  return fallback;
}

function getNextRenewalDate(memberSinceDate, cycleInMonths) {
  const today = new Date();
  let nextDate = addMonths(memberSinceDate, cycleInMonths);

  while (nextDate <= today) {
    nextDate = addMonths(nextDate, cycleInMonths);
  }

  return nextDate;
}

function getPaymentBrand(user) {
  const paymentMethod = normalizeValue(user?.paymentMethod);

  if (paymentMethod === "card") {
    return "VISA";
  }

  return "CARD";
}

function getPaymentExpiryLabel(user) {
  if (!user?.cardExpiryMonth || !user?.cardExpiryYear) {
    return "No expiration date";
  }

  const month = String(user.cardExpiryMonth).padStart(2, "0");

  return `Expires ${user.cardExpiryYear}/${month}`;
}

function getPaymentMethodLabel(user) {
  if (!user?.cardLast4) {
    return "No payment method";
  }

  return `${getPaymentBrand(user)} ending in ${user.cardLast4}`;
}

export default function MyMembershipPage() {
  const { user, isAuthenticated } = useAuth();

  const [selectedDate, setSelectedDate] = useState("");
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [isDateListOpen, setIsDateListOpen] = useState(false);
  const [cancelModalStep, setCancelModalStep] = useState(null);
  const [isCancellationScheduled, setIsCancellationScheduled] = useState(false);

  const cancellationStorageKey = user?.id
    ? `gm_membership_cancellation_${user.id}`
    : null;

  useEffect(() => {
    if (!cancellationStorageKey) {
      return;
    }

    const storedCancellation = localStorage.getItem(cancellationStorageKey);
    setIsCancellationScheduled(storedCancellation === "true");
  }, [cancellationStorageKey]);

  useEffect(() => {
    setCurrentPaymentPage(1);
  }, [selectedDate]);

  const membershipPlanName = user?.membershipPlanName || "Monthly Plan";
  const workoutPlanName = user?.workoutPlanName || "Workout Basic Plan";
  const clubName = user?.clubName || "GYM Central Málaga";

  const paymentMethodLabel = getPaymentMethodLabel(user);
  const paymentExpiryLabel = getPaymentExpiryLabel(user);
  const hasPaymentMethod = Boolean(user?.cardLast4);

  const membershipPlanKey = getMembershipPlanKey(membershipPlanName);
  const workoutPlanKey = getWorkoutPlanKey(workoutPlanName);

  const membershipPlan =
    membershipPlanCatalog[membershipPlanKey] ?? membershipPlanCatalog.monthly;

  const workoutPlan =
    workoutPlanCatalog[workoutPlanKey] ?? workoutPlanCatalog.basic;

  const memberSinceDate = getSafeMemberSinceDate(user);

  const nextPaymentDate = getNextRenewalDate(
    memberSinceDate,
    membershipPlan.cycleInMonths
  );

  const totalMonthlyFee =
    membershipPlan.monthlyPrice + workoutPlan.monthlyPrice;

  const membershipStatusLabel = isCancellationScheduled
    ? "CANCELLATION SCHEDULED"
    : "ACTIVE";

  const membershipStatusClass = isCancellationScheduled
    ? "my-membership-page__stat-value--warning"
    : "my-membership-page__stat-value--success";

  const badgeStatusClass = isCancellationScheduled
    ? "my-membership-page__status-badge my-membership-page__status-badge--warning"
    : "my-membership-page__status-badge";

  const nextPaymentLabel = isCancellationScheduled ? "ENDS ON" : "NEXT PAYMENT";

  const renewalLabel = isCancellationScheduled ? "NO" : "YES";

  const renewalValueClass = isCancellationScheduled
    ? "my-membership-page__detail-value my-membership-page__detail-value--warning"
    : "my-membership-page__detail-value my-membership-page__detail-value--success";

  const paymentHistory = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const paymentDate = addMonths(
        nextPaymentDate,
        -(index + 1) * Math.max(1, membershipPlan.cycleInMonths)
      );

      return {
        id: `payment-${index + 1}`,
        date: formatShortDate(paymentDate),
        dateISO: paymentDate.toISOString().slice(0, 10),
        status: "Paid",
        description: "Membership and workout fee",
        amount: formatEuro(totalMonthlyFee),
        invoice: `INV-${paymentDate.getFullYear()}${String(
          paymentDate.getMonth() + 1
        ).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
      };
    });
  }, [membershipPlan.cycleInMonths, nextPaymentDate, totalMonthlyFee]);

  const normalizedSelectedDate = normalizeValue(selectedDate);

  const filteredDateOptions = normalizedSelectedDate
    ? paymentHistory.filter((payment) =>
      normalizeValue(
        `${payment.date} ${payment.dateISO} ${payment.invoice}`
      ).includes(normalizedSelectedDate)
    )
    : paymentHistory;

  const filteredHistory = selectedDate ? filteredDateOptions : paymentHistory;

  const totalPaymentPages = Math.max(
    1,
    Math.ceil(filteredHistory.length / PAYMENTS_PER_PAGE)
  );

  const safePaymentPage = Math.min(currentPaymentPage, totalPaymentPages);

  const firstPaymentIndex = (safePaymentPage - 1) * PAYMENTS_PER_PAGE;

  const paginatedHistory = filteredHistory.slice(
    firstPaymentIndex,
    firstPaymentIndex + PAYMENTS_PER_PAGE
  );

  const handlePreviousPaymentPage = () => {
    setCurrentPaymentPage((current) => Math.max(1, current - 1));
  };

  const handleNextPaymentPage = () => {
    setCurrentPaymentPage((current) =>
      Math.min(totalPaymentPages, current + 1)
    );
  };

  const handleCancelMembershipClick = () => {
    setCancelModalStep("confirm");
  };

  const handleKeepMembership = () => {
    setCancelModalStep(null);
  };

  const handleConfirmCancellation = () => {
    setIsCancellationScheduled(true);

    if (cancellationStorageKey) {
      localStorage.setItem(cancellationStorageKey, "true");
    }

    setCancelModalStep("scheduled");
  };

  const handleCloseCancellationNotice = () => {
    setCancelModalStep(null);
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="my-membership-page gm-dark-section-bg">
      <div className="gm-container my-membership-page__container">
        <header className="my-membership-page__header">
          <h1 className="my-membership-page__title">MY MEMBERSHIP</h1>
          <p className="my-membership-page__intro">
            Manage your plan, payments and billing details.
          </p>
        </header>

        <div className="my-membership-page__stats-grid">
          <article className="my-membership-page__stat-card gm-surface-card">
            <IconImage
              name="check"
              alt="Status"
              decorative={false}
              className="my-membership-page__stat-icon"
            />

            <div>
              <p className="my-membership-page__stat-label">STATUS</p>
              <p
                className={`my-membership-page__stat-value ${membershipStatusClass}`}
              >
                {membershipStatusLabel}
              </p>
            </div>
          </article>

          <article className="my-membership-page__stat-card gm-surface-card">
            <IconImage
              name="membership"
              alt="Plan"
              decorative={false}
              className="my-membership-page__stat-icon"
            />

            <div>
              <p className="my-membership-page__stat-label">PLAN</p>
              <p className="my-membership-page__stat-value">
                {membershipPlanName}
              </p>
            </div>
          </article>

          <article className="my-membership-page__stat-card gm-surface-card">
            <IconImage
              name="creditCard"
              alt="Monthly fee"
              decorative={false}
              className="my-membership-page__stat-icon"
            />

            <div>
              <p className="my-membership-page__stat-label">MONTHLY FEE</p>
              <p className="my-membership-page__stat-value">
                {formatEuroPerMonth(totalMonthlyFee)}
              </p>
            </div>
          </article>

          <article className="my-membership-page__stat-card gm-surface-card">
            <IconImage
              name="calendar"
              alt="Next payment"
              decorative={false}
              className="my-membership-page__stat-icon"
            />

            <div>
              <p className="my-membership-page__stat-label">
                {nextPaymentLabel}
              </p>
              <p className="my-membership-page__stat-value">
                {formatLongDate(nextPaymentDate)}
              </p>
            </div>
          </article>
        </div>

        <section className="my-membership-page__main-card gm-surface-card">
          <div className="my-membership-page__main-grid">
            <div className="my-membership-page__main-column my-membership-page__main-column--plan">
              <p className="my-membership-page__section-kicker">
                YOUR MEMBERSHIP
              </p>

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
                <span className={badgeStatusClass}>
                  {membershipStatusLabel}
                </span>
                <span className="my-membership-page__member-since">
                  Member since {formatShortDate(memberSinceDate)}
                </span>
              </div>
            </div>

            <div className="my-membership-page__main-column">
              <div className="my-membership-page__detail-block">
                <span className="my-membership-page__detail-label">Billing</span>
                <strong className="my-membership-page__detail-value">
                  {membershipPlan.billingLabel}
                </strong>
              </div>

              <div className="my-membership-page__detail-block">
                <span className="my-membership-page__detail-label">
                  Monthly fee
                </span>
                <strong className="my-membership-page__detail-value">
                  {formatEuro(totalMonthlyFee)}
                </strong>
              </div>

              <div className="my-membership-page__detail-block">
                <span className="my-membership-page__detail-label">
                  {isCancellationScheduled ? "Membership ends" : "Next payment"}
                </span>
                <strong className="my-membership-page__detail-value">
                  {formatLongDate(nextPaymentDate)}
                </strong>
              </div>

              <div className="my-membership-page__detail-block">
                <span className="my-membership-page__detail-label">
                  Renews automatically
                </span>
                <strong className={renewalValueClass}>{renewalLabel}</strong>
              </div>
            </div>

            <div className="my-membership-page__main-column">
              <div className="my-membership-page__detail-block">
                <span className="my-membership-page__detail-label">
                  Gym Location
                </span>
                <strong className="my-membership-page__detail-value">
                  {clubName}
                </strong>
              </div>

              <div className="my-membership-page__detail-block">
                <span className="my-membership-page__detail-label">
                  Payment method
                </span>
                <strong className="my-membership-page__detail-value">
                  {paymentMethodLabel}
                </strong>
              </div>

              <div className="my-membership-page__detail-block">
                <span className="my-membership-page__detail-label">
                  Workout plan
                </span>
                <strong className="my-membership-page__detail-value">
                  {workoutPlanName}
                </strong>
              </div>
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
              className={`gm-btn gm-btn--pill my-membership-page__action-btn ${isCancellationScheduled
                ? "gm-btn--locked"
                : "my-membership-page__action-btn--danger"
                }`}
              onClick={handleCancelMembershipClick}
              disabled={isCancellationScheduled}
            >
              {isCancellationScheduled
                ? "CANCELLATION SCHEDULED"
                : "CANCEL MEMBERSHIP"}
            </button>
          </div>
        </section>

        <div className="my-membership-page__bottom-grid">
          <section className="my-membership-page__history-card gm-surface-card">
            <div className="my-membership-page__history-header">
              <div>
                <h2 className="my-membership-page__block-title">
                  PAYMENT HISTORY
                </h2>
                <p className="my-membership-page__block-subtitle">
                  Review your recent payments and invoices
                </p>
              </div>

              <div className="my-membership-page__date-filter">
                <label
                  htmlFor="membership-date-filter"
                  className="my-membership-page__date-label"
                >
                  Select payment date
                </label>

                <div
                  className="my-membership-page__date-input-wrapper"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setIsDateListOpen(false);
                    }
                  }}
                >
                  <input
                    id="membership-date-filter"
                    type="text"
                    value={selectedDate}
                    onFocus={() => setIsDateListOpen(true)}
                    onChange={(event) => {
                      setSelectedDate(event.target.value);
                      setIsDateListOpen(true);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setIsDateListOpen(false);
                      }
                    }}
                    className="my-membership-page__date-input"
                    placeholder="Select payment date"
                    autoComplete="off"
                  />

                  {selectedDate && (
                    <button
                      type="button"
                      className="my-membership-page__date-clear"
                      onClick={() => {
                        setSelectedDate("");
                        setIsDateListOpen(true);
                      }}
                      aria-label="Clear selected date"
                    >
                      ×
                    </button>
                  )}

                  <IconImage
                    name="date"
                    decorative
                    className="my-membership-page__date-icon"
                  />

                  {isDateListOpen && (
                    <div
                      className="my-membership-page__date-list"
                      role="listbox"
                    >
                      {filteredDateOptions.length ? (
                        filteredDateOptions.map((payment) => (
                          <button
                            key={payment.id}
                            type="button"
                            className="my-membership-page__date-option"
                            onMouseDown={(event) => {
                              event.preventDefault();
                              setSelectedDate(payment.date);
                              setIsDateListOpen(false);
                            }}
                          >
                            <span>{payment.date}</span>
                            <small>{payment.invoice}</small>
                          </button>
                        ))
                      ) : (
                        <p className="my-membership-page__date-empty">
                          No payment dates found.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="my-membership-page__table-wrapper">
              <table className="my-membership-page__table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>DESCRIPTION</th>
                    <th>AMOUNT</th>
                    <th>INVOICE</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredHistory.length ? (
                    paginatedHistory.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.date}</td>
                        <td>
                          <span className="my-membership-page__paid-badge">
                            {payment.status}
                          </span>
                        </td>
                        <td>{payment.description}</td>
                        <td>{payment.amount}</td>
                        <td>
                          <button
                            type="button"
                            className="my-membership-page__invoice-btn"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="my-membership-page__empty-state"
                      >
                        No payments found for the selected date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredHistory.length > PAYMENTS_PER_PAGE && (
              <div className="my-membership-page__pagination">
                <button
                  type="button"
                  className="my-membership-page__pagination-btn"
                  onClick={handlePreviousPaymentPage}
                  disabled={safePaymentPage === 1}
                >
                  Previous
                </button>

                <div className="my-membership-page__pagination-pages">
                  {Array.from({ length: totalPaymentPages }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        className={`my-membership-page__pagination-page ${pageNumber === safePaymentPage ? "is-active" : ""
                          }`}
                        onClick={() => setCurrentPaymentPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="my-membership-page__pagination-btn"
                  onClick={handleNextPaymentPage}
                  disabled={safePaymentPage === totalPaymentPages}
                >
                  Next
                </button>
              </div>
            )}
          </section>

          <div className="my-membership-page__sidebar">
            <section className="my-membership-page__payment-card gm-surface-card">
              <h2 className="my-membership-page__block-title">
                PAYMENT METHOD
              </h2>

              <p className="my-membership-page__block-subtitle">
                Current subscription payment method:
              </p>

              <div className="my-membership-page__stored-payment">
                <div className="my-membership-page__stored-payment-icon">
                  <IconImage
                    name="creditCard"
                    alt="Credit card"
                    decorative={false}
                    className="my-membership-page__stored-payment-icon-image"
                  />
                </div>

                <div className="my-membership-page__stored-payment-info">
                  <strong>{paymentMethodLabel}</strong>
                  <span>{hasPaymentMethod ? paymentExpiryLabel : "Add a card in your profile"}</span>
                </div>
              </div>

              <Link
                to="/account/profile"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__sidebar-btn"
              >
                MANAGE PAYMENT METHOD
              </Link>
            </section>

            <section className="my-membership-page__help-card gm-surface-card">
              <h2 className="my-membership-page__block-title">NEED HELP?</h2>
              <p className="my-membership-page__help-text">
                Our team is here to help with any billing or membership
                questions.
              </p>

              <a
                href="mailto:support@gymentality.com"
                className="gm-btn gm-btn--pill gm-btn--outline-yellow my-membership-page__sidebar-btn"
              >
                CONTACT SUPPORT
              </a>
            </section>
          </div>
        </div>
      </div>

      {cancelModalStep === "confirm" && (
        <div className="my-membership-page__modal-backdrop">
          <div
            className="my-membership-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-membership-title"
          >
            <h2
              id="cancel-membership-title"
              className="my-membership-page__modal-title"
            >
              Are you sure you want to cancel your membership?
            </h2>

            <p className="my-membership-page__modal-text">
              Your membership will remain active until:
            </p>

            <p className="my-membership-page__modal-highlight">
              {formatLongDate(nextPaymentDate)}
            </p>

            <p className="my-membership-page__modal-text">
              You can continue using all member benefits until that date.
            </p>

            <div className="my-membership-page__modal-actions">
              <button
                type="button"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
                onClick={handleConfirmCancellation}
              >
                YES, CANCEL
              </button>

              <button
                type="button"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
                onClick={handleKeepMembership}
              >
                NO, KEEP IT
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelModalStep === "scheduled" && (
        <div className="my-membership-page__modal-backdrop">
          <div
            className="my-membership-page__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="membership-cancelled-title"
          >
            <h2
              id="membership-cancelled-title"
              className="my-membership-page__modal-title"
            >
              Cancellation scheduled
            </h2>

            <p className="my-membership-page__modal-text">
              Your membership will stay active until:
            </p>

            <p className="my-membership-page__modal-highlight">
              {formatLongDate(nextPaymentDate)}
            </p>

            <p className="my-membership-page__modal-text">
              After that date, your member access will be disabled automatically.
            </p>

            <div className="my-membership-page__modal-actions my-membership-page__modal-actions--single">
              <button
                type="button"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__modal-btn"
                onClick={handleCloseCancellationNotice}
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