import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import IconImage from "../components/common/IconImage";
import ClassCard from "../components/classes/ClassCard";
import { clubs } from "../data/clubsData";

function getWrappedSlice(items, startIndex, count) {
  if (!items.length) {
    return [];
  }

  return Array.from({ length: Math.min(count, items.length) }, (_, index) => {
    return items[(startIndex + index) % items.length];
  });
}

export default function ClubDetailPage() {
  const { clubId } = useParams();

  const club = useMemo(() => {
    return clubs.find((item) => String(item.id) === clubId);
  }, [clubId]);

  const facilityItems = useMemo(() => {
    if (!club) {
      return [];
    }

    return club.facilities ?? [];
  }, [club]);

  const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(0);
  const [classStartIndex, setClassStartIndex] = useState(0);

  if (!club) {
    return <section className="gm-placeholder-page">CLUB NOT FOUND</section>;
  }

  const selectedFacility =
    facilityItems[selectedFacilityIndex] ?? facilityItems[0] ?? null;

  const visibleClasses = getWrappedSlice(club.classPreview, classStartIndex, 4);

  const handlePrevFacility = () => {
    setSelectedFacilityIndex((current) =>
      current === 0 ? facilityItems.length - 1 : current - 1
    );
  };

  const handleNextFacility = () => {
    setSelectedFacilityIndex((current) =>
      current === facilityItems.length - 1 ? 0 : current + 1
    );
  };

  const handlePrevClasses = () => {
    setClassStartIndex((current) =>
      current === 0 ? club.classPreview.length - 1 : current - 1
    );
  };

  const handleNextClasses = () => {
    setClassStartIndex((current) =>
      current === club.classPreview.length - 1 ? 0 : current + 1
    );
  };

  return (
    <>
      <section
        className="club-detail__hero"
        style={{ backgroundImage: `url(${club.image})` }}
      >
        <div className="club-detail__hero-overlay" aria-hidden="true" />

        <div className="gm-container club-detail__hero-container">
          <div className="club-detail__info-card">
            <h1 className="club-detail__info-title">{club.name}</h1>
            <p className="club-detail__info-city">{club.city}</p>

            <div className="club-detail__info-divider" />

            <div className="club-detail__info-list">
              <p>{club.phone}</p>
              <p>{club.address}</p>
              <p>{club.weekSchedule}</p>
              <p>{club.holidaySchedule}</p>
            </div>

            <div className="club-detail__social" aria-label="Social media">
              <a
                href="/"
                className="club-detail__social-link"
                aria-label="Instagram"
              >
                <IconImage
                  name="instagram"
                  alt="Instagram"
                  decorative={false}
                  className="club-detail__social-icon"
                />
              </a>

              <a href="/" className="club-detail__social-link" aria-label="X">
                <IconImage
                  name="x"
                  alt="X"
                  decorative={false}
                  className="club-detail__social-icon"
                />
              </a>

              <a
                href="/"
                className="club-detail__social-link"
                aria-label="YouTube"
              >
                <IconImage
                  name="youtube"
                  alt="YouTube"
                  decorative={false}
                  className="club-detail__social-icon"
                />
              </a>
            </div>

            <Link
              to={`/signup/membership?clubId=${club.id}`}
              className="gm-btn gm-btn--pill gm-btn--solid-yellow club-detail__membership-button"
            >
              MEMBERSHIP
            </Link>
          </div>

          <a
            href="#club-facilities"
            className="home-scroll-pill club-detail__scroll-pill"
          >
            SCROLL DOWN
          </a>
        </div>
      </section>

      <section
        id="club-facilities"
        className="club-detail__content gm-dark-section-bg"
      >
        <div className="gm-container">
          <section className="club-detail__facilities-section">
            <h2 className="club-detail__section-title">
              EXPLORE OUR
              <br />
              FACILITIES
            </h2>

            <div className="club-detail__facility-icons">
              {facilityItems.map((facility, index) => {
                const iconName =
                  index === selectedFacilityIndex
                    ? facility.focusIconName
                    : facility.iconName;

                return (
                  <button
                    key={facility.id}
                    type="button"
                    className="club-detail__facility-icon-button"
                    onClick={() => setSelectedFacilityIndex(index)}
                    aria-label={facility.name}
                  >
                    <IconImage
                      name={iconName}
                      alt={facility.name}
                      decorative={false}
                      className="club-detail__facility-icon"
                    />
                  </button>
                );
              })}
            </div>

            {selectedFacility && (
              <div className="club-detail__facility-showcase">
                <button
                  type="button"
                  className="club-detail__arrow club-detail__arrow--left"
                  onClick={handlePrevFacility}
                  aria-label="Previous facility"
                >
                  <IconImage
                    name="arrowYellow"
                    alt="Previous"
                    decorative={false}
                    className="club-detail__arrow-icon"
                  />
                </button>

                <div className="club-detail__facility-main">
                  <div className="club-detail__facility-image-wrapper">
                    <img
                      src={selectedFacility.image}
                      alt={selectedFacility.name}
                      className="club-detail__facility-image"
                    />
                  </div>

                  <h3 className="club-detail__facility-title">
                    {selectedFacility.name}
                  </h3>

                  <p className="club-detail__facility-description">
                    {selectedFacility.description}
                  </p>
                </div>

                <button
                  type="button"
                  className="club-detail__arrow club-detail__arrow--right"
                  onClick={handleNextFacility}
                  aria-label="Next facility"
                >
                  <IconImage
                    name="arrowYellow"
                    alt="Next"
                    decorative={false}
                    className="club-detail__arrow-icon"
                  />
                </button>
              </div>
            )}
          </section>

          <section className="club-detail__classes-section">
            <h2 className="club-detail__section-title">OUR CLASSES</h2>

            <div className="club-detail__classes-carousel">
              <button
                type="button"
                className="club-detail__arrow club-detail__arrow--left"
                onClick={handlePrevClasses}
                aria-label="Previous classes"
              >
                <IconImage
                  name="arrowYellow"
                  alt="Previous"
                  decorative={false}
                  className="club-detail__arrow-icon"
                />
              </button>

              <div className="club-detail__classes-grid">
                {visibleClasses.map((gymClass) => (
                  <ClassCard
                    key={`${club.id}-${gymClass.id}`}
                    title={gymClass.title}
                    category={gymClass.category}
                    image={gymClass.image}
                  />
                ))}
              </div>

              <button
                type="button"
                className="club-detail__arrow club-detail__arrow--right"
                onClick={handleNextClasses}
                aria-label="Next classes"
              >
                <IconImage
                  name="arrowYellow"
                  alt="Next"
                  decorative={false}
                  className="club-detail__arrow-icon"
                />
              </button>
            </div>
          </section>

          <section className="club-detail__reviews-section">
            <h2 className="club-detail__section-title">GOOGLE REVIEWS</h2>

            <div className="club-detail__reviews-placeholder">
              GA4 reviews section — next step
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
