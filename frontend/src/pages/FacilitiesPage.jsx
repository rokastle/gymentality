import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClubDetailCard from "../components/facilities/ClubDetailCard";
import { clubs, cities } from "../data/clubsData";

export default function FacilitiesPage() {
  const navigate = useNavigate();

  const defaultCity = cities[0] ?? "";

  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedClubId, setSelectedClubId] = useState("");

  const [appliedCity, setAppliedCity] = useState(defaultCity);
  const [appliedClubId, setAppliedClubId] = useState("");

  const clubsForSelectedCity = useMemo(() => {
    if (!selectedCity) {
      return clubs;
    }

    return clubs.filter((club) => club.city === selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const selectedClubStillVisible = clubsForSelectedCity.some(
      (club) => String(club.id) === String(selectedClubId)
    );

    if (!selectedClubStillVisible) {
      setSelectedClubId("");
    }
  }, [clubsForSelectedCity, selectedClubId]);

  const visibleClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesCity = !appliedCity || club.city === appliedCity;
      const matchesClub =
        !appliedClubId || String(club.id) === String(appliedClubId);

      return matchesCity && matchesClub;
    });
  }, [appliedCity, appliedClubId]);

  const handleApplyFilters = () => {
    setAppliedCity(selectedCity);
    setAppliedClubId(selectedClubId);

    if (selectedClubId) {
      navigate(`/facilities/${selectedClubId}`);
    }
  };

  const handleCardClick = (clubId) => {
    navigate(`/facilities/${clubId}`);
  };

  return (
    <section className="facilities-page gm-dark-section-bg">
      <div className="gm-container facilities-page__container">
        <header className="facilities-page__header">
          <div className="facilities-page__heading-block">
            <h1 className="facilities-page__title">FACILITIES</h1>
            <p className="facilities-page__subtitle">
              Explore each club and discover the spaces designed for every type of training.
            </p>
          </div>

          <div className="facilities-page__filters" aria-label="Facilities filters">
            <label className="facilities-page__filter">
              <span className="facilities-page__filter-label">City</span>
              <select
                className="facilities-page__select"
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                aria-label="Filter facilities by city"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="facilities-page__filter">
              <span className="facilities-page__filter-label">Club</span>
              <select
                className="facilities-page__select"
                value={selectedClubId}
                onChange={(event) => setSelectedClubId(event.target.value)}
                aria-label="Filter facilities by club"
              >
                <option value="">All clubs</option>
                {clubsForSelectedCity.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.address}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow facilities-page__filter-button"
              onClick={handleApplyFilters}
              aria-label="Apply filters"
            >
              FILTER
            </button>
          </div>
        </header>

        {visibleClubs.length > 0 ? (
          <div className="facilities-page__results">
            <div className="facilities-page__results-top">
              <p className="facilities-page__results-count">
                {visibleClubs.length} club{visibleClubs.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="facilities-page__grid">
              {visibleClubs.map((club) => (
                <ClubDetailCard
                  key={club.id}
                  club={club}
                  onClick={() => handleCardClick(club.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="facilities-page__empty" role="status">
            <p className="facilities-page__empty-text">
              No facilities available for the selected filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}