import "./About.css";
import theme_pattern from "../../assets/theme_pattern.svg";
import profile from "../../assets/my-profile.JPG";

const About = () => {
  return (
    <div id="about" className="about">
      <div className="about-title">
        <h1>About me</h1>
        <img src={theme_pattern} alt="" />
      </div>
      <div className="about-sections">
        <div className="about-left">
          <img src={profile} alt="" className="my-profile-img" />
        </div>
        <div className="about-right">
          <div className="about-para">
            <p>
              As an SDET with over 8 years of experience, I specialize in
              building automated test frameworks, optimizing testing processes,
              and ensuring software reliability. I believe in the power of
              automation to drive continuous improvement and enable fast,
              high-quality releases.
            </p>
            <p>
              I am deeply passionate about creating high-quality software, and I
              see testing as an integral part of the development lifecycle, not
              just an afterthought. I approach testing with the same principles
              I apply to software development: a focus on scalability,
              efficiency, and continuous improvement.{" "}
            </p>
          </div>
          <div className="about-skills">
            <div className="about-skill">
              <p>Scalability</p>
              <hr style={{ width: "80%" }}></hr>
            </div>
            <div className="about-skill">
              <p>Efficiency </p>
              <hr style={{ width: "80%" }}></hr>
            </div>
            <div className="about-skill">
              <p>Improvement</p>
              <hr style={{ width: "80%" }}></hr>
            </div>
            <div className="about-skill">
              <p>Teamwork</p>
              <hr style={{ width: "80%" }}></hr>
            </div>
          </div>
        </div>
      </div>
      <div className="about-achievements">
        <div className="about-achievement">
          <h1>8+</h1>
          <p>YEARS OF EXPERIENCE</p>
        </div>
        <hr />
        <div className="about-achievement">
          <h1>Multiple </h1>
          <p>PROJECTS COMPLETED</p>
        </div>
        <hr />
        <div className="about-achievement">
          <h1>Multiple</h1>
          <p>HAPPY CLIENTS</p>
        </div>
      </div>
    </div>
  );
};

export default About;
