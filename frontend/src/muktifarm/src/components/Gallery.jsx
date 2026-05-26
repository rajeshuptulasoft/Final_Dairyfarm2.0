import gallery1 from "../../assets/images/blog/img-7.jpg";
import gallery2 from "../../assets/images/blog/img-8.jpg";
import gallery3 from "../../assets/images/blog/img-9.jpg";
import gallery4 from "../../assets/images/hero/hero_one-slider-3.jpg";
import gallery5 from "../../assets/images/about/img-3.jpg";
import gallery6 from "../../assets/images/contact/img-1.jpg";

const GALLERY_ITEMS = [
  { title: "Organic milk production", image: gallery1 },
  { title: "Fresh curd in jars", image: gallery2 },
  { title: "Pasture-fed cows", image: gallery3 },
  { title: "Harvested fodder", image: gallery4 },
  { title: "Artisan cheese making", image: gallery5 },
  { title: "Family farm delivery", image: gallery6 },
];

export default function Gallery() {
  return (
    <section className="section gallery-section">
      <div className="container">
        <div className="section-intro text-center">
          <p className="eyebrow">Farm stories in motion</p>
          <h2>Every photo captures the freshness of our dairy system.</h2>
        </div>

        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.title} className="gallery-item">
              <img src={item.image} alt={item.title} />
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
