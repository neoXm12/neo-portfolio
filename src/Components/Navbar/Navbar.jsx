/* eslint-disable react/prop-types */
import "./Navbar.css";
import menu_open from "../../assets/menu_open.svg";
import menu_close from "../../assets/menu_close.svg";
import { useState } from "react";
import { Link } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "expertise", label: "Expertise" },
  { id: "architecture", label: "Architecture" },
  { id: "data-quality", label: "Data" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const Navbar = ({ theme, setTheme }) => {
  const [menu, setMenu] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHome = pathname === "/";

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const handleBackdropKeyDown = (e) => {
    if (e.key === "Escape" || e.key === "Enter") {
      closeMenu();
    }
  };

  // Off the home route the sections aren't mounted, so react-scroll has
  // nothing to target — route home first and let Home perform the scroll.
  const goToSection = (id) => {
    setMenu(id);
    closeMenu();
    navigate("/", { state: { scrollTo: id } });
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <RouterLink to="/" className="nav-brand-text" onClick={closeMenu}>
          <span>Nirmad</span>
          <small>QA Automation Lead / Data Engineer</small>
        </RouterLink>
      </div>
      <button className="nav-theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <button
        type="button"
        className="nav-mobile-open"
        onClick={openMenu}
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
        aria-controls="site-menu"
      >
        <img src={menu_open} alt="" />
      </button>
      <div
        className={`nav-backdrop ${isMenuOpen ? "active" : ""}`}
        onClick={closeMenu}
        role="button"
        tabIndex={0}
        onKeyDown={handleBackdropKeyDown}
        aria-label="Close menu"
      />
      <div id="site-menu" className="nav-menu" aria-hidden={!isMenuOpen}>
        <button
          type="button"
          className="nav-mobile-close"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <img src={menu_close} alt="" />
        </button>
        {SECTIONS.map((item) =>
          isHome ? (
            <Link
              key={item.id}
              className={menu === item.id ? "nav-link active" : "nav-link"}
              to={item.id}
              spy={true}
              smooth={true}
              offset={-100}
              duration={700}
              onSetActive={() => setMenu(item.id)}
              onClick={() => {
                setMenu(item.id);
                closeMenu();
              }}
            >
              {item.label}
            </Link>
          ) : (
            <button
              key={item.id}
              type="button"
              className="nav-link"
              onClick={() => goToSection(item.id)}
            >
              {item.label}
            </button>
          )
        )}
        <RouterLink
          to="/dashboard"
          className={`nav-link nav-link-featured ${pathname === "/dashboard" ? "active" : ""}`}
          onClick={closeMenu}
        >
          Pipeline
        </RouterLink>
      </div>
    </nav>
  );
};

export default Navbar;
