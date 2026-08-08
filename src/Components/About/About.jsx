import "./About.css";

const About = () => {
  return (
    <section id="about" className="section about reveal">
      <div className="about-header">
        <div>
          <p className="section-eyebrow">About Me</p>
          <h2>Senior QA / Automation Lead with strong Data QA and Data engineering experience.</h2>
        </div>
      </div>
      <div className="about-grid">
        <div className="about-copy">
          <div className="about-summary">
            <p>
              I design test architecture and quality engineering solutions for enterprise
              systems, with hands-on experience in API, UI, integration, performance,
              load, data validation, analytics pipelines, and software development. I partner with development,
              product, and data engineering teams to build scalable automation, repeatable quality
              practices, and measurable release confidence.
            </p>
            <p>
              My work spans cloud-native environments, ETL/ELT workflows, and modern
              CI/CD pipelines. I deliver automation platforms that reduce regression
              cycle time, uncover hidden risk, and keep analytics and reporting data trusted across teams.
            </p>
          </div>
          <div className="about-pillars">
            <div>
              <strong>Leadership</strong>
              <span>Quality engineering strategy and cross-functional alignment</span>
            </div>
            <div>
              <strong>Reliability</strong>
              <span>Data engineering governance, validation, and analytics accuracy</span>
            </div>
            <div>
              <strong>Scalability</strong>
              <span>Reusable automation frameworks and CI/CD quality gates</span>
            </div>
          </div>
        </div>
        <div className="about-cards">
          <div className="about-card">
            <h3>Enterprise Test Architecture</h3>
            <p>
              Building modular automation frameworks, shared test services, and
              standards for cross-team reliability at scale.
            </p>
          </div>
          <div className="about-card">
            <h3>Data Quality & Validation</h3>
            <p>
              Validating pipelines, reconciling datasets, and ensuring analytics results
              are trusted before release.
            </p>
          </div>
          <div className="about-card">
            <h3>Developer-aligned Software Delivery</h3>
            <p>
              Partnering with engineering teams to build maintainable code, testable APIs,
              and automation-friendly software across the delivery lifecycle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
