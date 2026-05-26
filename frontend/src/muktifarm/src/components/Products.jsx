const PRODUCTS = [
  {
    name: "Fresh Milk",
    subtitle: "Creamy, chilled, and farm-fresh every day.",
  },
  {
    name: "Set Curd",
    subtitle: "Rich probiotic curd made with traditional culture.",
  },
  {
    name: "Paneer",
    subtitle: "Soft, hand-pressed paneer with a delicate milky texture.",
  },
  {
    name: "Farmhouse Cheese",
    subtitle: "Artisan cheese made in small batches for depth of flavor.",
  },
];

export default function Products() {
  return (
    <section className="section products-section">
      <div className="container">
        <div className="section-intro text-center">
          <p className="eyebrow">Featured dairy range</p>
          <h2>Every product feels like it was made just for your table.</h2>
        </div>

        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <article key={product.name} className="product-card">
              <div className="product-badge">Fresh</div>
              <h3>{product.name}</h3>
              <p>{product.subtitle}</p>
              <button type="button" className="btn btn-outline">
                View Details
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
