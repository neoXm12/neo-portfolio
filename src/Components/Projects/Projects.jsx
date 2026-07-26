import "./Projects.css";
import { projectHighlights } from "../../data/siteData";

const Projects = () => {
  return (
    <section id="projects" className="section projects reveal">
      <div className="section-heading">
        <p className="section-eyebrow">Featured Projects</p>
        <h2>Selected initiatives that demonstrate enterprise QA and data quality leadership.</h2>
      </div>
      <div className="projects-grid">
        {projectHighlights.map((project, index) => (
          <article key={index} className="project-card">
            <span className="project-count">0{index + 1}</span>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
