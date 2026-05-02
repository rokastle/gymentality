import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import gymentalityLogo from "../../assets/logo/logo_gymentality.png";
import IconImage from "../common/IconImage";
import AuthDrawer from "../auth/AuthDrawer";

const navLinks = [
  { to: "/clubs", label: "CLUBES" },
  { to: "/membership", label: "MEMBERSHIP" },
  { to: "/workout", label: "WORKOUT" },
  { to: "/facilities", label: "FACILITIES" },
  { to: "/classes", label: "CLASSES" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userFirstName = user?.firstName?.trim() || user?.name?.trim() || "USER";

  const handleOpenUserMenu = () => {
    setIsUserMenuOpen(true);
  };

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const handleJoinNowClick = () => {
    setIsUserMenuOpen(false);
    navigate("/clubs");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleNavClick = () => {
    setIsUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <>
      <header className="gm-navbar">
        <div className="gm-container gm-navbar__inner">
          <Link
            to="/"
            className="gm-logo"
            onClick={handleNavClick}
            aria-label="Ir a la página principal de Gymentality"
          >
            <img
              src={gymentalityLogo}
              alt="Gymentality"
              className="gm-logo__image"
            />
          </Link>

          <nav className="gm-navbar__nav" aria-label="Navegación principal">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `gm-navbar__link ${isActive ? "is-active" : ""}`
                }
                onClick={handleNavClick}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="gm-navbar__actions">
            <button
              type="button"
              className="gm-icon-btn"
              aria-label="Abrir menú de usuario"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="dialog"
              onClick={handleOpenUserMenu}
            >
              <IconImage
                name="profile"
                alt="User profile"
                className="gm-navbar__profile-icon"
                size={42}
              />
            </button>

            {user ? (
              <div className="gm-navbar__welcome" aria-live="polite">
                <span className="gm-navbar__welcome-label">WELCOME!</span>
                <span className="gm-navbar__welcome-name">{userFirstName}</span>
              </div>
            ) : (
              <button
                type="button"
                className="gm-btn gm-btn--pill gm-btn--solid-yellow gm-navbar__join-btn"
                onClick={handleJoinNowClick}
              >
                JOIN NOW
              </button>
            )}

            <button
              type="button"
              className="gm-lang-btn"
              aria-label="Cambiar idioma"
            >
              LAN <span className="gm-lang-dot" />
            </button>
          </div>
        </div>
      </header>

      <AuthDrawer open={isUserMenuOpen} onClose={handleCloseUserMenu} />
    </>
  );
}
