import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

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
          font-family: 'Montserrat', sans-serif;
          background: linear-gradient(180deg, var(--white) 0%, var(--cream) 50%, var(--champagne-light) 100%);
          position: relative;
          overflow: hidden;
        }

        .footer-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            var(--champagne) 20%,
            var(--champagne-dark) 50%,
            var(--champagne) 80%,
            transparent 100%
          );
        }

        .footer-logo {
          font-family: 'Libre Baskerville', serif;
          font-weight: 700;
          letter-spacing: 0.15em;
          background: linear-gradient(135deg, var(--brown) 0%, var(--brown-light) 50%, var(--brown-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          display: inline-block;
          transition: all 0.4s ease;
        }

        .footer-logo::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--brown), var(--champagne));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .footer-logo:hover::after {
          opacity: 1;
        }

        .footer-text {
          color: var(--brown-light);
          line-height: 1.8;
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .footer-heading {
          color: var(--brown-dark);
          font-weight: 600;
          font-size: 1.125rem;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.875rem;
          text-transform: uppercase;
          font-size: 0.875rem;
        }

        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 3rem;
          height: 2px;
          background: linear-gradient(90deg, var(--brown) 0%, var(--champagne) 100%);
          border-radius: 2px;
        }

        .footer-link {
          color: var(--brown-light);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9375rem;
          font-weight: 400;
          padding: 0.5rem 0;
          position: relative;
          letter-spacing: 0.01em;
        }

        .footer-link::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0.25rem;
          width: 0;
          height: 1px;
          background: var(--brown);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-link:hover {
          color: var(--brown-dark);
          transform: translateX(6px);
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .social-button {
          position: relative;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--white);
          border: 2px solid var(--champagne);
          color: var(--brown);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .social-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0);
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .social-button:hover {
          border-color: var(--brown);
          transform: translateY(-6px) rotate(5deg);
          box-shadow: 0 8px 24px rgba(107, 68, 35, 0.2);
        }

        .social-button:hover::before {
          opacity: 1;
          transform: scale(1);
        }

        .social-button svg {
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .social-button:hover svg {
          color: var(--brown-dark);
          transform: scale(1.15) rotate(-5deg);
        }

        .newsletter-wrapper {
          background: linear-gradient(135deg, var(--white) 0%, var(--champagne-light) 100%);
          border-radius: 1.25rem;
          padding: 3rem 2rem;
          box-shadow: 0 4px 24px rgba(107, 68, 35, 0.08);
          border: 2px solid var(--champagne);
          position: relative;
          overflow: hidden;
        }

        .newsletter-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, var(--champagne-light) 0%, transparent 70%);
          opacity: 0.4;
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        .newsletter-content {
          position: relative;
          z-index: 1;
        }

        .newsletter-input-wrapper {
          position: relative;
          background: var(--white);
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(107, 68, 35, 0.08);
          border: 2px solid var(--champagne);
          transition: all 0.3s ease;
        }

        .newsletter-input-wrapper:focus-within {
          border-color: var(--brown-light);
          box-shadow: 0 4px 20px rgba(107, 68, 35, 0.15);
          transform: translateY(-2px);
        }

        .newsletter-input {
          background: transparent;
          border: none;
          color: var(--brown);
          padding: 1rem 1.25rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
          width: 100%;
          letter-spacing: 0.01em;
        }

        .newsletter-input:focus {
          outline: none;
        }

        .newsletter-input::placeholder {
          color: var(--brown-light);
          font-weight: 400;
        }

        .newsletter-button {
          background: linear-gradient(135deg, var(--brown) 0%, var(--brown-dark) 100%);
          color: var(--champagne-light);
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.9375rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          box-shadow: 0 4px 16px rgba(107, 68, 35, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .newsletter-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(107, 68, 35, 0.4);
        }

        .newsletter-button:active {
          transform: translateY(-1px);
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            var(--champagne-dark) 10%,
            var(--champagne) 50%,
            var(--champagne-dark) 90%,
            transparent 100%
          );
          margin: 3rem 0;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          color: var(--brown-light);
          font-size: 0.9375rem;
          line-height: 1.7;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }

        .contact-item:hover {
          color: var(--brown-dark);
          transform: translateX(4px);
        }

        .contact-item svg {
          color: var(--brown);
          flex-shrink: 0;
          margin-top: 0.125rem;
          transition: all 0.3s ease;
        }

        .contact-item:hover svg {
          color: var(--brown-dark);
          transform: scale(1.1);
        }

        .footer-bottom {
          background: linear-gradient(135deg, var(--champagne) 0%, var(--champagne-dark) 100%);
          color: var(--brown);
          font-weight: 500;
          border-top: 1px solid rgba(107, 68, 35, 0.1);
        }

        .footer-bottom-link {
          transition: all 0.2s ease;
          position: relative;
        }

        .footer-bottom-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--brown-dark);
          transition: width 0.3s ease;
        }

        .footer-bottom-link:hover {
          color: var(--brown-dark);
        }

        .footer-bottom-link:hover::after {
          width: 100%;
        }

        .brand-description {
          max-width: 20rem;
          font-size: 0.9375rem;
        }

        @media (max-width: 768px) {
          .footer-heading {
            font-size: 0.8125rem;
            margin-bottom: 1.25rem;
          }

          .newsletter-wrapper {
            padding: 2rem 1.5rem;
          }

          .newsletter-button {
            width: 100%;
            justify-content: center;
          }
        }

        /* Decorative elements */
        .section-decoration {
          position: relative;
        }

        .section-decoration::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, var(--brown) 0%, var(--champagne) 100%);
          border-radius: 2px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .section-decoration:hover::before {
          opacity: 1;
        }
      `}</style>

      <footer className="footer-container">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <Link to="/" className="footer-logo text-3xl lg:text-3xl inline-block mb-6">
                ÉLÉGANCE
              </Link>
              <p className="footer-text brand-description mb-8">
                Curating exceptional quality and timeless elegance. Every piece tells a story of craftsmanship and sophistication.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" strokeWidth={1.5} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" strokeWidth={1.5} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="section-decoration pl-0 lg:pl-6">
              <h4 className="footer-heading">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop" className="footer-link">
                    Shop Collection
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="footer-link">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="section-decoration pl-0 lg:pl-6">
              <h4 className="footer-heading">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/shipping" className="footer-link">
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="footer-link">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="footer-link">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="footer-link">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="section-decoration pl-0 lg:pl-6">
              <h4 className="footer-heading">Connect</h4>
              <div className="space-y-4">
                <div className="contact-item">
                  <MapPin className="h-5 w-5" strokeWidth={1.5} />
                  <span>123 Boutique Avenue<br />Lagos, Nigeria</span>
                </div>
                <div className="contact-item">
                  <Phone className="h-5 w-5" strokeWidth={1.5} />
                  <span>+234 (0) 123 456 789</span>
                </div>
                <div className="contact-item">
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                  <span>hello@elegance.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mb-16">
            <div className="newsletter-wrapper">
              <div className="newsletter-content max-w-3xl mx-auto text-center">
                <h3 className="text-2xl lg:text-3xl font-bold mb-3" style={{
                  fontFamily: "'Libre Baskerville', serif",
                  background: 'linear-gradient(135deg, var(--brown) 0%, var(--brown-light) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Join Our Exclusive Circle
                </h3>
                <p className="footer-text text-base mb-8 max-w-xl mx-auto">
                  Be the first to discover new collections, exclusive offers, and timeless style inspiration.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                  <div className="newsletter-input-wrapper flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="newsletter-input"
                    />
                  </div>
                  <button className="newsletter-button">
                    <span>Subscribe</span>
                    <Send className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-divider"></div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="footer-text font-medium">
              © {currentYear} Élégance. Crafted with excellence.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy" className="footer-text footer-bottom-link">
                Privacy
              </Link>
              <Link to="/terms" className="footer-text footer-bottom-link">
                Terms
              </Link>
              <Link to="/cookies" className="footer-text footer-bottom-link">
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
