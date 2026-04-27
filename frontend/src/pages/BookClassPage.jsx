import { Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import WeeklyCalendar from "../components/common/WeeklyCalendar";
import {
    getStartOfDay,
    addDays,
    isSameDay,
    getWeekStart,
    buildWeekDays,
    formatMonthTitle,
    formatIsoDate,
} from "../utils/calendarDateUtils";
import {
    cancelBooking,
    createBooking,
    getClassSchedule,
    requestClassAvailabilityNotification,
} from "../services/bookingService";
import getClassImageByName from "../utils/getClassImageByName";
import iconLocationWhite from "../assets/icons/icon_locationWhite_80x80.png";
import iconScheduleWhite from "../assets/icons/icon_scheduleWhite_80x80.png";
import iconGroupClass from "../assets/icons/icon_groupClass_180x180.png";
import iconSandClock from "../assets/icons/icon_sandClock_180x180.png";
import iconLockWhite from "../assets/icons/icon_lockWhite_180x180.png";
import iconNotificationBlack from "../assets/icons/icon_notificationBlack_180x180.png";
import iconArrowYellow from "../assets/icons/icon_arrowYellow_180x180.png";

const WEEKDAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const CATEGORY_LABELS = {
    AQUA: "Aqua",
    BODY_AND_MIND: "Body & Mind",
    CARDIO: "Cardio",
    DANCE: "Dance",
    EXPRESS: "Express",
    FUNCTIONAL: "Functional",
    STRENGTH: "Strength",
};

function formatPrettyTime(timeText = "00:00") {
    return timeText.slice(0, 5);
}

function addOneHour(timeText = "00:00") {
    const [hour, minute] = timeText.split(":").map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    date.setHours(date.getHours() + 1);

    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function formatBookingOpensAt(bookingOpensAt) {
    const date = new Date(bookingOpensAt);
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function getCardMeta(item) {
    const categoryLabel = CATEGORY_LABELS[item.category] || item.category;
    return `${categoryLabel} (1 hour)`;
}

function isSelectableDate(date, today, maxSelectableDate) {
    return date >= today && date <= maxSelectableDate;
}

function weekHasSelectableDates(weekStart, today, maxSelectableDate) {
    return buildWeekDays(weekStart).some((day) =>
        isSelectableDate(day, today, maxSelectableDate)
    );
}

function getFirstSelectableDayInWeek(weekStart, today, maxSelectableDate) {
    return buildWeekDays(weekStart).find((day) =>
        isSelectableDate(day, today, maxSelectableDate)
    );
}

function FeedbackModal({ open, message, onClose }) {
    if (!open) return null;

    return (
        <div className="book-class-page__modal-overlay" role="presentation">
            <div
                className="book-class-page__modal"
                role="dialog"
                aria-modal="true"
                aria-label="Booking feedback"
            >
                <p className="book-class-page__modal-message">{message}</p>

                <button
                    type="button"
                    className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__modal-btn"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
}

function ConfirmCancelModal({ open, onConfirm, onClose }) {
    if (!open) return null;

    return (
        <div className="book-class-page__modal-overlay" role="presentation">
            <div
                className="book-class-page__modal"
                role="dialog"
                aria-modal="true"
                aria-label="Cancel reservation"
            >
                <p className="book-class-page__modal-message">
                    Are you sure you want to cancel the reservation?
                </p>

                <div className="book-class-page__modal-actions">
                    <button
                        type="button"
                        className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__modal-btn"
                        onClick={onConfirm}
                    >
                        YES
                    </button>

                    <button
                        type="button"
                        className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__modal-btn"
                        onClick={onClose}
                    >
                        NO
                    </button>
                </div>
            </div>
        </div>
    );
}

function BookingCard({ item, isBusy, onReserve, onCancel, onNotify }) {
    const imageSrc = getClassImageByName(item.className);
    const startTime = formatPrettyTime(item.startTime);
    const endTime = addOneHour(item.startTime);

    const isBooked = item.state === "BOOKED";
    const isAvailable = item.state === "AVAILABLE";
    const isFullWaitlistAvailable = item.state === "FULL_WAITLIST_AVAILABLE";
    const isWaitlisted = item.state === "WAITLISTED";
    const isBookingNotOpen = item.state === "BOOKING_NOT_OPEN";

    function renderPrimaryAction() {
        if (isBooked) {
            return (
                <button
                    type="button"
                    className="gm-btn gm-btn--pill gm-btn--outline-danger book-class-page__action-btn"
                    onClick={() => onCancel(item)}
                    disabled={isBusy}
                >
                    CANCEL RESERVATION
                </button>
            );
        }

        if (isAvailable) {
            return (
                <button
                    type="button"
                    className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__action-btn"
                    onClick={() => onReserve(item)}
                    disabled={isBusy}
                >
                    RESERVE
                </button>
            );
        }

        if (isFullWaitlistAvailable) {
            return (
                <button
                    type="button"
                    className="gm-btn gm-btn--pill gm-btn--outline-yellow book-class-page__action-btn"
                    onClick={() => onReserve(item)}
                    disabled={isBusy}
                >
                    SIGN UP TO THE WAITING LIST
                </button>
            );
        }

        if (isWaitlisted) {
            return (
                <span className="book-class-page__waiting-badge gm-pill gm-pill--outline-yellow">
                    WAITING
                </span>
            );
        }

        if (isBookingNotOpen) {
            if (item.notifyRequested) {
                return (
                    <span className="book-class-page__notify-info gm-pill gm-pill--outline-locked">
                        <img
                            src={iconNotificationBlack}
                            alt=""
                            className="book-class-page__icon book-class-page__icon--notify book-class-page__icon--notify-info"
                        />
                        NOTIFIED
                    </span>
                );
            }

            return (
                <button
                    type="button"
                    className="gm-btn gm-btn--pill gm-btn--solid-yellow book-class-page__notify-btn"
                    onClick={() => onNotify(item)}
                    disabled={isBusy}
                >
                    <img
                        src={iconNotificationBlack}
                        alt=""
                        className="book-class-page__icon book-class-page__icon--notify"
                    />
                    NOTIFY ME
                </button>
            );
        }

        return null;
    }

    return (
        <article className="book-class-page__card gm-surface-card">
            <div className="book-class-page__card-image-wrapper">
                <img
                    src={imageSrc}
                    alt={item.className}
                    className="book-class-page__card-image"
                />
            </div>

            <div className="book-class-page__card-content">
                <div className="book-class-page__card-top">
                    <div className="book-class-page__card-main">
                        <h3 className="book-class-page__card-title">{item.className}</h3>
                        <p className="book-class-page__card-meta">{getCardMeta(item)}</p>

                        <div className="book-class-page__card-time">
                            <img
                                src={iconScheduleWhite}
                                alt=""
                                className="book-class-page__icon book-class-page__icon--time"
                            />
                            <span>
                                {startTime} - {endTime}
                            </span>
                        </div>
                    </div>

                    <div className="book-class-page__card-actions">
                        {renderPrimaryAction()}
                    </div>
                </div>

                <div className="book-class-page__card-divider" />

                <div className="book-class-page__card-footer">
                    <div className="book-class-page__card-footer-main">
                        <div className="book-class-page__card-stat">
                            <img
                                src={iconGroupClass}
                                alt=""
                                className="book-class-page__icon book-class-page__icon--stat"
                            />
                            <span>
                                Available spots: {item.availableSpots} / {item.capacity}
                            </span>
                        </div>

                        {isFullWaitlistAvailable && (
                            <div className="book-class-page__card-stat">
                                <img
                                    src={iconSandClock}
                                    alt=""
                                    className="book-class-page__icon book-class-page__icon--stat"
                                />
                                <span>Waiting list available</span>
                            </div>
                        )}

                        {isWaitlisted && (
                            <div className="book-class-page__card-stat">
                                <img
                                    src={iconSandClock}
                                    alt=""
                                    className="book-class-page__icon book-class-page__icon--stat"
                                />
                                <span>Ahead of you: {item.myWaitlistPosition ?? "-"}</span>
                            </div>
                        )}
                    </div>

                    {isBookingNotOpen && (
                        <div className="book-class-page__card-footer-side">
                            <div className="book-class-page__booking-opens-info book-class-page__card-stat">
                                <img
                                    src={iconLockWhite}
                                    alt=""
                                    className="book-class-page__icon book-class-page__icon--lock"
                                />
                                <span>Booking opens at {formatBookingOpensAt(item.bookingOpensAt)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function BookClassPage() {
    const { user, isAuthenticated, isInitializing } = useAuth();

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
                        error?.response?.data?.message ||
                        error?.response?.data ||
                        "We could not load the class schedule."
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

    if (isInitializing) {
        return null;
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/" replace />;
    }

    const clubName =
        user?.clubName?.trim() ||
        scheduleItems[0]?.clubName ||
        "GYMENTALITY CLUB";

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
                error?.response?.data?.message ||
                error?.response?.data ||
                "We could not complete your booking."
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
                error?.response?.data?.message ||
                error?.response?.data ||
                "We could not cancel the reservation."
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
            setFeedbackMessage("We’ll notify you when this class opens for booking");
        } catch (error) {
            setErrorMessage(
                error?.response?.data?.message ||
                error?.response?.data ||
                "We could not save the notification request."
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

    return (
        <section className="book-class-page gm-dark-section-bg">
            <div className="gm-container book-class-page__container">
                <header className="book-class-page__header">
                    <div className="book-class-page__club">
                        <img
                            src={iconLocationWhite}
                            alt=""
                            className="book-class-page__club-icon"
                        />

                        <h1 className="book-class-page__club-title">{clubName}</h1>
                    </div>

                    <p className="book-class-page__booking-policy">
                        You can see classes up to 7 days in advance.
                        <br />
                        Reservations open 48 hours before each class starts.
                        <br />
                        Before then, tap “Notify me” to get a reminder when booking opens.
                    </p>
                </header>

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
                        weekdayLabels={WEEKDAY_LABELS}
                    />

                    <div className="book-class-page__list">
                        {isLoading && (
                            <div className="book-class-page__empty">Loading classes…</div>
                        )}

                        {!isLoading && errorMessage && (
                            <div className="book-class-page__empty">{errorMessage}</div>
                        )}

                        {!isLoading && !errorMessage && scheduleItems.length === 0 && (
                            <div className="book-class-page__empty">
                                No classes available for the selected day.
                            </div>
                        )}

                        {!isLoading &&
                            !errorMessage &&
                            scheduleItems.map((item) => (
                                <BookingCard
                                    key={`${item.clubClassId}-${item.classDate}`}
                                    item={item}
                                    isBusy={busyClassId === item.clubClassId}
                                    onReserve={handleReserve}
                                    onCancel={setCancelTarget}
                                    onNotify={handleNotify}
                                />
                            ))}
                    </div>
                </div>
            </div>

            <FeedbackModal
                open={Boolean(feedbackMessage)}
                message={feedbackMessage}
                onClose={() => setFeedbackMessage("")}
            />

            <ConfirmCancelModal
                open={Boolean(cancelTarget)}
                onConfirm={handleConfirmCancel}
                onClose={() => setCancelTarget(null)}
            />
        </section>
    );
}