import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import Hero from "../Components/Hero/Hero";
import About from "../Components/About/About";
import Services from "../Components/Services/Services";
import TestArchitecture from "../Components/TestArchitecture/TestArchitecture";
import DataQuality from "../Components/DataQuality/DataQuality";
import Experience from "../Components/Experience/Experience";
import Skills from "../Components/Skills/Skills";
import Projects from "../Components/Projects/Projects";
import Certifications from "../Components/Certifications/Certifications";
import Contact from "../Components/Contact/Contact";

const Home = () => {
  const location = useLocation();
  const scrollTo = location.state?.scrollTo;

  // Navigating here from another route (e.g. the Dashboard nav) carries the
  // target section in router state, since react-scroll can only reach anchors
  // that are already mounted.
  useEffect(() => {
    if (!scrollTo) return;
    scroller.scrollTo(scrollTo, { smooth: true, offset: -100, duration: 700 });
    window.history.replaceState({}, "");
  }, [scrollTo]);

  return (
    <>
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
    </>
  );
};

export default Home;
