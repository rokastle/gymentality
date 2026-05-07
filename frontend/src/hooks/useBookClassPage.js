import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  buildWeekDays,
  formatIsoDate,
  getStartOfDay,
  getWeekStart,
  isSameDay,
} from "../utils/calendarDateUtils";
import {
  getErrorMessage,
  getFirstSelectableDayInWeek,
  isSelectableDate,
  weekHasSelectableDates,
} from "../utils/bookClassPageUtils";
import {
  cancelBooking,
  createBooking,
  getClassSchedule,
  requestClassAvailabilityNotification,
} from "../services/bookingService";

export default function useBookClassPage({ isAuthenticated, user }) {
  const today = useMemo(() => getStartOfDay(new Date()), []);
  const maxSelectableDate = useMemo(() => addDays(today, 6), [today]);

  const [weekStart, setWeekStart] = useState(getWeekStart(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [busyClassId, setBusyClassId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);

  const weekDays = useMemo(() => buildWeekDays(weekStart), [weekStart]);

  const canGoToPreviousWeek = useMemo(() => {
    const previousWeekStart = addDays(weekStart, -7);
    return weekHasSelectableDates(previousWeekStart, today, maxSelectableDate);
  }, [weekStart, today, maxSelectableDate]);

  const canGoToNextWeek = useMemo(() => {
    const nextWeekStart = addDays(weekStart, 7);
    return weekHasSelectableDates(nextWeekStart, today, maxSelectableDate);
  }, [weekStart, today, maxSelectableDate]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let ignore = false;

    async function loadSchedule() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data = await getClassSchedule(formatIsoDate(selectedDate));

        if (!ignore) {
          setScheduleItems(data);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            getErrorMessage(error, "We could not load the class schedule.")
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadSchedule();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, user, selectedDate]);

  const clubName =
    user?.clubName?.trim() || scheduleItems[0]?.clubName || "GYMENTALITY CLUB";

  const handleSelectDate = (date) => {
    if (!isSelectableDate(date, today, maxSelectableDate)) {
      return;
    }

    setSelectedDate(date);
    setWeekStart(getWeekStart(date));
  };

  const handlePreviousWeek = () => {
    const previousWeekStart = addDays(weekStart, -7);

    if (!weekHasSelectableDates(previousWeekStart, today, maxSelectableDate)) {
      return;
    }

    const firstSelectableDay = getFirstSelectableDayInWeek(
      previousWeekStart,
      today,
      maxSelectableDate
    );

    setWeekStart(previousWeekStart);

    if (firstSelectableDay) {
      setSelectedDate(firstSelectableDay);
    }
  };

  const handleNextWeek = () => {
    const nextWeekStart = addDays(weekStart, 7);

    if (!weekHasSelectableDates(nextWeekStart, today, maxSelectableDate)) {
      return;
    }

    const firstSelectableDay = getFirstSelectableDayInWeek(
      nextWeekStart,
      today,
      maxSelectableDate
    );

    setWeekStart(nextWeekStart);

    if (firstSelectableDay) {
      setSelectedDate(firstSelectableDay);
    }
  };

  const refreshSchedule = async () => {
    const data = await getClassSchedule(formatIsoDate(selectedDate));
    setScheduleItems(data);
  };

  const handleReserve = async (item) => {
    try {
      setBusyClassId(item.clubClassId);
      setErrorMessage("");

      const response = await createBooking({
        clubClassId: item.clubClassId,
        classDate: item.classDate,
      });

      await refreshSchedule();

      if (response.bookingStatus === "WAITLISTED") {
        setFeedbackMessage("You've been added to the waitlist");
        return;
      }

      setFeedbackMessage("Class booked successfully");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "We could not complete your booking.")
      );
    } finally {
      setBusyClassId(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;

    try {
      setBusyClassId(cancelTarget.clubClassId);
      setErrorMessage("");

      await cancelBooking({
        clubClassId: cancelTarget.clubClassId,
        classDate: cancelTarget.classDate,
      });

      setCancelTarget(null);
      await refreshSchedule();
      setFeedbackMessage("Reservation cancelled successfully");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "We could not cancel the reservation.")
      );
    } finally {
      setBusyClassId(null);
    }
  };

  const handleNotify = async (item) => {
    try {
      setBusyClassId(item.clubClassId);
      setErrorMessage("");

      await requestClassAvailabilityNotification(
        item.clubClassId,
        item.classDate
      );

      await refreshSchedule();
      setFeedbackMessage("We'll notify you when this class opens for booking");
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "We could not save the notification request.")
      );
    } finally {
      setBusyClassId(null);
    }
  };

  const getCalendarDayStateClassName = ({ day }) => {
    const selectable = isSelectableDate(day, today, maxSelectableDate);
    const isPast = day < today;
    const isToday = isSameDay(day, today);

    return [
      selectable ? "is-selectable" : "",
      isPast ? "is-past" : "",
      isToday ? "is-today" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return {
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
  };
}
