import { Link } from "react-router-dom";
import "../css/hero-animation.css";

export default function HeroAnimation() {
  return (
    <section className="hero premium-hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-circle hero-circle-1" />
        <div className="hero-circle hero-circle-2" />
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-particle hero-particle-1" />
        <div className="hero-particle hero-particle-2" />
        <div className="hero-grid hero-grid-left" />
        <div className="hero-grid hero-grid-right" />
        <div className="hero-light hero-light-1" />
        <div className="hero-light hero-light-2" />
      </div>

      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Premium organic dairy for modern living
          </div>

          <h1>
            Pure Organic Dairy For <span className="hero-highlight">Modern Living</span>
          </h1>

          <p className="hero-lead">
            Luxury dairy crafted for today's clean kitchens, daily routines, and mindful mornings.
            Soft green light, glass-polished freshness, and a premium feel that elevates every sip.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary hero-button-primary">
              Explore Products
            </Link>
            <Link to="/contact" className="btn btn-outline hero-button-secondary">
              Visit Farm
            </Link>
          </div>

          <div className="hero-pill-group">
            <div className="hero-pill">Small-batch freshness</div>
            <div className="hero-pill">Certified organic trace</div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card">
              <strong>120+</strong>
              <span>Healthy cows</span>
            </div>
            <div className="hero-stat-card">
              <strong>15K+</strong>
              <span>Daily supply</span>
            </div>
            <div className="hero-stat-card">
              <strong>4.9</strong>
              <span>Customer rating</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-frame">
            <div className="hero-visual-card hero-visual-card-1">
              <span>New</span>
              <strong>Farm fresh</strong>
            </div>
            <div className="hero-visual-card hero-visual-card-2">
              <span>Certified</span>
              <strong>Trackable purity</strong>
            </div>

            <div className="hero-farm-scene" aria-hidden="true">
              <div className="hero-sun" />
              <div className="hero-cloud cloud-1" />
              <div className="hero-cloud cloud-2" />
              <div className="hero-cloud cloud-3" />
              <div className="hero-hill hill-back" />
              <div className="hero-hill hill-front" />
              <div className="hero-barn">
                <div className="barn-roof" />
                <div className="barn-body" />
                <div className="barn-door" />
                <div className="barn-window" />
              </div>
              <div className="hero-fence">
                <div className="fence-post" />
                <div className="fence-post" />
                <div className="fence-post" />
                <div className="fence-post" />
                <div className="fence-rail" />
                <div className="fence-rail fence-rail-2" />
              </div>
            </div>

            <div className="hero-ring hero-ring-1" />
            <div className="hero-abstract hero-abstract-1" />
            <div className="hero-abstract hero-abstract-2" />
            <div className="hero-leaf leaf-1" />
            <div className="hero-leaf leaf-2" />
            <div className="hero-lightline hero-lightline-1" />
            <div className="hero-lightline hero-lightline-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
