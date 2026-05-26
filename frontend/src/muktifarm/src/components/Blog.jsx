import blog1 from "../../assets/images/blog/img-1.jpg";
import blog2 from "../../assets/images/blog/img-2.jpg";
import blog3 from "../../assets/images/blog/img-3.jpg";

const POSTS = [
  {
    title: "The morning routine behind our freshest milk",
    excerpt: "Learn how our team starts each day to keep milk tasty, clean, and full of nutrients.",
    image: blog1,
  },
  {
    title: "Why pasture grazing matters for dairy quality",
    excerpt: "We explain how rotational grazing improves soil, animal health, and milk flavor.",
    image: blog2,
  },
  {
    title: "Choosing the right dairy for your family",
    excerpt: "A simple guide to selecting organic dairy with transparency and wellness built-in.",
    image: blog3,
  },
];

export default function Blog() {
  return (
    <section className="section blog-section">
      <div className="container">
        <div className="section-intro text-center">
          <p className="eyebrow">From our farm journal</p>
          <h2>Stories that bring our dairy to life.</h2>
        </div>

        <div className="blog-grid">
          {POSTS.map((post) => (
            <article key={post.title} className="blog-card">
              <div className="blog-card-image">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="blog-card-body">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <button type="button" className="btn btn-link">
                  Read more
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
