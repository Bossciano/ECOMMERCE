import { Facebook, Instagram, Twitter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Footer = () => {
  const [isLinksOpen, setIsLinksOpen] = useState(false);

  const toggleLinks = () => setIsLinksOpen(!isLinksOpen);

  return (
    <footer className="bg-[#faf8f4] border-t border-[#c2a46d]/50">
      <div className="container mx-auto px-4 py-12">
        
        {/* Brand & Social */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex flex-col gap-4 md:w-1/2">
            <h3 className="text-2xl font-bold text-[#3b2f2f]">SHOP</h3>
            <p className="text-[#6b5c4d] max-w-sm">
              Premium products for the modern lifestyle. Quality meets elegance.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="hover:text-[#c2a46d]">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-[#c2a46d]">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-[#c2a46d]">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/2">
            {/* Mobile toggle */}
            <div className="flex justify-between items-center md:hidden mb-2 cursor-pointer" onClick={toggleLinks}>
              <h4 className="font-semibold text-[#3b2f2f] text-lg">Quick Links</h4>
              {isLinksOpen ? <ChevronUp className="h-5 w-5 text-[#3b2f2f]" /> : <ChevronDown className="h-5 w-5 text-[#3b2f2f]" />}
            </div>

            {/* Links list */}
            <ul
              className={`text-[#6b5c4d] text-sm space-y-2 md:block ${
                isLinksOpen ? "block" : "hidden"
              }`}
            >
              <li><a href="#" className="hover:text-[#c2a46d] transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-[#c2a46d] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#c2a46d] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#c2a46d] transition-colors">Support</a></li>
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="pt-6 border-t border-[#c2a46d]/50 text-center text-sm text-[#6b5c4d] mt-8">
          <p>© 2026 SHOP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
