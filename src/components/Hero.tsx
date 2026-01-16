import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/heropage.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // replace with your auth context

const Hero = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth(); // boolean: true if logged in

  const handleShopNow = () => {
    if (isLoggedIn) {
      navigate("/shop"); // go to shop if logged in
    } else {
      navigate("/login"); // go to login if not logged in
    }
  };

  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBanner})` }}
      >
        {/* Champagne overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f4]/95 via-[#faf8f4]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-[#3b2f2f] mb-6 leading-tight">
            Discover Your
            <span className="block text-[#c2a46d]">Perfect Style</span>
          </h1>

          <p className="text-lg text-[#6b5c4d] mb-8 max-w-lg">
            Curated collection of premium products designed for the modern lifestyle.
            Quality meets elegance in every piece.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-[#3b2f2f] hover:bg-[#2a211f] text-[#faf8f4] flex items-center"
              onClick={handleShopNow} // smarter navigation
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-[#c2a46d] text-[#3b2f2f] hover:bg-[#c2a46d]/10"
            >
              Explore Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
