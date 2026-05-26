import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "../css/header.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className={`premium-header ${scrolled ? "scrolled" : ""}`}>
      <div className="premium-topbar">
        <div className="container">
          <div>Call for orders: <a href="tel:+919876543210">+91 98765 43210</a></div>
          <div className="d-none d-md-block">Certified Organic • Daily Farm Fresh Delivery</div>
          <div><a href="mailto:hello@muktidairy.farm">hello@muktidairy.farm</a></div>
        </div>
      </div>

      <div className="premium-header-inner">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="premium-brand">
            <span className="premium-brand-mark">M</span>
            <span className="premium-brand-text">
              Mukti Dairy Farm
              <small>Pure · Organic · Fresh</small>
            </span>
          </Link>

          <button
            className={`premium-toggle ${open ? "open" : ""}`}
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`premium-nav-links ${open ? "open" : ""}`}>
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => `premium-nav-item${isActive ? " active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/contact" className="premium-nav-cta">
              Book a Visit
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
