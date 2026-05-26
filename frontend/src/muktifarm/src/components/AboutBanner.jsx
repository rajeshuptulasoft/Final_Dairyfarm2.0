import aboutBannerImage from "../../../assets/images/About Mukti Our Story Begins With Pure Milk.png";
import "../css/product-banner.css";

export default function AboutBanner() {
  return (
    <section className="premium-product-banner">
      <div className="pb-base-bg" />
      <div className="pb-soft-gradient" />

      <div className="container pb-container">
        <div className="pb-banner-grid">
          <div className="pb-minimal-content fade-up">
            <div className="pb-badge">
              <span className="pb-badge-dot" />
              About Mukti
            </div>

            <h1 className="pb-heading">
              Our Story Begins
              <br />
              With Pure Milk
            </h1>

            <p className="pb-description">
              Three generations of dairy care, healthy open fields, and a simple
              promise: milk should be fresh, traceable, and honestly made.
            </p>

            <div className="pb-actions pb-actions-spacer" aria-hidden="true" />
          </div>

          <div className="pb-banner-visual fade-up-delay">
            <img
              src={aboutBannerImage}
              alt="About Mukti — Our story begins with pure milk"
              className="pb-banner-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
