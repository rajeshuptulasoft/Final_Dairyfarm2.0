import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import HomeProducts from "../components/HomeProducts";
import PromoSection from "../components/PromoSection";
import WhyChoose from "../components/WhyChoose";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import Team from "../components/Team";
import Blog from "../components/Blog";
import Contact from "../components/Contact";
import "../styles/homepage.css";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <HomeProducts />
      <PromoSection />
      <WhyChoose />
      <Gallery />
      <Team />
      <Testimonials />
      <Blog />
      <Contact />
    </>
  );
}
