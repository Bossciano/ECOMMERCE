import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Sparkles, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
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

          .empty-cart-page {
            background: linear-gradient(180deg, var(--cream) 0%, var(--white) 50%, var(--champagne) 100%);
            min-height: 100vh;
          }

          .empty-cart-container {
            text-align: center;
            padding: 6rem 2rem;
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

          .empty-icon-wrapper {
            width: 140px;
            height: 140px;
            margin: 0 auto 2.5rem;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--champagne) 0%, var(--gold-light) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            animation: pulse-ring 2s ease-in-out infinite;
            border: 3px solid var(--gold);
          }

          @keyframes pulse-ring {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4);
            }
            50% {
              box-shadow: 0 0 0 30px rgba(212, 175, 55, 0);
            }
          }

          .empty-icon {
            color: var(--gold-dark);
          }

          .empty-title {
            font-family: 'Libre Baskerville', serif;
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--charcoal);
            margin-bottom: 1rem;
          }

          .empty-description {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.125rem;
            color: var(--charcoal-light);
            margin-bottom: 2.5rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.7;
          }

          .continue-shopping-btn {
            background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
            color: var(--charcoal);
            border: none;
            padding: 1.125rem 2.5rem;
            border-radius: 0.75rem;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            font-size: 1rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
          }

          .continue-shopping-btn:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 28px rgba(212, 175, 55, 0.4);
          }
        `}</style>

        <div className="empty-cart-page">
          <Navbar />
          <div className="container mx-auto px-4 py-16">
            <div className="empty-cart-container max-w-2xl mx-auto">
              <div className="empty-icon-wrapper">
                <ShoppingBag className="empty-icon h-16 w-16" strokeWidth={1.5} />
              </div>
              <h1 className="empty-title">Your Bag is Empty</h1>
              <p className="empty-description">
                Begin your luxury shopping experience. Discover our curated collection of exceptional pieces.
              </p>
              <Link to="/">
                <button className="continue-shopping-btn">
                  <Sparkles className="h-5 w-5" strokeWidth={2} />
                  <span>Explore Collection</span>
                </button>
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

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

        .cart-page {
          background: linear-gradient(180deg, var(--cream) 0%, var(--white) 50%, var(--champagne) 100%);
          font-family: 'Montserrat', sans-serif;
          min-height: 100vh;
        }

        .cart-header {
          background: linear-gradient(135deg, var(--white) 0%, var(--cream) 100%);
          border-bottom: 2px solid var(--champagne);
          padding: 2rem 0;
          margin-bottom: 3rem;
        }

        .cart-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--charcoal);
          position: relative;
          display: inline-block;
        }

        .cart-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--champagne) 100%);
          border-radius: 2px;
        }

        .clear-cart-btn {
          background: transparent;
          border: 2px solid var(--champagne);
          color: var(--charcoal-light);
          padding: 0.625rem 1.25rem;
          border-radius: 0.625rem;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-cart-btn:hover {
          background: var(--charcoal);
          border-color: var(--charcoal);
          color: var(--white);
        }

        .cart-item-card {
          background: var(--white);
          border: 2px solid var(--champagne);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          animation: slide-in 0.4s ease-out;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .cart-item-card:hover {
          border-color: var(--gold-light);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.15);
        }

        .cart-item-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 0.75rem;
          background: var(--cream);
          border: 2px solid var(--champagne);
        }

        .cart-item-category {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gold-dark);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.375rem;
        }

        .cart-item-name {
          font-weight: 600;
          color: var(--charcoal);
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
        }

        .cart-item-price {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .remove-btn {
          background: transparent;
          border: 2px solid var(--champagne);
          color: var(--charcoal-light);
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: var(--charcoal);
          border-color: var(--charcoal);
          color: var(--white);
          transform: rotate(90deg);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }

        .quantity-btn {
          background: var(--white);
          border: 2px solid var(--champagne);
          color: var(--charcoal);
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quantity-btn:hover {
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--champagne) 100%);
          border-color: var(--gold);
        }

        .quantity-value {
          width: 3rem;
          text-align: center;
          font-weight: 600;
          color: var(--charcoal);
          font-size: 1rem;
        }

        .item-total {
          margin-left: auto;
          font-family: 'Libre Baskerville', serif;
          font-weight: 700;
          color: var(--charcoal);
          font-size: 1.25rem;
        }

        .order-summary-card {
          background: linear-gradient(135deg, var(--white) 0%, var(--cream) 100%);
          border: 2px solid var(--gold);
          border-radius: 1.25rem;
          padding: 2rem;
          position: sticky;
          top: 7rem;
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
        }

        .summary-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--charcoal-light);
          font-weight: 500;
          margin-bottom: 1rem;
          font-size: 0.9375rem;
        }

        .summary-value {
          color: var(--charcoal);
          font-weight: 600;
        }

        .summary-free {
          color: var(--gold-dark);
          font-weight: 700;
        }

        .summary-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 1.5rem 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Libre Baskerville', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 1.5rem;
        }

        .summary-total-value {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
          color: var(--ivory);
          border: none;
          padding: 1.125rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(26, 26, 26, 0.25);
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
        }

        .checkout-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .checkout-btn:hover::before {
          opacity: 1;
        }

        .checkout-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(26, 26, 26, 0.35);
        }

        .checkout-btn span,
        .checkout-btn svg {
          position: relative;
          z-index: 1;
        }

        .continue-btn {
          width: 100%;
          background: transparent;
          border: 2px solid var(--gold);
          color: var(--charcoal);
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.9375rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          transition: all 0.3s ease;
        }

        .continue-btn:hover {
          background: var(--champagne);
          border-color: var(--gold-dark);
        }

        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 0.75rem;
          background: var(--champagne);
          border-radius: 0.5rem;
          color: var(--charcoal-light);
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .secure-badge svg {
          color: var(--gold-dark);
        }

        @media (max-width: 768px) {
          .cart-title {
            font-size: 2rem;
          }

          .cart-item-image {
            width: 100px;
            height: 100px;
          }

          .order-summary-card {
            position: static;
          }
        }
      `}</style>

      <div className="cart-page">
        <Navbar />
        
        <div className="cart-header">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="cart-title">Shopping Bag</h1>
                <button onClick={clearCart} className="clear-cart-btn">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="cart-item-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-4 flex-col sm:flex-row">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image mx-auto sm:mx-0"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="cart-item-category">
                              {item.category}
                            </p>
                            <h3 className="cart-item-name">{item.name}</h3>
                            <p className="cart-item-price">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="remove-btn"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={2} />
                          </button>
                        </div>
                        
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" strokeWidth={2} />
                          </button>
                          <span className="quantity-value">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" strokeWidth={2} />
                          </button>
                          <span className="item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="order-summary-card">
                  <h2 className="summary-title">Order Summary</h2>
                  
                  <div>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span className="summary-value">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="summary-free">Free</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax</span>
                      <span className="summary-value">Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="summary-divider" />

                  <div className="summary-total">
                    <span>Total</span>
                    <span className="summary-total-value">${totalPrice.toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => navigate("/checkout")}
                    className="checkout-btn"
                  >
                    <Lock className="h-5 w-5" strokeWidth={2} />
                    <span>Secure Checkout</span>
                  </button>
                  
                  <Link to="/">
                    <button className="continue-btn">
                      <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                      <span>Continue Shopping</span>
                    </button>
                  </Link>

                  <div className="secure-badge">
                    <Lock className="h-4 w-4" strokeWidth={2} />
                    <span>Secure SSL Encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Cart;
