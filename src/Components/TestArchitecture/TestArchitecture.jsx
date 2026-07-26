import "./TestArchitecture.css";
import { architectureCards } from "../../data/siteData";

const TestArchitecture = () => {
  return (
    <section id="architecture" className="section architecture reveal">
      <div className="section-heading">
        <p className="section-eyebrow">Test Architecture</p>
        <h2>Designing quality engineering platforms for enterprise scale.</h2>
        <p className="section-description">
          I build resilient test architecture blueprints that align automation, integration,
          performance, and delivery pipelines with business quality goals.
        </p>
      </div>
      <div className="architecture-grid">
        {architectureCards.map((card, index) => (
          <article key={index} className="architecture-card">
            <span className="architecture-index">0{index + 1}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TestArchitecture;
