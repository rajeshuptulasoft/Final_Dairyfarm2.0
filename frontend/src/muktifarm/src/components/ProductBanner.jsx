import { Link } from "react-router-dom";
import bannerImage from "../../../assets/images/Premium Farm Fresh Pure Dairy. Beautifully Crafted..png";
import "../css/product-banner.css";

export default function ProductBanner() {
  return (
    <section className="premium-product-banner">
      <div className="pb-base-bg" />
      <div className="pb-soft-gradient" />

      <div className="container pb-container">
        <div className="pb-banner-grid">
          <div className="pb-minimal-content fade-up">
            <div className="pb-badge">
              <span className="pb-badge-dot" />
              Premium Farm Fresh
            </div>

            <h1 className="pb-heading">
              Pure Dairy.
              <br />
              Beautifully Crafted.
            </h1>

            <p className="pb-description">
              Discover our artisanal range of fresh milk, aged cheeses, paneer, and creamy butter.
              Ethically raised and organically crafted for the modern table.
            </p>

            <div className="pb-actions">
              <a href="#products-grid" className="pb-btn pb-btn-primary">
                View Collection
              </a>
            </div>
          </div>

          <div className="pb-banner-visual fade-up-delay">
            <img
              src={bannerImage}
              alt="Premium Farm Fresh Pure Dairy, beautifully crafted"
              className="pb-banner-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
