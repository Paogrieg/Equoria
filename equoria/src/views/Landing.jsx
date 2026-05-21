import { COLORS } from "../constants/data";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div style={{ background: COLORS.surface, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <Hero />
      <Features />
      <Carousel />
      <Footer />
    </div>
  );
}