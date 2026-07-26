import "./Services.css";
import { expertiseHighlights } from "../../data/siteData";

const Services = () => {
  return (
    <section id="expertise" className="section services reveal">
      <div className="section-heading">
        <p className="section-eyebrow">Technical Expertise</p>
        <h2>Core capabilities that power enterprise software delivery, QA, and test architecture.</h2>
      </div>
      <div className="services-grid">
        {expertiseHighlights.map((service, index) => (
          <article key={index} className="services-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Services;
