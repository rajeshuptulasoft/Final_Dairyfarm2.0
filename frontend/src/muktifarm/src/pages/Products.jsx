import ProductBanner from "../components/ProductBanner";
import ProductCard from "../components/ProductCard";
import "../css/products.css";
import freshCowMilkImg from "../../../assets/images/Fresh Cow Milk.png";
import setCurdImg from "../../../assets/images/Set Curd.png";
import farmPaneerImg from "../../../assets/images/curd.png";
import farmhouseCheeseImg from "../../../assets/images/Farmhouse Cheese.png";
import culturedButterImg from "../../../assets/images/Cultured Butter.png";
import gheeImg from "../../../assets/images/Ghee.png";
import buttermilkImg from "../../../assets/images/Buttermilk.png";
import sweetCurdImg from "../../../assets/images/Sweet Curd.png";

const PRODUCTS = [
  { name: "Fresh Cow Milk", description: "Hand-bottled within hours of milking. Creamy and naturally sweet.", image: freshCowMilkImg },
  { name: "Set Curd", description: "Thick, slow-cultured curd from full-cream milk using traditional methods.", image: setCurdImg },
  { name: "Farm Paneer", description: "Soft paneer made the same morning with milk and lemon.", image: farmPaneerImg },
  { name: "Farmhouse Cheese", description: "Aged in our cellar with a rich, earthy character.", image: farmhouseCheeseImg },
  { name: "Cultured Butter", description: "Hand-churned butter with deep golden pasture milk colour.", image: culturedButterImg },
  { name: "Ghee", description: "Slow-simmered bilona ghee with a nutty aroma from our kitchen.", image: gheeImg },
  { name: "Buttermilk", description: "Light, refreshing buttermilk lightly spiced and gut-friendly.", image: buttermilkImg },
  { name: "Sweet Curd", description: "Traditional sweetened curd dessert set in clay pots.", image: sweetCurdImg },
];

export default function Products() {
  return (
    <>
      <ProductBanner />

      <section className="section products-section" id="products-grid">
        <div className="container">
          <div className="products-grid">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
