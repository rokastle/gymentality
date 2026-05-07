import { useEffect } from "react";
import { Link } from "react-router-dom";
import IconImage from "../components/common/IconImage";

const principles = [
  {
    number: "1º",
    title: "DISCIPLINE",
    description: "Build consistent habits.",
  },
  {
    number: "2º",
    title: "CONSISTENCY",
    description: "Stay committed every day.",
  },
  {
    number: "3º",
    title: "EFFORT",
    description: "Give your best in every session.",
  },
  {
    number: "4º",
    title: "PROGRESS",
    description: "Push past your personal limits.",
  },
  {
    number: "5º",
    title: "RESULT",
    description: "Turn effort into real achievements.",
  },
];

const benefits = [
  {
    title: "NO MEMBERSHIP COMMITMENT",
    description: "Enjoy flexibility with no long-term contracts",
    iconName: "commitmentFocus",
    alt: "No membership commitment",
  },
  {
    title: "GUIDED CLASSES",
    description: "Expert-led sessions to keep you motivated",
    iconName: "guidedClassesAreaFocus",
    alt: "Guided classes",
  },
  {
    title: "ADVANCED STRENGTH EQUIPMENT",
    description: "Train with the latest machines for optimal result",
    iconName: "strengthEquipmentAreaFocus",
    alt: "Advanced strength equipment",
  },
  {
    title: "PERSONAL TRAINING",
    description: "Customized workout designed to reach your goals",
    iconName: "personalTrainingFocus",
    alt: "Personal training",
  },
];

const Accent = ({ children }) => <span className="gm-accent">{children}</span>;

const TypeRevealLine = ({ children, className = "", delay = 0 }) => (
  <span
    className={`home-type-line ${className}`}
    style={{ "--typing-delay": `${delay}ms` }}
  >
    <span>{children}</span>
  </span>
);

export default function HomePage() {
  useEffect(() => {
    const animatedElements = document.querySelectorAll("[data-home-animate]");
    let lastScrollY = window.scrollY;

    const observer = new IntersectionObserver(
      (entries) => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY >= lastScrollY;

        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.28 &&
            isScrollingDown
          ) {
            entry.target.classList.add("is-visible");
          } else if (
            !entry.isIntersecting &&
            !isScrollingDown &&
            entry.boundingClientRect.top > 0
          ) {
            entry.target.classList.remove("is-visible");
          }
        });

        lastScrollY = currentScrollY;
      },
      {
        threshold: [0, 0.08, 0.28, 0.5],
        rootMargin: "0px 0px -10% 0px",
      },
    );

    animatedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero home-full-section">
        <div className="home-hero__overlay" aria-hidden="true" />

        <div className="gm-container home-hero__content">
          <h1 className="home-hero__title">
            <Accent>DISCIPLINE</Accent> AND
            <br />
            <Accent>CONSISTENCY</Accent>
            <br />
            TURN EFFORT <Accent>INTO RESULT</Accent>
          </h1>
        </div>

        <a href="#home-overview" className="home-scroll-pill">
          SCROLL DOWN
        </a>
      </section>

      <section
        id="home-overview"
        className="home-overview home-story home-full-section gm-dark-section-bg"
        data-home-animate
      >
        <div className="gm-container home-section__inner">
          <p className="home-overview__eyebrow">
            <TypeRevealLine>
              AT <Accent>GYMENTALITY</Accent>
            </TypeRevealLine>
          </p>

          <h2 className="home-overview__title">
            <TypeRevealLine delay={850}>
              EVERY WORKOUT BUILDS
            </TypeRevealLine>
            <TypeRevealLine delay={1950}>
              <Accent>MENTAL TOUGHNESS</Accent>,
            </TypeRevealLine>
            <TypeRevealLine delay={3050}>
              HONES <Accent>DISCIPLINE</Accent>,
            </TypeRevealLine>
            <TypeRevealLine delay={4150}>
              AND DRIVES <Accent>PROGRESS</Accent>
            </TypeRevealLine>
            <TypeRevealLine delay={5250}>
              WHILE <Accent>PUSHING LIMITS</Accent>.
            </TypeRevealLine>
          </h2>
        </div>
      </section>

      <section
        className="home-principles-section home-full-section gm-dark-section-bg"
        data-home-animate
      >
        <div className="gm-container home-section__inner">
          <div className="home-principles">
            {principles.map((item, index) => (
              <div
                key={item.title}
                className="home-principle"
                style={{ "--principle-delay": `${index * 160}ms` }}
              >
                <div className="home-principle__title">
                  <span>{item.number}</span> {item.title}
                </div>
                <p className="home-principle__description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="home-offer-section home-full-section gm-dark-section-bg"
        data-home-animate
      >
        <div className="gm-container home-section__inner">
          <div className="home-price-card gm-surface-card">
            <div className="home-price-card__left">
              <p className="home-price-card__label">STARTING THIS FEBRUARY</p>
              <div className="home-price-card__price">39.99€</div>
            </div>

            <div className="home-price-card__right">
              <Link
                to="/clubs"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow home-price-card__cta"
              >
                JOIN NOW
              </Link>
              <p className="home-price-card__included">REGISTRATION INCLUDED</p>
            </div>
          </div>

          <div className="home-benefits">
            {benefits.map(({ title, description, iconName, alt }, index) => (
              <article
                key={title}
                className="home-benefit"
                style={{ "--benefit-delay": `${520 + index * 140}ms` }}
              >
                <div className="home-benefit__icon">
                  <IconImage
                    name={iconName}
                    alt={alt}
                    decorative={false}
                    size={180}
                    className="home-benefit__icon-image"
                  />
                </div>

                <div className="home-benefit__content">
                  <h3 className="home-benefit__title">{title}</h3>
                  <p className="home-benefit__description">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
