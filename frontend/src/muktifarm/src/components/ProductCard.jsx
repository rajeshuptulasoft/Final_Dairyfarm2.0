import { useState } from "react";
import EnquiryModal from "./EnquiryModal";
import "../css/products.css";
import defaultProductImage from "../../assets/images/bar.png";

export default function ProductCard({ product }) {
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <>
      <article className="product-card">
        <div className="product-thumb">
          <div className="product-image-square">
            <img
              className="product-image"
              src={product.image || defaultProductImage}
              alt={product.name}
              loading="lazy"
            />
          </div>
        </div>
        <div className="product-body">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <button
            type="button"
            className="product-enquiry-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowEnquiry(true);
            }}
          >
            Enquiry Now
          </button>
        </div>
      </article>

      {showEnquiry && (
        <EnquiryModal product={product.name} onClose={() => setShowEnquiry(false)} />
      )}
    </>
  );
}
