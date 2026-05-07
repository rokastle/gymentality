import iconLocationWhite from "../../assets/icons/icon_locationWhite_80x80.png";

export default function BookClassHeader({ clubName }) {
  return (
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
        Before then, tap "Notify me" to get a reminder when booking opens.
      </p>
    </header>
  );
}
