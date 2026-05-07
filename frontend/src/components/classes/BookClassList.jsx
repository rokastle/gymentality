import BookingCard from "./BookingCard";

export default function BookClassList({
  busyClassId,
  errorMessage,
  isLoading,
  onCancel,
  onNotify,
  onReserve,
  scheduleItems,
}) {
  if (isLoading) {
    return <div className="book-class-page__empty">Loading classes...</div>;
  }

  if (errorMessage) {
    return <div className="book-class-page__empty">{errorMessage}</div>;
  }

  if (scheduleItems.length === 0) {
    return (
      <div className="book-class-page__empty">
        No classes available for the selected day.
      </div>
    );
  }

  return scheduleItems.map((item) => (
    <BookingCard
      key={`${item.clubClassId}-${item.classDate}`}
      item={item}
      isBusy={busyClassId === item.clubClassId}
      onReserve={onReserve}
      onCancel={onCancel}
      onNotify={onNotify}
    />
  ));
}
