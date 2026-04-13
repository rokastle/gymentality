import { Link } from "react-router-dom";

export default function ClubDetailCard({ club }) {
  return (
    <Link to={`/facilities/${club.id}`} className="club-detail-card">
      <div className="club-detail-card__image-wrapper">
        <img
          src={club.image}
          alt={club.name}
          className="club-detail-card__image"
        />
      </div>

      <div className="club-detail-card__body">
        <h2 className="club-detail-card__title">
          <span>{club.brand}</span>
          <span>{club.shortName}</span>
        </h2>

        <p className="club-detail-card__address">{club.address}</p>
      </div>
    </Link>
  );
}