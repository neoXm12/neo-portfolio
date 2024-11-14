import "./Hero.css";
import profile from "../../assets/my-profile.jpg";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { useState } from "react";
import arrow_left from "../../assets/arrow_left.svg";

const Hero = () => {
  const [showImage, setShowImage] = useState(false);

  const handleClick = () => {
    setShowImage((prev) => !prev);
  };

  return (
    <div id="home" className="hero">
      <img src={profile} alt="" className="my-profile" />
      <h1>
        <span>Hey there! This is Nirmad Mudvari</span>, welcome to my portfolio{" "}
      </h1>
      <p>
        Experienced SDET focused on testing excellence, automation, and
        continuous improvement.
      </p>
      <div className="hero-action">
        <div className="hero-connect">
          <AnchorLink className="anchor-link" offset={50} href="#contact">
            Connect with me
          </AnchorLink>
        </div>
        <div
          onClick={handleClick}
          style={{ cursor: "pointer" }}
          className="hero-resume"
        >
          {showImage ? (
            <img src={arrow_left} alt="" className="arrow-left-icon" />
          ) : (
            <div className="resume-para">My Resume</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
