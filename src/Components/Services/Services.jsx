import "./Services.css";
import theme_pattern from "../../assets/theme_pattern.svg";
import Services_Data from "../../assets/services_data";
import more_icon from "../../assets/more-icon.svg";

const Services = () => {
  return (
    <div id="services" className="services">
      <div className="services-title">
        <h1>Top Skills</h1>
        <img src={theme_pattern} alt="" />
      </div>
      <div className="services-container">
        {Services_Data.map((service, index) => {
          return (
            <div key={index} className="services-format">
              <h3>{service.s_no}</h3>
              <h2>{service.s_name}</h2>
              <p>{service.s_desc}</p>
              <div className="services-readmore">
                <p>and more</p>
                <img src={more_icon} alt="" className="more-icon" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
