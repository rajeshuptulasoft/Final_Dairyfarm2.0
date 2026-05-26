import { Link } from "react-router-dom";
import "../css/hero.css";

export default function Hero() {
  return (
    <section className="premium-hero">
      <div className="hero-bg-glow" />
      <div className="hero-bg-shape" />

      {/* Floating decorative elements in background */}
      <div className="hero-decor-circle circle-bg-1" />
      <div className="hero-decor-circle circle-bg-2" />

      <div className="container hero-content-wrapper">
        <div className="row align-items-center">
          
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="hero-badge">
              <span className="badge-dot" />
              100% Organic Dairy Farm
            </div>

            <h1>
              Pure Dairy Crafted From <span className="text-highlight">Pasture To Glass</span>
            </h1>

            <p className="hero-description">
              Experience luxury farm-fresh milk, artisan cheese, and creamy curd delivered straight to your doorstep. Pure wellness raised ethically for the modern conscious home.
            </p>

            <div className="hero-cta-group">
              <Link to="/products" className="btn-premium-primary">
                Explore Products
              </Link>
              <Link to="/contact" className="btn-premium-outline">
                Visit the Farm
              </Link>
            </div>

            <div className="hero-stats-grid">
              <div className="stat-card">
                <strong>24/7</strong>
                <span>Active Farm Care</span>
              </div>
              <div className="stat-card">
                <strong>100%</strong>
                <span>Organic Certified</span>
              </div>
              <div className="stat-card">
                <strong>75K+</strong>
                <span>Daily Deliveries</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-visual-composition">
              
              {/* Main Cinematic Farm Image */}
              <div className="hero-main-image">
                <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=2070&auto=format&fit=crop" alt="Healthy cows grazing in green pasture at sunrise" />
                <div className="image-overlay-gradient"></div>
              </div>

              {/* Secondary Overlapping Dairy Image */}
              <div className="hero-secondary-image">
                <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1287&auto=format&fit=crop" alt="Fresh premium organic milk" />
              </div>

              {/* Floating Badges */}
              <div className="floating-glass-badge badge-1">🌿 100% Organic</div>
              <div className="floating-glass-badge badge-2">🐄 Healthy Cows</div>
              <div className="floating-glass-badge badge-3">✨ Daily Farm Fresh</div>

              {/* Premium Glassmorphism Card */}
              <div className="glass-card-ethic">
                <div className="glass-icon-wrapper">
                  <span className="glass-icon-inner">💚</span>
                </div>
                <div className="glass-text-content">
                  <h4>Ethically Raised</h4>
                  <p>Pure pasture-fed dairy</p>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
