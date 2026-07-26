import "./Experience.css";
import { experienceTimeline } from "../../data/siteData";

const Experience = () => {
  return (
    <section id="experience" className="section experience reveal">
      <div className="section-heading">
        <p className="section-eyebrow">Selected Professional Experience</p>
        <h2>Leadership in quality engineering, automation, and data validation.</h2>
      </div>
      <div className="timeline">
        {experienceTimeline.map((item, index) => [
          <div key={index} className="timeline-item">
            <div className="timeline-meta">
              <span>{item.date}</span>
              <strong>{item.role}</strong>
              <p>{item.company} · {item.location}</p>
            </div>
            <ul>
              {item.bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          </div>,
          item.company === "Optum" ? (
            <div key={`note-${index}`} className="timeline-note-item">
              <p className="timeline-note">
                These highlights are just the beginning — I’d love to share the full story behind the platform, data, and automation leadership work if you’d like to chat.
              </p>
            </div>
          ) : null,
        ])}
      </div>
    </section>
  );
};

export default Experience;
