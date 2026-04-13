import { useMemo, useState } from "react";
import ClubSearchMap from "../components/clubs/ClubSearchMap";
import ClubSearchItem from "../components/clubs/ClubSearchItem";
import { clubs, malagaMapCenter, malagaMapZoom } from "../data/clubsData";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="clubs-page__toolbar-icon" aria-hidden="true">
      <path
        d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0-2a8.5 8.5 0 1 0 5.3 15.2l4 4 1.4-1.4-4-4A8.5 8.5 0 0 0 10.5 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="clubs-page__toolbar-icon" aria-hidden="true">
      <path
        d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9.5A2.5 2.5 0 1 1 12 7a2.5 2.5 0 0 1 0 5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function normalizeValue(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function clubMatchesQuery(club, query) {
  const normalizedQuery = normalizeValue(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    club.name,
    club.shortName,
    club.city,
    club.address,
  ];

  return searchableValues.some((value) =>
    normalizeValue(value).includes(normalizedQuery)
  );
}

export default function ClubsPage() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

  const [searchValue, setSearchValue] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const visibleClubs = useMemo(() => {
    return appliedQuery
      ? clubs.filter((club) => clubMatchesQuery(club, appliedQuery))
      : clubs;
  }, [appliedQuery]);

  const handleSelectClub = (clubId) => {
    setSelectedClubId(clubId);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const normalizedQuery = normalizeValue(searchValue);

    if (!normalizedQuery) {
      setAppliedQuery("");
      setSelectedClubId(null);
      return;
    }

    const matches = clubs.filter((club) => clubMatchesQuery(club, normalizedQuery));

    if (!matches.length) {
      setIsErrorModalOpen(true);
      return;
    }

    setAppliedQuery(searchValue);
    setSelectedClubId(matches[0].id);
  };

  const handleResetSearch = () => {
    setSearchValue("");
    setAppliedQuery("");
    setSelectedClubId(null);
    setIsErrorModalOpen(false);
  };

  return (
    <section className="clubs-page">
      <ClubSearchMap
        apiKey={apiKey}
        clubs={clubs}
        selectedClubId={selectedClubId}
        defaultCenter={malagaMapCenter}
        defaultZoom={malagaMapZoom}
        onClubSelect={handleSelectClub}
      />

      <div className="clubs-page__overlay">
        <div className="clubs-page__panel">
          <form className="clubs-page__search" onSubmit={handleSearch}>
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by club, city or address"
              className="clubs-page__search-input"
            />

            <div className="clubs-page__search-actions">
              <button
                type="submit"
                className="clubs-page__search-button"
                aria-label="Search club"
              >
                <SearchIcon />
              </button>

              <button
                type="button"
                className="clubs-page__search-button"
                aria-label="Show all clubs in Málaga"
                onClick={handleResetSearch}
              >
                <LocationIcon />
              </button>
            </div>
          </form>

          <div className="clubs-page__results">
            {visibleClubs.map((club) => (
              <ClubSearchItem
                key={club.id}
                club={club}
                isSelected={String(club.id) === String(selectedClubId)}
                onSelect={handleSelectClub}
              />
            ))}
          </div>
        </div>
      </div>

      {isErrorModalOpen && (
        <div className="clubs-page__modal-backdrop">
          <div className="clubs-page__modal">
            <p className="clubs-page__modal-text">
              City or address not found. Please enter a valid location.
            </p>

            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow clubs-page__modal-button"
              onClick={() => setIsErrorModalOpen(false)}
            >
              TRY AGAIN
            </button>
          </div>
        </div>
      )}
    </section>
  );
}