import { Navigate } from "react-router-dom";
import { useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import CancellationModals from "../components/membership/CancellationModals";
import MembershipOverviewCard from "../components/membership/MembershipOverviewCard";
import MembershipSidebar from "../components/membership/MembershipSidebar";
import MembershipStatsGrid from "../components/membership/MembershipStatsGrid";
import PaymentHistoryCard from "../components/membership/PaymentHistoryCard";
import {
  membershipPlanCatalog,
  workoutPlanPriceCatalog,
} from "../data/membershipPlanCatalog";
import {
  buildPaymentHistory,
  getCancellationStorageKey,
  getMembershipPlanKey,
  getNextRenewalDate,
  getPaymentExpiryLabel,
  getPaymentMethodLabel,
  getSafeMemberSinceDate,
  getWorkoutPlanKey,
  hasStoredCancellation,
  normalizeValue,
} from "../utils/membershipPageUtils";

const PAYMENTS_PER_PAGE = 5;

export default function MyMembershipPage() {
  const { user, isAuthenticated } = useAuth();

  const [selectedDate, setSelectedDate] = useState("");
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [isDateListOpen, setIsDateListOpen] = useState(false);
  const [cancelModalStep, setCancelModalStep] = useState(null);
  const [confirmedCancellationKeys, setConfirmedCancellationKeys] = useState(
    () => new Set()
  );

  const membershipPlanName = user?.membershipPlanName || "Monthly Plan";
  const workoutPlanName = user?.workoutPlanName || "Workout Basic Plan";
  const clubName = user?.clubName || "GYM Central Malaga";

  const cancellationStorageKey = getCancellationStorageKey(user);
  const isCancellationScheduled =
    confirmedCancellationKeys.has(cancellationStorageKey) ||
    hasStoredCancellation(cancellationStorageKey);

  const paymentMethodLabel = getPaymentMethodLabel(user);
  const paymentExpiryLabel = getPaymentExpiryLabel(user);
  const hasPaymentMethod = Boolean(user?.cardLast4);

  const membershipPlanKey = getMembershipPlanKey(membershipPlanName);
  const workoutPlanKey = getWorkoutPlanKey(workoutPlanName);

  const membershipPlan =
    membershipPlanCatalog[membershipPlanKey] ?? membershipPlanCatalog.monthly;
  const workoutPlan =
    workoutPlanPriceCatalog[workoutPlanKey] ?? workoutPlanPriceCatalog.basic;

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

  const paymentHistory = useMemo(
    () =>
      buildPaymentHistory({
        nextPaymentDate,
        cycleInMonths: membershipPlan.cycleInMonths,
        totalMonthlyFee,
      }),
    [membershipPlan.cycleInMonths, nextPaymentDate, totalMonthlyFee]
  );

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

  const handleDateInputChange = (value) => {
    setSelectedDate(value);
    setCurrentPaymentPage(1);
    setIsDateListOpen(true);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setCurrentPaymentPage(1);
    setIsDateListOpen(false);
  };

  const handleClearDate = () => {
    setSelectedDate("");
    setCurrentPaymentPage(1);
    setIsDateListOpen(true);
  };

  const handlePreviousPaymentPage = () => {
    setCurrentPaymentPage((current) => Math.max(1, current - 1));
  };

  const handleNextPaymentPage = () => {
    setCurrentPaymentPage((current) =>
      Math.min(totalPaymentPages, current + 1)
    );
  };

  const handleConfirmCancellation = () => {
    if (cancellationStorageKey) {
      localStorage.setItem(cancellationStorageKey, "true");
      setConfirmedCancellationKeys((currentKeys) => {
        const nextKeys = new Set(currentKeys);
        nextKeys.add(cancellationStorageKey);
        return nextKeys;
      });
    }

    setCancelModalStep("scheduled");
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

        <MembershipStatsGrid
          membershipStatusClass={membershipStatusClass}
          membershipStatusLabel={membershipStatusLabel}
          membershipPlanName={membershipPlanName}
          nextPaymentDate={nextPaymentDate}
          nextPaymentLabel={nextPaymentLabel}
          totalMonthlyFee={totalMonthlyFee}
        />

        <MembershipOverviewCard
          badgeStatusClass={badgeStatusClass}
          clubName={clubName}
          isCancellationScheduled={isCancellationScheduled}
          memberSinceDate={memberSinceDate}
          membershipPlan={membershipPlan}
          membershipPlanName={membershipPlanName}
          membershipStatusLabel={membershipStatusLabel}
          nextPaymentDate={nextPaymentDate}
          onCancelMembership={() => setCancelModalStep("confirm")}
          paymentMethodLabel={paymentMethodLabel}
          renewalLabel={renewalLabel}
          renewalValueClass={renewalValueClass}
          totalMonthlyFee={totalMonthlyFee}
          workoutPlanName={workoutPlanName}
        />

        <div className="my-membership-page__bottom-grid">
          <PaymentHistoryCard
            currentPaymentPage={safePaymentPage}
            filteredDateOptions={filteredDateOptions}
            filteredHistory={filteredHistory}
            isDateListOpen={isDateListOpen}
            onClearDate={handleClearDate}
            onCloseDateList={() => setIsDateListOpen(false)}
            onDateInputChange={handleDateInputChange}
            onNextPaymentPage={handleNextPaymentPage}
            onOpenDateList={() => setIsDateListOpen(true)}
            onPreviousPaymentPage={handlePreviousPaymentPage}
            onSelectDate={handleSelectDate}
            onSelectPaymentPage={setCurrentPaymentPage}
            paginatedHistory={paginatedHistory}
            paymentsPerPage={PAYMENTS_PER_PAGE}
            safePaymentPage={safePaymentPage}
            selectedDate={selectedDate}
            totalPaymentPages={totalPaymentPages}
          />

          <MembershipSidebar
            hasPaymentMethod={hasPaymentMethod}
            paymentExpiryLabel={paymentExpiryLabel}
            paymentMethodLabel={paymentMethodLabel}
          />
        </div>
      </div>

      <CancellationModals
        cancelModalStep={cancelModalStep}
        nextPaymentDate={nextPaymentDate}
        onCloseCancellationNotice={() => setCancelModalStep(null)}
        onConfirmCancellation={handleConfirmCancellation}
        onKeepMembership={() => setCancelModalStep(null)}
      />
    </section>
  );
}
