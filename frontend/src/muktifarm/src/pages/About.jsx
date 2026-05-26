import AboutBanner from "../components/AboutBanner";
import "../css/about.css";
import ourStoryImg from "../../../assets/images/Our Story.png";
import pastureFirstImg from "../../../assets/images/Pasture First.png";
import gentleMilkingImg from "../../../assets/images/Gentle Milking.png";
import sameHourBottlingImg from "../../../assets/images/Same-Hour Bottling.png";
import hygienicPackagingImg from "../../../assets/images/Hygienic Packaging.png";
import morningDeliveryImg from "../../../assets/images/Morning Delivery.png";
import returnedSanitizedImg from "../../../assets/images/Returned, Sanitized, Reused.png";
import healthyCowCareImg from "../../../assets/images/Healthy Cow Care.png";
import hygienicPackaging2Img from "../../../assets/images/Hygienic Packaging (2).png";
import dailyDeliveryCareImg from "../../../assets/images/Daily Delivery.png";
import customerTrustImg from "../../../assets/images/Customer Trust.png";

const CARE_CARDS = [
  {
    title: "Healthy Cow Care",
    description:
      "Veterinary checks, open pasture, balanced nutrition and daily exercise - happy cows make better milk.",
    image: healthyCowCareImg,
  },
  {
    title: "Hygienic Packaging",
    description:
      "Glass bottles sterilized in-house, sealed in a certified clean dairy and hand-checked before dispatch.",
    image: hygienicPackaging2Img,
  },
  {
    title: "Daily Delivery",
    description:
      "An early-morning route that ensures your dairy arrives before breakfast, every single day of the week.",
    image: dailyDeliveryCareImg,
  },
  {
    title: "Customer Trust",
    description:
      "Over 5,000 families across the region rely on Mukti for their daily dairy - and we never take that lightly.",
    image: customerTrustImg,
  },
];

const DAIRY_PROCESS_STEPS = [
  {
    step: "01",
    title: "Pasture First",
    description:
      "Our day begins at sunrise, with the herd grazing freely on chemical-free pasture.",
    image: pastureFirstImg,
  },
  {
    step: "02",
    title: "Gentle Milking",
    description:
      "Stress-free, hand-supervised milking - no machines forced on tired cows.",
    image: gentleMilkingImg,
  },
  {
    step: "03",
    title: "Same-Hour Bottling",
    description:
      "Milk is cooled, filtered and glass-bottled within the hour, untouched by additives.",
    image: sameHourBottlingImg,
  },
  {
    step: "04",
    title: "Hygienic Packaging",
    description:
      "Each bottle is sealed in our certified clean dairy and quality-checked by hand.",
    image: hygienicPackagingImg,
  },
  {
    step: "05",
    title: "Morning Delivery",
    description:
      "Our route begins at 5 AM so your milk reaches you before breakfast.",
    image: morningDeliveryImg,
  },
  {
    step: "06",
    title: "Returned, Sanitized, Reused",
    description:
      "We collect empty bottles the next day, sanitize and reuse - gentle on the planet.",
    image: returnedSanitizedImg,
  },
];

export default function About() {
  return (
    <>
      <AboutBanner />

      <section className="section">
        <div className="container about-story">
          <div className="about-story-media">
            <img
              src={ourStoryImg}
              alt="Our Story — Mukti Dairy Farm"
              className="about-story-image"
              loading="lazy"
            />
          </div>
          <div>
            <h2>Our Story</h2>
            <p>
              Three generations of dairy farmers, one shared promise: never
              compromise on the cow, the milk, or the customer. What began as a
              small family stable with six cows is now a 120-strong herd serving
              the whole region - but every bottle is still treated like it is
              going to our own family's table.
            </p>
            <p>
              We do not believe in shortcuts. No hormones, no preservatives, no
              powdered milk reconstitution - just fresh, traceable dairy from
              cows we know by name.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "linear-gradient(180deg, #eaf6e9 0%, #fbf6e7 100%)" }}>
        <div className="container">
          <h2 className="section-title">Mission & Vision</h2>
          <p className="section-subtitle">Built on care for the cow, the customer, and the soil.</p>
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">M</div>
              <h3>Our Mission</h3>
              <p>
                To bring pure, organic, hormone-free dairy to every doorstep
                while raising our herd with the kindness they deserve.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">V</div>
              <h3>Our Vision</h3>
              <p>
                A world where every glass of milk is honest - traceable to a
                farm, a cow, a morning. We want to make that the standard, not
                the exception.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section dairy-process-section">
        <div className="container">
          <h2 className="section-title">Our Organic Dairy Process</h2>
          <p className="section-subtitle">
            From pasture to your doorstep in less than 12 hours.
          </p>

          <div className="dairy-process-list">
            {DAIRY_PROCESS_STEPS.map((step, index) => {
              const imageLeft = index % 2 === 0;
              return (
                <article
                  key={step.title}
                  className={`dairy-process-row ${imageLeft ? "image-left" : "image-right"}`}
                >
                  <div className="dairy-process-media">
                    <img src={step.image} alt={step.title} loading="lazy" />
                  </div>
                  <div className="dairy-process-content">
                    <span className="dairy-process-step">Step {step.step}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section about-care-section" style={{ background: "linear-gradient(180deg, #fbf6e7 0%, #eaf6e9 100%)" }}>
        <div className="container">
          <div className="mv-grid mv-grid--care">
            {CARE_CARDS.map((card) => (
              <article key={card.title} className="mv-card mv-card--with-image">
                <div className="mv-card-image-wrap">
                  <img src={card.image} alt={card.title} loading="lazy" />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
