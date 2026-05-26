import contactBannerImage from "../../../assets/images/Visit our farm or drop us a Line Mukti Dairy Farm.png";
import "../css/product-banner.css";

export default function ContactBanner() {
  return (
    <section className="premium-product-banner">
      <div className="pb-base-bg" />
      <div className="pb-soft-gradient" />

      <div className="container pb-container">
        <div className="pb-banner-grid">
          <div className="pb-minimal-content fade-up">
            <div className="pb-badge">
              <span className="pb-badge-dot" />
              Get in Touch
            </div>

            <h1 className="pb-heading">
              Visit Our Farm,
              <br />
              Or Drop Us a Line
            </h1>

            <p className="pb-description">
              Come by for a peaceful farm visit, ask about daily delivery, or send
              us a message. Our gate is always open during farm hours.
            </p>

            <div className="pb-actions pb-actions-spacer" aria-hidden="true" />
          </div>

          <div className="pb-banner-visual fade-up-delay">
            <img
              src={contactBannerImage}
              alt="Visit our farm or drop us a line — Mukti Dairy Farm"
              className="pb-banner-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
