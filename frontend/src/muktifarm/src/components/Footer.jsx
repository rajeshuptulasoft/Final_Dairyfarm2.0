import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import footerBgImage from "../../../assets/images/footer image.png";
import "../css/footer.css";

const PRODUCT_ITEMS = [
  { label: "Fresh Milk", to: "/products" },
  { label: "Set Curd", to: "/products" },
  { label: "Paneer", to: "/products" },
  { label: "Cheese", to: "/products" },
];

const COMPANY_ITEMS = [
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer-base" aria-hidden="true" />
      <div
        className="site-footer-bg-image"
        style={{ backgroundImage: `url(${footerBgImage})` }}
        aria-hidden="true"
      />
      <div className="site-footer-soft-gradient" aria-hidden="true" />

      <div className="container site-footer-inner">
        <div className="footer-columns">
          <div className="footer-block footer-block--brand">
            <Link to="/" className="footer-brand-link">
              <span className="footer-brand-mark">M</span>
              <div>
                <strong className="footer-brand-name">Mukti Dairy Farm</strong>
                <span className="footer-brand-tag">Pure · Organic · Fresh</span>
              </div>
            </Link>
            <p className="footer-brand-desc">
              Pure dairy, delivered daily from our family pastures with care and transparency.
            </p>
          </div>

          <div className="footer-block footer-block--center">
            <div className="footer-center-pair">
              <div className="footer-center-col">
                <h4 className="footer-heading">Products</h4>
                <ul className="footer-links-list">
                  {PRODUCT_ITEMS.map((item) => (
                    <li key={item.label}>
                      <Link to={item.to}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="footer-center-col">
                <h4 className="footer-heading">Company</h4>
                <ul className="footer-links-list">
                  {COMPANY_ITEMS.map((item) => (
                    <li key={item.label}>
                      <Link to={item.to}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-block footer-block--contact">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={16} />
                <span>Village Road, Mukti Nagar, Gop, Puri District</span>
              </li>
              <li>
                <Phone size={16} />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <Mail size={16} />
                <a href="mailto:hello@muktidairy.farm">hello@muktidairy.farm</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-copyright-bar">
          <p>© 2026 Mukti Dairy Farm. Farm-fresh dairy with premium care.</p>
        </div>
      </div>
    </footer>
  );
}
