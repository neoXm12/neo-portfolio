import "./Contact.css";
import mail_icon from "../../assets/mail_icon.svg";
import location_icon from "../../assets/location_icon.svg";
import linkedin_icon from "../../assets/linkedin_icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

const Contact = () => {
  const accesskey = import.meta.env.VITE_REACT_ACCESS_KEY;
  const [messageValue, setMessageValue] = useState(() => sessionStorage.getItem("resumeRequestTemplate") || "");

  useEffect(() => {
    const loadMessage = (template) => {
      const savedMessage = template || sessionStorage.getItem("resumeRequestTemplate");
      if (savedMessage) {
        setMessageValue(savedMessage);
        sessionStorage.removeItem("resumeRequestTemplate");
      }
    };

    loadMessage();

    const onTemplateSet = (event) => {
      loadMessage(event.detail);
    };

    window.addEventListener("resumeRequestTemplateSet", onTemplateSet);
    return () => window.removeEventListener("resumeRequestTemplateSet", onTemplateSet);
  }, []);

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
    <section id="contact" className="section contact reveal">
      <div className="section-heading">
        <p className="section-eyebrow">Contact</p>
        <h2>Ready to partner on quality engineering and data reliability.</h2>
      </div>
      <div className="contact-grid">
        <div className="contact-panel">
          <h3>Let&apos;s build confident releases.</h3>
          <p>
            I am open to leadership, consulting, and strategic engagements focused
            on enterprise automation, test architecture, and data quality.
          </p>
          <div className="contact-details">
            <div>
              <img src={mail_icon} alt="Email icon" />
              <a href="mailto:nirmadmudvari@outlook.com">nirmadmudvari@outlook.com</a>
            </div>
            <div>
              <img src={location_icon} alt="Location icon" />
              <span>Dallas-Fort Worth Metroplex</span>
            </div>
            <div>
              <img src={linkedin_icon} alt="LinkedIn icon" />
              <a
                href="https://www.linkedin.com/in/nirmad-mudvari-6849a63b2"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/nirmad-mudvari-6849a63b2
              </a>
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="contact-form">
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" name="name" placeholder="Enter your name" autoComplete="name" required />
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" autoComplete="email" required />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            placeholder="How can I help?"
            required
            value={messageValue}
            onChange={(event) => setMessageValue(event.target.value)}
          />
          <button type="submit" className="contact-submit">Send Message</button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={8000} hideProgressBar={false} />
    </section>
  );
};

export default Contact;
