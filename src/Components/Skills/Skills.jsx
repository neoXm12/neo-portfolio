import "./Skills.css";
import { skillsCategories } from "../../data/siteData";

const Skills = () => {
  return (
    <section id="skills" className="section skills reveal">
      <div className="section-heading">
        <p className="section-eyebrow">Technical Skills</p>
        <h2>Organized skills for enterprise software development, quality, and data engineering leadership.</h2>
      </div>
      <div className="skills-grid">
        {skillsCategories.map((group, index) => (
          <article key={index} className="skills-card">
            <h3>{group.category}</h3>
            <div className="skill-badges">
              {group.skills.map((skill, idx) => (
                <span key={idx}>{skill}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Skills;
