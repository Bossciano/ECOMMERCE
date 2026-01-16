import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-[#faf8f4] border-t border-[#c2a46d]/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand & Social */}
          <div>
            <h3 className="text-2xl font-bold text-[#3b2f2f] mb-4">SHOP</h3>
            <p className="text-[#6b5c4d] mb-4">
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
          <div>
            <h4 className="font-semibold text-[#3b2f2f] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-[#6b5c4d] text-sm">
              <li><a href="#" className="hover:text-[#c2a46d] transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-[#c2a46d] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#c2a46d] transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-[#c2a46d] transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-[#3b2f2f] mb-4">Newsletter</h4>
            <p className="text-[#6b5c4d] mb-4">
              Subscribe for updates, offers, and new arrivals.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-[#fffaf0] border-[#c2a46d]/50 focus:border-[#c2a46d]"
              />
              <Button
                size="icon"
                className="bg-[#c2a46d] hover:bg-[#b39255] text-[#faf8f4] shrink-0"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-[#c2a46d]/50 text-center text-sm text-[#6b5c4d]">
          <p>© 2026 SHOP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
