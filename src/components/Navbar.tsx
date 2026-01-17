import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, User, Heart, X } from "lucide-react";
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

        .nav-container {
          font-family: 'Cormorant Garamond', serif;
        }

        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, var(--brown) 0%, var(--brown-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }

        .nav-logo:hover {
          background: linear-gradient(135deg, var(--brown-dark) 0%, var(--brown) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transform: translateY(-1px);
        }

        .nav-scrolled {
          background: var(--white);
          box-shadow: 0 4px 24px rgba(107, 68, 35, 0.08);
          border-bottom: 1px solid var(--champagne);
        }

        .nav-base {
          background: var(--cream);
          border-bottom: 1px solid var(--champagne-dark);
        }

        .icon-button {
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: var(--brown);
        }

        .icon-button:hover {
          transform: translateY(-2px);
          color: var(--brown-dark);
        }

        .icon-button::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 0.5rem;
          background: linear-gradient(135deg, var(--champagne) 0%, var(--champagne-light) 100%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .icon-button:hover::before {
          opacity: 1;
        }

        .icon-button > * {
          position: relative;
          z-index: 1;
        }

        .badge-count {
          animation: badge-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes badge-pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .mobile-menu-enter {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .mobile-menu-overlay {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .mobile-menu-item {
          transition: all 0.2s ease;
          padding: 0.875rem 1.25rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          color: var(--brown);
          font-weight: 500;
          font-size: 1.0625rem;
        }

        .mobile-menu-item:hover {
          background: var(--champagne-light);
          transform: translateX(6px);
        }

        .search-bar {
          animation: searchExpand 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes searchExpand {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .search-input {
          background: var(--white);
          border: 1.5px solid var(--champagne-dark);
          color: var(--brown);
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--brown-light);
          box-shadow: 0 0 0 3px rgba(107, 68, 35, 0.1);
        }

        .search-input::placeholder {
          color: var(--brown-light);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            var(--champagne-dark) 50%, 
            transparent 100%
          );
          margin: 1.5rem 0;
        }

        .badge-wishlist {
          background: linear-gradient(135deg, var(--brown-light) 0%, var(--brown) 100%);
          color: var(--white);
          box-shadow: 0 2px 8px rgba(107, 68, 35, 0.3);
        }

        .badge-cart {
          background: linear-gradient(135deg, var(--brown) 0%, var(--brown-dark) 100%);
          color: var(--champagne-light);
          box-shadow: 0 2px 8px rgba(107, 68, 35, 0.4);
        }

        .badge-mobile {
          background: var(--champagne);
          color: var(--brown-dark);
          font-weight: 600;
        }

        .mobile-menu-bg {
          background: var(--cream);
        }

        .mobile-menu-header {
          border-bottom: 1px solid var(--champagne-dark);
          background: var(--white);
        }

        .mobile-menu-footer {
          border-top: 1px solid var(--champagne-dark);
          background: var(--champagne-light);
          color: var(--brown-light);
        }

        /* Smooth transitions for all interactive elements */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        .hover-bg-champagne:hover {
          background: var(--champagne-light);
        }
      `}</style>

      <nav
        className={`nav-container sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "nav-scrolled" : "nav-base"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="nav-logo text-2xl sm:text-3xl flex-shrink-0">
              SHOP
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {/* Search Icon */}
              <button
                className="icon-button p-2.5 rounded-lg transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* User Icon */}
              <Link to="/account">
                <button
                  className="icon-button p-2.5 rounded-lg transition-colors"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </button>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist">
                <button
                  className="icon-button relative p-2.5 rounded-lg transition-colors"
                  aria-label={`Wishlist (${wishlistItems} items)`}
                >
                  <Heart className="h-5 w-5" />
                  {wishlistItems > 0 && (
                    <span className="badge-count badge-wishlist absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-semibold flex items-center justify-center">
                      {wishlistItems > 9 ? "9+" : wishlistItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <button
                  className="icon-button relative p-2.5 rounded-lg transition-colors"
                  aria-label={`Cart (${totalItems} items)`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="badge-count badge-cart absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-semibold flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden icon-button p-2.5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop Search Bar */}
          {isSearchOpen && (
            <div className="search-bar pb-4 pt-2">
              <div className="flex items-center gap-3 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--brown-light)]" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="search-input w-full pl-12 pr-4 py-3 rounded-xl font-medium"
                    autoFocus
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        scrollToFilterBar();
                      }
                    }}
                  />
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="icon-button p-2.5 rounded-lg transition-colors"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
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
            className="mobile-menu-overlay fixed inset-0 bg-[var(--brown-dark)]/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="mobile-menu-enter mobile-menu-bg relative z-50 w-80 max-w-[85vw] h-full shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="mobile-menu-header flex justify-between items-center p-6">
                <Link
                  to="/"
                  className="nav-logo text-3xl"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SHOP
                </Link>
                <button
                  className="icon-button p-2 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-1">
                  {/* Search */}
                  <button
                    className="mobile-menu-item w-full text-left"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setTimeout(scrollToFilterBar, 300);
                    }}
                  >
                    <Search className="h-5 w-5" />
                    <span>Search Products</span>
                  </button>

                  <div className="divider" />

                  {/* Account */}
                  <Link
                    to="/account"
                    className="mobile-menu-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>My Account</span>
                  </Link>

                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="mobile-menu-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5" />
                    <span className="flex-1">Wishlist</span>
                    {wishlistItems > 0 && (
                      <span className="badge-mobile px-2.5 py-1 rounded-full text-sm">
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
                    <ShoppingCart className="h-5 w-5" />
                    <span className="flex-1">Shopping Cart</span>
                    {totalItems > 0 && (
                      <span className="badge-mobile px-2.5 py-1 rounded-full text-sm">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <div className="mobile-menu-footer p-6">
                <p className="text-sm text-center font-medium">
                  © 2024 SHOP. All rights reserved.
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
