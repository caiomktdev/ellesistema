import HeroSection from "@/components/shop/HeroSection";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import BannerStrip from "@/components/shop/BannerStrip";
import Testimonials from "@/components/shop/Testimonials";
import Newsletter from "@/components/shop/Newsletter";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <BannerStrip />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
