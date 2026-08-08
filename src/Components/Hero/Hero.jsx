import "./Hero.css";
import profile from "../../assets/profile-2026.jpeg";
import { Link } from "react-scroll";

const Hero = () => {
  const handleResumeRequest = () => {
    const template =
      "Hello Nirmad,\n\nI am interested in your QA automation and Data engineering experience. Could you please share your resume?\n\nThank you,\n";
    sessionStorage.setItem("resumeRequestTemplate", template);
    window.dispatchEvent(
      new CustomEvent("resumeRequestTemplateSet", {
        detail: template,
      })
    );
  };

  return (
    <section id="home" className="hero section reveal">
      <div className="hero-copy">
        <span className="eyebrow">Senior QA Automation Engineer</span>
        <h1>Building enterprise test architecture, data pipelines, and delivering quality at scale.</h1>
        <p>
          Quality Engineering Leader with deep expertise in API, UI, integration,
          performance, load, and data validation. I build automation platforms,
          data QA pipelines, analytics-ready pipeline validation, and modern
          CI/CD quality gates for enterprise teams.
        </p>
        <div className="hero-actions">
          <Link
            className="button button-primary"
            to="experience"
            spy={true}
            smooth={true}
            offset={-100}
            duration={800}
          >
            View Experience
          </Link>
          <Link
            className="button button-secondary"
            to="contact"
            spy={true}
            smooth={true}
            offset={-100}
            duration={800}
            onClick={handleResumeRequest}
          >
            Download Resume
          </Link>
        </div>
      </div>
      <div className="hero-panel">
        <div className="hero-card">
          <img src={profile} alt="Nirmad Mudvari portrait" className="hero-avatar" />
          <div className="hero-stats">
            <div>
              <strong>Enterprise QA leadership</strong>
              <span>QA automation, Data and Software Development</span>
            </div>
            <div>
              <strong>Enterprise scale</strong>
              <span>Restaurant, Retail, healthcare, SaaS, cloud, and analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
