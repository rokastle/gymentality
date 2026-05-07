import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useBookClassPage from "../hooks/useBookClassPage";
import BookClassHeader from "../components/classes/BookClassHeader";
import BookClassList from "../components/classes/BookClassList";
import BookingFeedbackModal from "../components/classes/BookingFeedbackModal";
import ConfirmCancelBookingModal from "../components/classes/ConfirmCancelBookingModal";
import WeeklyCalendar from "../components/common/WeeklyCalendar";
import { formatMonthTitle } from "../utils/calendarDateUtils";
import {
  BOOK_CLASS_WEEKDAY_LABELS,
  isSelectableDate,
} from "../utils/bookClassPageUtils";
import iconArrowYellow from "../assets/icons/icon_arrowYellow_180x180.png";

export default function BookClassPage() {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const {
    busyClassId,
    canGoToNextWeek,
    canGoToPreviousWeek,
    cancelTarget,
    clubName,
    errorMessage,
    feedbackMessage,
    getCalendarDayStateClassName,
    handleConfirmCancel,
    handleNextWeek,
    handleNotify,
    handlePreviousWeek,
    handleReserve,
    handleSelectDate,
    isLoading,
    maxSelectableDate,
    scheduleItems,
    selectedDate,
    setCancelTarget,
    setFeedbackMessage,
    today,
    weekDays,
  } = useBookClassPage({ isAuthenticated, user });

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="book-class-page gm-dark-section-bg">
      <div className="gm-container book-class-page__container">
        <BookClassHeader clubName={clubName} />

        <div className="book-class-page__panel">
          <WeeklyCalendar
            monthTitle={formatMonthTitle(selectedDate)}
            days={weekDays}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            isDayDisabled={(day) =>
              !isSelectableDate(day, today, maxSelectableDate)
            }
            getDayStateClassName={getCalendarDayStateClassName}
            showPreviousArrow={canGoToPreviousWeek}
            showNextArrow={canGoToNextWeek}
            onPrevious={handlePreviousWeek}
            onNext={handleNextWeek}
            previousIcon={iconArrowYellow}
            nextIcon={iconArrowYellow}
            weekdayLabels={BOOK_CLASS_WEEKDAY_LABELS}
          />

          <div className="book-class-page__list">
            <BookClassList
              busyClassId={busyClassId}
              errorMessage={errorMessage}
              isLoading={isLoading}
              onCancel={setCancelTarget}
              onNotify={handleNotify}
              onReserve={handleReserve}
              scheduleItems={scheduleItems}
            />
          </div>
        </div>
      </div>

      <BookingFeedbackModal
        open={Boolean(feedbackMessage)}
        message={feedbackMessage}
        onClose={() => setFeedbackMessage("")}
      />

      <ConfirmCancelBookingModal
        open={Boolean(cancelTarget)}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelTarget(null)}
      />
    </section>
  );
}
