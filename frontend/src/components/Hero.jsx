import './Hero.css';

const Hero = () => {
    const handleScrollClick = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <section className="hero" aria-label="Hero section">
            {/* Title */}
            <div className="hero__content">
                <h1 className="hero__title">
                    <span className="hero__title-line">
                        Astraeus
                    </span>
                    <span className="hero__title-line">
                        <span className="hero__title-accent">S</span>ky.
                    </span>
                </h1>
            </div>

            {/* Crescent Moon */}
            <div className="hero__moon-container">
                <div className="hero__moon">
                    <div className="hero__moon-shape" />
                </div>
            </div>

            {/* Earth Curve */}
            <div className="hero__earth-container">
                <div className="hero__earth">
                    <div className="hero__earth-atmosphere" />
                    <div className="hero__earth-curve" />
                </div>
            </div>

            {/* Scroll Indicator */}
            <button
                className="hero__scroll-indicator"
                onClick={handleScrollClick}
                aria-label="Scroll to next section"
            >
                <span className="hero__scroll-chevron" />
            </button>
        </section>
    );
};

export default Hero;
