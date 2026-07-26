import "./Certifications.css";
import { certificationItems } from "../../data/siteData";

const Certifications = () => {
  return (
    <section id="certifications" className="section certifications reveal">
      <div className="section-heading">
        <p className="section-eyebrow">Certifications</p>
        <h2>Building credibility through continuous quality and data engineering growth.</h2>
      </div>
      <div className="certifications-grid">
        {certificationItems.map((item, index) => (
          <article key={index} className="certification-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
