import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, User, Heart, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Function to scroll to the FilterBar
  const scrollToFilterBar = () => {
    const filterBar = document.getElementById("filter-bar");
    if (filterBar) {
      filterBar.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsSearchOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        :root {
          --gold: #D4AF37;
          --gold-light: #F4E4C1;
          --gold-dark: #B8941F;
          --charcoal: #1A1A1A;
          --charcoal-light: #2D2D2D;
          --ivory: #FFFFF0;
          --cream: #FAF9F6;
          --silver: #C0C0C0;
          --accent: #8B7355;
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }

        .nav-container {
          font-family: 'Montserrat', sans-serif;
          letter-spacing: 0.02em;
        }

        .nav-logo {
          font-family: 'Libre Baskerville', serif;
          font-weight: 700;
          letter-spacing: 0.15em;
          position: relative;
          display: inline-block;
        }

        .nav-logo::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-logo:hover::after {
          width: 100%;
        }

        .nav-scrolled {
          background: rgba(250, 249, 246, 0.98);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(212, 175, 55, 0.1),
                      0 8px 32px rgba(26, 26, 26, 0.08);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .nav-base {
          background: var(--cream);
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
        }

        .icon-button {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--charcoal);
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .icon-button::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, var(--gold-light) 0%, transparent 70%);
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .icon-button:hover::before {
          opacity: 0.3;
          transform: scale(1);
        }

        .icon-button:hover {
          color: var(--gold-dark);
          transform: translateY(-2px);
        }

        .icon-button:active {
          transform: translateY(0);
        }

        .icon-button > * {
          position: relative;
          z-index: 1;
        }

        .badge-count {
          animation: badge-appear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.625rem;
          letter-spacing: 0.02em;
        }

        @keyframes badge-appear {
          0% { 
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% { 
            transform: scale(1.25) rotate(10deg);
          }
          100% { 
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .badge-luxury {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: var(--charcoal);
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .badge-wishlist {
          background: linear-gradient(135deg, var(--accent) 0%, var(--charcoal-light) 100%);
          color: var(--gold-light);
          box-shadow: 0 2px 8px rgba(139, 115, 85, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .search-bar {
          animation: searchSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.03) 100%);
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }

        @keyframes searchSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-input-wrapper {
          position: relative;
          box-shadow: 0 4px 24px rgba(26, 26, 26, 0.08);
        }

        .search-input {
          background: var(--ivory);
          border: 2px solid transparent;
          color: var(--charcoal);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--gold);
          background: var(--cream);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1),
                      0 8px 32px rgba(212, 175, 55, 0.15);
        }

        .search-input::placeholder {
          color: var(--silver);
          font-weight: 400;
        }

        .search-icon {
          color: var(--gold-dark);
        }

        .mobile-menu-overlay {
          animation: overlayFade 0.3s ease;
          background: linear-gradient(135deg, rgba(26, 26, 26, 0.8) 0%, rgba(45, 45, 45, 0.9) 100%);
          backdrop-filter: blur(8px);
        }

        @keyframes overlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mobile-menu-sidebar {
          animation: sidebarSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, var(--cream) 0%, var(--ivory) 100%);
          box-shadow: 4px 0 24px rgba(26, 26, 26, 0.2);
        }

        @keyframes sidebarSlide {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .mobile-menu-header {
          background: linear-gradient(180deg, var(--ivory) 0%, var(--cream) 100%);
          border-bottom: 1px solid var(--gold-light);
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.1);
        }

        .mobile-menu-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--charcoal);
          font-weight: 500;
          font-size: 1rem;
          letter-spacing: 0.02em;
          position: relative;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .mobile-menu-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: linear-gradient(90deg, var(--gold) 0%, transparent 100%);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-menu-item:hover::before {
          width: 100%;
          opacity: 0.15;
        }

        .mobile-menu-item:hover {
          background: linear-gradient(90deg, var(--gold-light) 0%, transparent 100%);
          transform: translateX(8px);
          color: var(--gold-dark);
        }

        .mobile-menu-item > * {
          position: relative;
          z-index: 1;
        }

        .badge-mobile {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: var(--charcoal);
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(212, 175, 55, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .mobile-menu-footer {
          background: linear-gradient(180deg, transparent 0%, var(--gold-light) 100%);
          border-top: 1px solid var(--gold);
          color: var(--charcoal-light);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            var(--gold) 50%, 
            transparent 100%
          );
          margin: 1.5rem 0;
          opacity: 0.3;
        }

        .luxury-text {
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 50%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Shimmer effect for logo */
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .nav-logo:hover {
          background: linear-gradient(90deg, 
            var(--charcoal) 0%, 
            var(--gold) 25%, 
            var(--gold-light) 50%, 
            var(--gold) 75%, 
            var(--charcoal) 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2s linear infinite;
        }

        .premium-border {
          border: 1px solid;
          border-image: linear-gradient(90deg, transparent, var(--gold), transparent) 1;
        }

        /* Close button premium style */
        .close-btn {
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          transform: rotate(90deg);
          color: var(--gold-dark);
        }

        /* Smooth scrollbar for mobile menu */
        .mobile-menu-content::-webkit-scrollbar {
          width: 6px;
        }

        .mobile-menu-content::-webkit-scrollbar-track {
          background: var(--cream);
        }

        .mobile-menu-content::-webkit-scrollbar-thumb {
          background: var(--gold-light);
          border-radius: 3px;
        }

        .mobile-menu-content::-webkit-scrollbar-thumb:hover {
          background: var(--gold);
        }

        /* Elegant hover states */
        .elegant-hover {
          position: relative;
          overflow: hidden;
        }

        .elegant-hover::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, var(--gold-light) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
          opacity: 0;
        }

        .elegant-hover:hover::after {
          width: 200px;
          height: 200px;
          opacity: 0.3;
        }
      `}</style>

      <nav
        className={`nav-container sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled ? "nav-scrolled" : "nav-base"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 sm:h-24 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="nav-logo luxury-text text-2xl sm:text-3xl flex-shrink-0">
              ÉLÉGANCE
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {/* Search Icon */}
              <button
                className="icon-button elegant-hover p-3 rounded-full transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* User Icon */}
              <Link to="/account">
                <button
                  className="icon-button elegant-hover p-3 rounded-full transition-colors"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist">
                <button
                  className="icon-button elegant-hover relative p-3 rounded-full transition-colors"
                  aria-label={`Wishlist (${wishlistItems} items)`}
                >
                  <Heart className="h-5 w-5" strokeWidth={1.5} />
                  {wishlistItems > 0 && (
                    <span className="badge-count badge-wishlist absolute -top-1 -right-1 h-5 w-5 rounded-full text-[0.625rem] font-semibold flex items-center justify-center">
                      {wishlistItems > 9 ? "9+" : wishlistItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <button
                  className="icon-button elegant-hover relative p-3 rounded-full transition-colors"
                  aria-label={`Cart (${totalItems} items)`}
                >
                  <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="badge-count badge-luxury absolute -top-1 -right-1 h-5 w-5 rounded-full text-[0.625rem] font-semibold flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden icon-button elegant-hover p-3 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          {/* Desktop Search Bar */}
          {isSearchOpen && (
            <div className="search-bar pb-6 pt-4">
              <div className="flex items-center gap-4 max-w-3xl mx-auto">
                <div className="flex-1 search-input-wrapper rounded-2xl overflow-hidden">
                  <div className="relative">
                    <Search className="search-icon absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5" strokeWidth={2} />
                    <input
                      type="text"
                      placeholder="Discover luxury products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input w-full pl-14 pr-6 py-4 text-base"
                      autoFocus
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          scrollToFilterBar();
                        }
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="icon-button close-btn elegant-hover p-3 rounded-full transition-all"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="mobile-menu-overlay fixed inset-0"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="mobile-menu-sidebar relative z-50 w-80 max-w-[85vw] h-full">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="mobile-menu-header flex justify-between items-center p-6 sm:p-8">
                <Link
                  to="/"
                  className="nav-logo luxury-text text-3xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ÉLÉGANCE
                </Link>
                <button
                  className="icon-button close-btn p-2 rounded-full transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" strokeWidth={2} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto mobile-menu-content p-6">
                <div className="space-y-2">
                  {/* Search */}
                  <button
                    className="mobile-menu-item w-full text-left"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(scrollToFilterBar, 300);
                    }}
                  >
                    <Search className="h-5 w-5" strokeWidth={1.5} />
                    <span>Search Collection</span>
                  </button>

                  <div className="divider" />

                  {/* Account */}
                  <Link
                    to="/account"
                    className="mobile-menu-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" strokeWidth={1.5} />
                    <span>My Account</span>
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="mobile-menu-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5" strokeWidth={1.5} />
                    <span className="flex-1">Wishlist</span>
                    {wishlistItems > 0 && (
                      <span className="badge-mobile px-3 py-1.5 rounded-full text-xs">
                        {wishlistItems}
                      </span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="mobile-menu-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                    <span className="flex-1">Shopping Bag</span>
                    {totalItems > 0 && (
                      <span className="badge-mobile px-3 py-1.5 rounded-full text-xs">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="mobile-menu-footer p-6 text-center">
                <p className="text-xs font-medium tracking-wider uppercase opacity-70">
                  Curated Luxury Since 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
