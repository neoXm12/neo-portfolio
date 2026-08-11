import { Link as RouterLink } from "react-router-dom";
import "./Footer.css";

// Sections only exist on the home route, so these navigate home and hand the
// target to Home via router state rather than relying on a bare hash.
const SECTION_LINKS = [
  { id: "home", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">Nirmad Mudvari</p>
          <p>Senior QA Automation Engineer | Test Architecture Leader | Data QA</p>
        </div>
        <div className="footer-links">
          {SECTION_LINKS.map((link) => (
            <RouterLink key={link.id} to="/" state={{ scrollTo: link.id }}>
              {link.label}
            </RouterLink>
          ))}
          <RouterLink to="/dashboard">Data Pipeline</RouterLink>
        </div>
      </div>
      <div className="footer-copy">© 2026 Nirmad Mudvari. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
