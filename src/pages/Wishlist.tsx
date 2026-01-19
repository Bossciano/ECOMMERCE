import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
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
          --champagne: #F7E7CE;
          --white: #FFFFFF;
        }

        .wishlist-page {
          background: linear-gradient(180deg, var(--cream) 0%, var(--white) 50%, var(--champagne-light) 100%);
          min-height: 100vh;
        }

        .wishlist-header {
          background: linear-gradient(135deg, var(--white) 0%, var(--cream) 100%);
          border-bottom: 2px solid var(--champagne);
          position: relative;
          overflow: hidden;
        }

        .wishlist-header::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -20px); }
        }

        .wishlist-title {
          font-family: 'Libre Baskerville', serif;
          font-weight: 700;
          color: var(--charcoal);
          letter-spacing: -0.01em;
          position: relative;
          display: inline-block;
        }

        .wishlist-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--champagne) 100%);
          border-radius: 2px;
        }

        .wishlist-count {
          font-family: 'Montserrat', sans-serif;
          color: var(--charcoal-light);
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .wishlist-count-number {
          color: var(--gold-dark);
          font-weight: 700;
        }

        .wishlist-grid {
          animation: fade-in 0.6s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .wishlist-card {
          background: var(--white);
          border: 2px solid var(--champagne);
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .wishlist-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--champagne) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .wishlist-card:hover::before {
          opacity: 0.1;
        }

        .wishlist-card:hover {
          border-color: var(--gold);
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.2);
        }

        .wishlist-card > * {
          position: relative;
          z-index: 1;
        }

        .wishlist-image-container {
          position: relative;
          overflow: hidden;
          aspect-ratio: 1;
          background: var(--cream);
        }

        .wishlist-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wishlist-card:hover .wishlist-image {
          transform: scale(1.1);
        }

        .remove-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: var(--white);
          border: 2px solid var(--champagne);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .remove-button:hover {
          background: var(--charcoal);
          border-color: var(--charcoal);
          transform: rotate(90deg);
        }

        .remove-button svg {
          color: var(--charcoal-light);
          transition: color 0.3s ease;
        }

        .remove-button:hover svg {
          color: var(--white);
        }

        .wishlist-content {
          padding: 1.25rem;
        }

        .wishlist-category {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gold-dark);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }

        .wishlist-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .wishlist-price {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .add-to-cart-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
          color: var(--ivory);
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 0.625rem;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(26, 26, 26, 0.2);
          position: relative;
          overflow: hidden;
        }

        .add-to-cart-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .add-to-cart-btn:hover::before {
          opacity: 1;
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26, 26, 26, 0.3);
        }

        .add-to-cart-btn span,
        .add-to-cart-btn svg {
          position: relative;
          z-index: 1;
        }

        /* Empty state */
        .empty-wishlist {
          text-align: center;
          padding: 6rem 2rem;
          animation: fade-in 0.6s ease-out;
        }

        .empty-icon-wrapper {
          width: 120px;
          height: 120px;
          margin: 0 auto 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--champagne) 0%, var(--gold-light) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(212, 175, 55, 0);
          }
        }

        .empty-icon {
          color: var(--gold-dark);
        }

        .empty-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 1rem;
        }

        .empty-description {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.125rem;
          color: var(--charcoal-light);
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .continue-shopping-btn {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: var(--charcoal);
          border: none;
          padding: 1rem 2.5rem;
          border-radius: 0.75rem;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
        }

        .continue-shopping-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(212, 175, 55, 0.4);
        }

        @media (max-width: 768px) {
          .wishlist-title {
            font-size: 2rem;
          }

          .empty-title {
            font-size: 1.5rem;
          }

          .empty-description {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="wishlist-page flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {/* Header */}
          <div className="wishlist-header py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative z-10">
                <h1 className="wishlist-title text-4xl sm:text-5xl mb-4">
                  My Wishlist
                </h1>
                <p className="wishlist-count text-lg">
                  <span className="wishlist-count-number">{items.length}</span>{' '}
                  {items.length === 1 ? 'treasure' : 'treasures'} curated for you
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            {items.length === 0 ? (
              <div className="empty-wishlist">
                <div className="empty-icon-wrapper">
                  <Heart className="empty-icon h-14 w-14" strokeWidth={1.5} />
                </div>
                <h2 className="empty-title">
                  Your Wishlist Awaits
                </h2>
                <p className="empty-description">
                  Begin your journey of discovery. Save the pieces that speak to your refined taste.
                </p>
                <Link to="/">
                  <button className="continue-shopping-btn">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                    <span>Explore Collection</span>
                  </button>
                </Link>
              </div>
            ) : (
              <div className="wishlist-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="wishlist-card"
                    style={{
                      animation: `fade-in 0.6s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <Link to={`/product/${item.id}`}>
                      <div className="wishlist-image-container">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="wishlist-image"
                        />
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromWishlist(item.id);
                          }}
                          className="remove-button"
                          aria-label="Remove from wishlist"
                        >
                          <X className="h-5 w-5" strokeWidth={2} />
                        </button>
                      </div>
                    </Link>
                    
                    <div className="wishlist-content">
                      <p className="wishlist-category">
                        {item.category}
                      </p>
                      <h3 className="wishlist-name">{item.name}</h3>
                      <p className="wishlist-price">
                        ${item.price.toFixed(2)}
                      </p>
                      
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                        <span>Add to Bag</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Wishlist;
