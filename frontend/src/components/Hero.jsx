import { Navigate, useNavigate } from "react-router-dom";
import "./Hero.css";
import Footer from "./Footer";
const Hero = () => {
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate("/dashboard");
  };

  return (
    <section className="hero" aria-label="Hero section">
      <div className="hero__content">
        <h1 className="hero__title">
          <span className="hero__title-line">Astraeus</span>
          <span className="hero__title-line">
            <span className="hero__title-accent">S</span>ky.
          </span>
        </h1>
      </div>

      <div className="hero__moon-container">
        <div className="hero__moon">
          <div className="hero__moon-shape" />
        </div>
      </div>

      <div className="hero__earth-container">
        <div className="hero__earth">
          <div className="hero__earth-atmosphere" />
          <div className="hero__earth-curve" />
        </div>
      </div>
      <div className="Headline">
        <h1 className="Headline-title">Real-Time Satellite Tracking</h1>
        <p className="Headline-subtitle">
          Monitor satellites orbiting Earth, live.
        </p>

        <button
          className="NavigationButton"
          onClick={handleNavigation}
          aria-label="Redirect to the Dashboard section"
        >
          See what's Above
        </button>
      </div>
    <Footer />
    </section>
  );
};

export default Hero;
