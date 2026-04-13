import { Link } from "react-router-dom";

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="clubs-page__info-icon" aria-hidden="true">
      <path
        d="M6.6 10.8a15.8 15.8 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.36 2.3.54 3.5.54a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.5 21 3 13.5 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.18 2.4.54 3.5a1 1 0 0 1-.24 1l-2.2 2.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="clubs-page__info-icon" aria-hidden="true">
      <path
        d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9.5A2.5 2.5 0 1 1 12 7a2.5 2.5 0 0 1 0 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="clubs-page__info-icon" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm1-10.4V7h-2v5.4l3.8 2.3 1-1.7-2.8-1.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ClubSearchItem({ club, isSelected, onSelect }) {
  return (
    <article
      className={`clubs-page__club-item ${isSelected ? "is-selected" : ""}`}
      onClick={() => onSelect(club.id)}
    >
      <div className="clubs-page__club-main">
        <h2 className="clubs-page__club-name">{club.name}</h2>
        <p className="clubs-page__club-city">{club.city}</p>

        <div className="clubs-page__club-line">
          <PhoneIcon />
          <span>{club.phone}</span>
        </div>

        <div className="clubs-page__club-line">
          <PinIcon />
          <span>{club.address}</span>
        </div>

        <div className="clubs-page__club-line clubs-page__club-line--schedule">
          <ClockIcon />
          <div>
            <p>{club.weekSchedule}</p>
            <p>{club.holidaySchedule}</p>
          </div>
        </div>
      </div>

      <div className="clubs-page__club-actions">
        <Link
          to={`/facilities/${club.id}`}
          className="gm-btn gm-btn--pill gm-btn--outline-yellow clubs-page__club-button"
          onClick={(event) => event.stopPropagation()}
        >
          VIEW CLUB
        </Link>

        <Link
          to={`/signup/membership?clubId=${club.id}`}
          className="gm-btn gm-btn--pill gm-btn--solid-yellow clubs-page__club-button"
          onClick={(event) => event.stopPropagation()}
        >
          JOIN NOW
        </Link>
      </div>
    </article>
  );
}