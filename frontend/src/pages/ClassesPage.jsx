import { useEffect, useMemo, useState } from "react";
import ClassCard from "../components/classes/ClassCard";
import {
  classesData,
  availableCities,
  availableClubs,
  classCategories,
} from "../data/classesData";

const classOrder = [
  "Total Body",
  "Fitball",
  "GAP",
  "Dumbbells",
  "Crossfit",
  "Step Functional",
  "Hybrid",
  "Boxing",
  "Jumping",
  "Spinning",
  "Elliptical",
  "Core Express",
  "HIIT Express",
  "Motriz Express",
  "Yoga",
  "Pilates",
  "Zen",
  "Zumba",
  "Aerobics",
  "Dance",
  "Swimming",
  "Aquafitness",
  "Pool Functional",
  "Aquaboard",
];

function getUniqueClassesByKey(items) {
  const seen = new Set();

  return items.filter((item) => {
    const uniqueKey = item.classKey || item.title;

    if (seen.has(uniqueKey)) {
      return false;
    }

    seen.add(uniqueKey);
    return true;
  });
}

function sortClasses(items) {
  return [...items].sort((a, b) => {
    const indexA = classOrder.indexOf(a.title);
    const indexB = classOrder.indexOf(b.title);

    if (indexA === -1 && indexB === -1) {
      return a.title.localeCompare(b.title);
    }

    if (indexA === -1) {
      return 1;
    }

    if (indexB === -1) {
      return -1;
    }

    return indexA - indexB;
  });
}

export default function ClassesPage() {
  const defaultCity = availableCities[0] ?? "";

  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedClubId, setSelectedClubId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [appliedCity, setAppliedCity] = useState(defaultCity);
  const [appliedClubId, setAppliedClubId] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("");

  const clubsForSelectedCity = useMemo(() => {
    if (!selectedCity) {
      return availableClubs;
    }

    return availableClubs.filter((club) => club.city === selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const selectedClubStillVisible = clubsForSelectedCity.some(
      (club) => String(club.id) === String(selectedClubId)
    );

    if (!selectedClubStillVisible) {
      setSelectedClubId("");
    }
  }, [clubsForSelectedCity, selectedClubId]);

  const visibleClasses = useMemo(() => {
    const filtered = classesData.filter((gymClass) => {
      const matchesCity = !appliedCity || gymClass.city === appliedCity;
      const matchesClub =
        !appliedClubId || String(gymClass.clubId) === String(appliedClubId);
      const matchesCategory =
        !appliedCategory || gymClass.category === appliedCategory;

      return matchesCity && matchesClub && matchesCategory;
    });

    const deduplicated = !appliedClubId
      ? getUniqueClassesByKey(filtered)
      : filtered;

    return sortClasses(deduplicated);
  }, [appliedCity, appliedClubId, appliedCategory]);

  const handleApplyFilters = () => {
    setAppliedCity(selectedCity);
    setAppliedClubId(selectedClubId);
    setAppliedCategory(selectedCategory);
  };

  return (
    <section className="classes-page gm-dark-section-bg">
      <div className="gm-container classes-page__container">
        <header className="classes-page__header">
          <div className="classes-page__heading-block">
            <h1 className="classes-page__title">CLASSES</h1>
            <p className="classes-page__subtitle">
              Find the activity that matches your pace, your goals, and your club.
            </p>
          </div>

          <div className="classes-page__filters" aria-label="Classes filters">
            <label className="classes-page__filter">
              <span className="classes-page__filter-label">City</span>
              <select
                className="classes-page__select"
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                aria-label="Filter classes by city"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label className="classes-page__filter">
              <span className="classes-page__filter-label">Club</span>
              <select
                className="classes-page__select"
                value={selectedClubId}
                onChange={(event) => setSelectedClubId(event.target.value)}
                aria-label="Filter classes by club"
              >
                <option value="">All classes</option>
                {clubsForSelectedCity.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.address}
                  </option>
                ))}
              </select>
            </label>

            <label className="classes-page__filter">
              <span className="classes-page__filter-label">Type activity</span>
              <select
                className="classes-page__select"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                aria-label="Filter classes by activity type"
              >
                <option value="">All activities</option>
                {classCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--solid-yellow classes-page__filter-button"
              onClick={handleApplyFilters}
              aria-label="Apply filters"
            >
              FILTER
            </button>
          </div>
        </header>

        {visibleClasses.length > 0 ? (
          <div className="classes-page__results">
            <div className="classes-page__results-top">
              <p className="classes-page__results-count">
                {visibleClasses.length} class
                {visibleClasses.length !== 1 ? "es" : ""} found
              </p>
            </div>

            <div className="classes-page__grid">
              {visibleClasses.map((gymClass) => (
                <ClassCard
                  key={`${gymClass.classKey || gymClass.title}-${
                    gymClass.clubId || "all"
                  }-${gymClass.category}`}
                  title={gymClass.title}
                  category={gymClass.category}
                  image={gymClass.image}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="classes-page__empty" role="status">
            <p className="classes-page__empty-text">
              No classes available for the selected filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}