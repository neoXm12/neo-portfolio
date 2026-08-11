import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import useRevealOnScroll from "./hooks/useRevealOnScroll";
import "./App.css";

const App = () => {
  const [theme, setTheme] = useState("dark");
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
  }, [theme]);

  // Land at the top on every route change, except when Home was asked to
  // scroll to a specific section — that navigation owns the scroll position.
  useEffect(() => {
    if (state?.scrollTo) return;
    window.scrollTo(0, 0);
  }, [pathname, state]);

  useRevealOnScroll(pathname);

  return (
    <div className="app">
      <Navbar theme={theme} setTheme={setTheme} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
