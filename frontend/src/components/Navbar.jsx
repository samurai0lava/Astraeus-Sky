import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navLinks = [
        { label: 'Github', href: 'https://github.com/samurai0lava/Astraeus-Sky' },
    ];

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            <ul className="navbar__links">
                {navLinks.map((link) => (
                    <li key={link.label}>
                        <a className="navbar__link" href={link.href}>
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>

            <button
                className={`navbar__hamburger ${isMenuOpen ? 'navbar__hamburger--open' : ''}`}
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
                <span className="navbar__hamburger-line" />
                <span className="navbar__hamburger-line" />
                <span className="navbar__hamburger-line" />
            </button>

            <span className="navbar__logo"><img src="/src/assets/logo.png" alt="Astraeus Sky Logo" /></span>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                className={`navbar__mobile-menu ${isMenuOpen ? 'navbar__mobile-menu--open' : ''}`}
            >
                {navLinks.map((link) => (
                    <a
                        key={link.label}
                        className="navbar__mobile-link"
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
