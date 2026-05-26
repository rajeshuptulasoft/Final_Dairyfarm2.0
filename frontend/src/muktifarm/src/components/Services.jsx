const SERVICES = [
  {
    title: "Organic Dairy Care",
    description: "Cows are raised without hormones or antibiotics and fed only pesticide-free feed.",
  },
  {
    title: "Fresh Daily Delivery",
    description: "Products are bottled the same morning and delivered chilled to preserve peak freshness.",
  },
  {
    title: "Farm Wellness Program",
    description: "A committed veterinary and nutrition plan keeps every animal healthy and thriving.",
  },
  {
    title: "Quality You Can See",
    description: "Transparent packaging, traceable sourcing, and dairy made with care from pasture to glass.",
  },
];

export default function Services() {
  return (
    <section className="section services-section">
      <div className="container">
        <div className="section-intro text-center">
          <p className="eyebrow">What makes us different</p>
          <h2>Modern dairy, rooted in tradition.</h2>
          <p>
            Every step of our process is designed to preserve natural flavor, support animal wellbeing, and create a
            premium dairy experience.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <article key={service.title} className="service-card">
              <div className="service-icon" aria-hidden="true">✓</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
