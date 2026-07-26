/* eslint-disable react/prop-types */
import "./Navbar.css";
import menu_open from "../../assets/menu_open.svg";
import menu_close from "../../assets/menu_close.svg";
import { useState } from "react";
import { Link } from "react-scroll";

const Navbar = ({ theme, setTheme }) => {
  const [menu, setMenu] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const handleBackdropKeyDown = (e) => {
    if (e.key === "Escape" || e.key === "Enter") {
      closeMenu();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-brand-text">
          <span>Nirmad</span>
          <small>QA Engineer / Automation Lead</small>
        </div>
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
        {[
          { id: "home", label: "Home" },
          { id: "about", label: "About" },
          { id: "expertise", label: "Expertise" },
          { id: "architecture", label: "Architecture" },
          { id: "data-quality", label: "Data QA" },
          { id: "experience", label: "Experience" },
          { id: "skills", label: "Skills" },
          { id: "projects", label: "Projects" },
          { id: "contact", label: "Contact" },
        ].map((item) => (
          <Link
            key={item.id}
            className={menu === item.id ? "nav-link active" : "nav-link"}
            to={item.id}
            spy={true}
            smooth={true}
            offset={-100}
            duration={700}
            onSetActive={() => setMenu(item.id)}
            onClick={() => setMenu(item.id)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
