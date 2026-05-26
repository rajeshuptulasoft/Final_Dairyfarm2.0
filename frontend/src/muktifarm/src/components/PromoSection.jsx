import promoImage from "../../assets/images/about/about-2.png";

export default function PromoSection() {
  return (
    <section className="section promo-section">
      <div className="container promo-grid">
        <div className="promo-copy">
          <p className="eyebrow">The milk you can trust</p>
          <h2>Every bottle is backed by our farm promise.</h2>
          <p>
            From pasture-fed cows to glass sealing, our whole process focuses on hygiene, taste, and reliable
            doorstep delivery.
          </p>
          <ul>
            <li>Biometric farm checks and clean milking routines</li>
            <li>Glass packaging with premium sealing</li>
            <li>Same-day processing and chilled delivery</li>
          </ul>
          <span className="promo-note">Available for homes, cafes and curated retail partners.</span>
        </div>
        <div className="promo-image">
          <img src={promoImage} alt="Premium dairy packaging" />
        </div>
      </div>
    </section>
  );
}
