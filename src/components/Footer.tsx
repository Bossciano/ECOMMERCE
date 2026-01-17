import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Cormorant+Garamond:wght@400;500;600&display=swap');

        :root {
          --champagne: #F7E7CE;
          --champagne-dark: #E8D4B8;
          --champagne-light: #FDF5E6;
          --brown: #6B4423;
          --brown-dark: #523518;
          --brown-light: #8B6239;
          --white: #FFFFFF;
          --cream: #FAF8F3;
        }

        .footer-container {
          font-family: 'Cormorant Garamond', serif;
          background: linear-gradient(180deg, var(--cream) 0%, var(--champagne-light) 100%);
        }

        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, var(--brown) 0%, var(--brown-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-text {
          color: var(--brown-light);
          line-height: 1.7;
        }

        .footer-heading {
          color: var(--brown-dark);
          font-weight: 600;
          font-size: 1.125rem;
          letter-spacing: 0.02em;
          margin-bottom: 1.25rem;
          position: relative;
          padding-bottom: 0.75rem;
        }

        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 2.5rem;
          height: 2px;
          background: linear-gradient(90deg, var(--brown) 0%, var(--champagne) 100%);
        }

        .footer-link {
          color: var(--brown-light);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.375rem 0;
        }

        .footer-link:hover {
          color: var(--brown-dark);
          transform: translateX(4px);
        }

        .footer-link::before {
          content: '';
          width: 0;
          height: 1px;
          background: var(--brown);
          transition: width 0.3s ease;
          position: absolute;
          bottom: 0;
          left: 0;
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .social-button {
          position: relative;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--white);
          border: 1.5px solid var(--champagne-dark);
          color: var(--brown);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .social-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--champagne) 0%, var(--champagne-light) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .social-button:hover {
          border-color: var(--brown-light);
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(107, 68, 35, 0.15);
        }

        .social-button:hover::before {
          opacity: 1;
        }

        .social-button svg {
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .social-button:hover svg {
          color: var(--brown-dark);
          transform: scale(1.1);
        }

        .newsletter-input {
          background: var(--white);
          border: 1.5px solid var(--champagne-dark);
          color: var(--brown);
          padding: 0.875rem 1.125rem;
          border-radius: 0.5rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          transition: all 0.2s ease;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: var(--brown-light);
          box-shadow: 0 0 0 3px rgba(107, 68, 35, 0.1);
        }

        .newsletter-input::placeholder {
          color: var(--brown-light);
        }

        .newsletter-button {
          background: linear-gradient(135deg, var(--brown) 0%, var(--brown-dark) 100%);
          color: var(--champagne-light);
          padding: 0.875rem 1.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-family: 'Cormorant Garamond', serif;
        }

        .newsletter-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(107, 68, 35, 0.3);
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            var(--champagne-dark) 20%,
            var(--champagne-dark) 80%,
            transparent 100%
          );
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--brown-light);
          font-size: 1rem;
          line-height: 1.6;
        }

        .contact-item svg {
          color: var(--brown);
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .footer-bottom {
          background: var(--champagne);
          color: var(--brown-light);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .footer-heading {
            font-size: 1rem;
            margin-bottom: 1rem;
          }
        }
      `}</style>

      <footer className="footer-container border-t-2 border-[var(--champagne-dark)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <Link to="/" className="footer-logo text-3xl lg:text-4xl inline-block mb-4">
                SHOP
              </Link>
              <p className="footer-text mb-6 max-w-sm">
                Premium products for the modern lifestyle. Where quality meets elegance in every detail.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/shop" className="footer-link relative">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link relative">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link relative">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="footer-link relative">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="footer-heading">Customer Service</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/shipping" className="footer-link relative">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="footer-link relative">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="footer-link relative">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="footer-link relative">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="footer-heading">Get in Touch</h4>
              <div className="space-y-4">
                <div className="contact-item">
                  <MapPin className="h-5 w-5" />
                  <span>123 Boutique Street<br />Lagos, Nigeria</span>
                </div>
                <div className="contact-item">
                  <Phone className="h-5 w-5" />
                  <span>+234 (0) 123 456 789</span>
                </div>
                <div className="contact-item">
                  <Mail className="h-5 w-5" />
                  <span>hello@shop.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mb-10">
            <div className="footer-divider mb-10"></div>
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="footer-heading text-xl lg:text-2xl mb-3 inline-block">
                Join Our Newsletter
              </h3>
              <p className="footer-text mb-6">
                Subscribe to receive updates, access to exclusive deals, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input flex-1"
                />
                <button className="newsletter-button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-divider mb-6"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm footer-text">
            <p>© {currentYear} SHOP. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-[var(--brown-dark)] transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-[var(--brown-dark)] transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="hover:text-[var(--brown-dark)] transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
