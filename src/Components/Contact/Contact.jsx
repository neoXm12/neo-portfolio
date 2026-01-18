import "./Contact.css";
import theme_pattern from "../../assets/theme_pattern.svg";
import mail_icon from "../../assets/mail_icon.svg";
import location_icon from "../../assets/location_icon.svg";
import linkedin_icon from "../../assets/linkedin_icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const accesskey = import.meta.env.VITE_REACT_ACCESS_KEY;
  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    formData.append("access_key", accesskey);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        event.target.reset();
      } else {
        throw new Error(data.message || "An error occurred, try again!");
      }
    } catch (error) {
      toast.error(`Submission failed: ${error.message}, please try later!`);
    }
  };
  return (
    <div id="contact" className="contact">
      <div className="contact-title">
        <h1>Get in touch</h1>
        <img src={theme_pattern} alt="" />
      </div>
      <div className="contact-section">
        <div className="contact-left">
          <h1>Let&apos;s talk</h1>
          <p>
            I am available to take on new projects, feel free to reach out about
            any new opportunites.
          </p>
          <div className="contact-details">
            <div className="contact-detail">
              <img src={mail_icon} alt="" />
              <p>nirmad.mudvari1@gmail.com</p>
            </div>
            <div className="contact-detail">
              <img src={location_icon} alt="" />
              <p>Dallas-Fort Worth Metroplex</p>
            </div>
            <div className="contact-detail">
              <img src={linkedin_icon} alt="" className="linkedin-image" />
              <p>
                <a
                  href="https://www.linkedin.com/in/nirmad-m-84022a223"
                  target="blank"
                  rel="noopener noreferrer"
                  className="linkedin-url"
                >
                  linkedin.com/in/nirmad-m-84022a223
                </a>{" "}
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="contact-right">
          <label htmlFor="">Your Name</label>
          <input type="text" placeholder="Enter your name" name="name"></input>
          <label htmlFor="">Your Email</label>
          <input
            type="text"
            placeholder="Enter your email"
            name="email"
          ></input>
          <label htmlFor="">Write your message here</label>
          <textarea
            name="message"
            rows="8"
            placeholder="Enter your message"
          ></textarea>
          <button type="submit" className="contact-submit">
            Submit
          </button>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
        />
      </div>
    </div>
  );
};

export default Contact;
