import { Link } from "react-router-dom";
import tomatoImage from "../../assets/images/products/img-10.png";
import fishImage from "../../assets/images/products/img-11.png";
import cheeseImage from "../../assets/images/products/img-12.png";
import salmonImage from "../../assets/images/products/img-13.png";

const HOME_PRODUCTS = [
  {
    title: "Organice Delicious Fresh Tomato",
    category: "Vegetable",
    image: tomatoImage,
  },
  {
    title: "100% Natural Fresh Sea Fish",
    category: "Fish",
    image: fishImage,
  },
  {
    title: "Organice Delicious Pomegranate",
    category: "Food",
    image: cheeseImage,
  },
  {
    title: "100% Natural Fresh Sea Fish",
    category: "Fish",
    image: salmonImage,
  },
];

export default function HomeProducts() {
  const scrollingProducts = [...HOME_PRODUCTS, ...HOME_PRODUCTS];

  return (
    <section className="home-products section">
      <div className="container">
        <div className="home-products-header">
          <div>
            <p className="eyebrow">Some Fresh Cows Products</p>
            <h2>Collection Our Shop</h2>
          </div>
          <Link to="/products" className="btn btn-outline home-products-cta">
            View More Products
          </Link>
        </div>

        <div className="home-product-scroll" aria-label="Featured products">
          <div className="home-product-track">
            {scrollingProducts.map((item, index) => (
              <article key={`${item.title}-${index}`} className="home-product-card">
                <div className="home-card-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="home-product-label">{item.category}</span>
                </div>
                <div className="home-card-copy">
                  <div className="home-card-rating">*****</div>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
