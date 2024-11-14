import "./Navbar.css";
import mylogo from "../../assets/logonew.svg";
import underline from "../../assets/nav_underline.svg";
import { useRef, useState } from "react";
import menu_open from "../../assets/menu_open.svg";
import menu_close from "../../assets/menu_close.svg";
import { Link } from "react-scroll";

const Navbar = () => {
  const [menu, setMenu] = useState("");
  const menuRef = useRef();

  const openMenu = () => {
    menuRef.current.style.right = "0";
  };
  const closeMenu = () => {
    menuRef.current.style.right = "-350px";
  };
  return (
    <div className="navbar">
      <img src={mylogo} alt="logo" className="nav-icon" />
      <img
        src={menu_open}
        onClick={openMenu}
        alt="logo"
        className="nav-mob-open"
      />
      <ul ref={menuRef} className="nav-menu">
        <img
          src={menu_close}
          onClick={closeMenu}
          className="nav-mob-close"
          alt=""
        />
        <li>
          <Link
            to="home" // This should correspond to the section's id
            spy={true} // Track if this section is in view
            smooth={true} // Enable smooth scrolling
            offset={-200} // Adjust for navbar height (use negative value)
            duration={800} // Duration of the smooth scroll
            onSetActive={() => setMenu("home")}
          >
            <p
              onClick={() => {
                setMenu("home"); // Update active state on click
              }}
            >
              {" "}
              Home{" "}
            </p>
          </Link>
          {menu === "home" ? <img src={underline} alt="" /> : <></>}
        </li>

        <li>
          <Link
            to="about"
            spy={true}
            smooth={true}
            offset={-200}
            duration={800}
            onSetActive={() => setMenu("about")}
          >
            <p
              onClick={() => {
                setMenu("about");
              }}
            >
              {" "}
              About Me{" "}
            </p>
          </Link>
          {menu === "about" ? <img src={underline} alt="" /> : <></>}
        </li>
        <li>
          <Link
            to="services"
            spy={true}
            smooth={true}
            offset={-200}
            duration={800}
            onSetActive={() => setMenu("services")}
          >
            <p
              onClick={() => {
                setMenu("services");
              }}
            >
              {" "}
              Top Skills{" "}
            </p>
          </Link>
          {menu === "services" ? <img src={underline} alt="" /> : <></>}
        </li>
        <li>
          <Link
            to="contact"
            spy={true}
            smooth={true}
            offset={-200}
            duration={800}
            onSetActive={() => setMenu("contact")}
          >
            <p
              onClick={() => {
                setMenu("contact");
              }}
            >
              {" "}
              Contact{" "}
            </p>
          </Link>
          {menu === "contact" ? <img src={underline} alt="" /> : <></>}
        </li>
      </ul>
      <div className="nav-connect">
        <Link
          to="contact"
          spy={true}
          smooth={true}
          offset={-200}
          duration={800}
          onSetActive={() => setMenu("contact")}
          onClick={() => setMenu("contact")}
        >
          Connect with me
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
