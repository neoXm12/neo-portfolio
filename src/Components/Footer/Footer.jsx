import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-inner">
        <div>
          <p className="footer-brand">Nirmad Mudvari</p>
          <p>Senior QA Automation Engineer | Test Architecture Leader | Data QA</p>
        </div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
      <div className="footer-copy">© 2026 Nirmad Mudvari. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
