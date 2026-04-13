import { Link } from "react-router-dom";
import IconImage from "../common/IconImage";

export default function Footer() {
  return (
    <footer className="gm-footer">
      <div className="gm-container gm-footer__content">
        <div className="gm-footer__top">
          <section className="gm-footer__newsletter" aria-labelledby="footer-newsletter-title">
            <h2
              id="footer-newsletter-title"
              className="gm-footer__newsletter-title"
            >
              Subscribe to our
              <br />
              Newsletter.
            </h2>

            <form className="gm-footer__form">
              <div className="gm-footer__input-wrapper">
                <input
                  type="email"
                  name="email"
                  className="gm-footer__input"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  autoComplete="email"
                />

                <button
                  type="submit"
                  className="gm-footer__submit"
                  aria-label="Submit email"
                >
                  <span className="gm-footer__submit-arrow">→</span>
                </button>
              </div>

              <label className="gm-footer__checkbox">
                <input type="checkbox" />
                <span>
                  I agree to receive communications in accordance with the
                  Privacy Policy*
                </span>
              </label>

              <p className="gm-footer__legal-text">
                By joining, you agree to receive communications from the blog
                and commercial communications from GO fit. Your data will not be
                shared with third parties, except where there is a legal
                obligation to do so. You may withdraw your consent at any time.
                For further information, please see: &quot;Online Policies&quot;
              </p>
            </form>

            <button
              type="button"
              className="gm-btn gm-btn--pill gm-btn--outline-yellow gm-footer__contact-btn"
            >
              CONTACT US
            </button>
          </section>

          <div className="gm-footer__links-area">
            <nav className="gm-footer__column" aria-labelledby="footer-about-title">
              <h3 id="footer-about-title" className="gm-footer__heading">
                ABOUT US
              </h3>

              <div className="gm-footer__links-list">
                <Link to="/clubs">Locations</Link>
                <Link to="/membership">Membership</Link>
                <Link to="/workout">Workout</Link>
                <Link to="/facilities">Facilities</Link>
                <Link to="/classes">Classes</Link>
              </div>
            </nav>

            <nav className="gm-footer__column" aria-labelledby="footer-faq-title">
              <h3 id="footer-faq-title" className="gm-footer__heading">
                FAQ
              </h3>

              <div className="gm-footer__links-list">
                <a href="/">Invite a Friend</a>
                <a href="/">Download the App</a>
              </div>
            </nav>

            <nav className="gm-footer__column" aria-labelledby="footer-legal-title">
              <h3 id="footer-legal-title" className="gm-footer__heading">
                LEGAL PAGES
              </h3>

              <div className="gm-footer__links-list">
                <a href="/">Cookie Policy</a>
                <a href="/">Privacy Policy</a>
                <a href="/">Terms & Conditions</a>
                <a href="/">GYM Rules</a>
              </div>
            </nav>
          </div>
        </div>

        <div className="gm-footer__bottom">
          <div className="gm-footer__bottom-spacer" />

          <div className="gm-footer__social" aria-label="Social media">
            <a
              href="/"
              className="gm-footer__social-link"
              aria-label="Instagram"
            >
              <IconImage
                name="instagram"
                className="gm-footer__social-icon"
                decorative
                size={44}
              />
            </a>

            <a href="/" className="gm-footer__social-link" aria-label="X">
              <IconImage
                name="x"
                className="gm-footer__social-icon"
                decorative
                size={44}
              />
            </a>

            <a
              href="/"
              className="gm-footer__social-link"
              aria-label="YouTube"
            >
              <IconImage
                name="youtube"
                className="gm-footer__social-icon"
                decorative
                size={44}
              />
            </a>
          </div>

          <p className="gm-footer__copyright">
            2026 GYMENTALITY All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}