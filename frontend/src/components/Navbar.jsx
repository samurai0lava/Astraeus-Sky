import { useState, useEffect, useRef } from "react";
import { Github, Satellite, Linkedin } from "lucide-react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import { Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleNavigation = () => {
    navigate('/');
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    {
      label: "Github",
      href: "https://github.com/samurai0lava/Astraeus-Sky",
      icon: Github,
    },
    { label: "N2YO API", href: "https://www.n2yo.com/api/", icon: Satellite },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ilyassouhsseine/",
      icon: Linkedin,
    },
  ];

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="Main navigation"
    >
      <span className="navbar__logo" onClick={handleNavigation}>
        <img src={logo} alt="Astraeus Sky Logo" />
      </span>
      <ul className="navbar__links">
        {navLinks.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a className="navbar__link" href={href}>
              <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>

      <button
        className={`navbar__hamburger ${isMenuOpen ? "navbar__hamburger--open" : ""}`}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <span className="navbar__hamburger-line" />
        <span className="navbar__hamburger-line" />
        <span className="navbar__hamburger-line" />
      </button>

      <div
        id="mobile-menu"
        className={`navbar__mobile-menu ${isMenuOpen ? "navbar__mobile-menu--open" : ""}`}
      >
        {navLinks.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            className="navbar__mobile-link"
            href={href}
            onClick={() => setIsMenuOpen(false)}
          >
            <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
