import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/Hero/Hero";
import About from "./Components/About/About";
import Services from "./Components/Services/Services";
import TestArchitecture from "./Components/TestArchitecture/TestArchitecture";
import DataQuality from "./Components/DataQuality/DataQuality";
import Experience from "./Components/Experience/Experience";
import Skills from "./Components/Skills/Skills";
import Projects from "./Components/Projects/Projects";
import Certifications from "./Components/Certifications/Certifications";
import Contact from "./Components/Contact/Contact";
import Footer from "./Components/Footer/Footer";
import "./App.css";

const App = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
  }, [theme]);

  useEffect(() => {
    const sections = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      <Navbar theme={theme} setTheme={setTheme} />
      <main>
        <Hero />
        <About />
        <Services />
        <TestArchitecture />
        <DataQuality />
        <Experience />
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
