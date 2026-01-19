import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Star, ShoppingCart, Heart, ArrowLeft, Check, Shield, Truck, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductById, getRelatedProducts } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const product = id ? getProductById(id) : undefined;
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  
  const isLiked = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        `}</style>
        <div className="min-h-screen bg-[var(--cream)]">
          <Navbar />
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Libre Baskerville', serif", color: 'var(--charcoal)' }}>
              Product Not Found
            </h1>
            <Link to="/">
              <Button>Back to Shop</Button>
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, product.category);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 3000);
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

        .product-detail-page {
          background: linear-gradient(180deg, var(--cream) 0%, var(--white) 50%, var(--champagne) 100%);
          font-family: 'Montserrat', sans-serif;
        }

        .back-button {
          background: transparent;
          border: 2px solid var(--champagne);
          color: var(--charcoal);
          padding: 0.75rem 1.5rem;
          border-radius: 0.625rem;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-button:hover {
          background: var(--champagne);
          border-color: var(--gold);
          transform: translateX(-4px);
        }

        .image-gallery-main {
          aspect-ratio: 1;
          background: var(--cream);
          border-radius: 1.25rem;
          overflow: hidden;
          border: 2px solid var(--champagne);
          transition: all 0.3s ease;
        }

        .image-gallery-main:hover {
          border-color: var(--gold-light);
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.15);
        }

        .image-gallery-main img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-gallery-main:hover img {
          transform: scale(1.05);
        }

        .thumbnail-button {
          aspect-ratio: 1;
          background: var(--cream);
          border-radius: 0.75rem;
          overflow: hidden;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .thumbnail-button:hover {
          border-color: var(--gold-light);
        }

        .thumbnail-button.active {
          border-color: var(--gold);
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
        }

        .thumbnail-button img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-category {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gold-dark);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.75rem;
        }

        .product-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--charcoal);
          line-height: 1.2;
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }

        .rating-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .rating-stars {
          display: flex;
          gap: 0.25rem;
        }

        .star-icon {
          width: 1.125rem;
          height: 1.125rem;
          color: var(--gold);
        }

        .star-icon.filled {
          fill: var(--gold);
        }

        .star-icon.empty {
          color: var(--champagne);
        }

        .rating-text {
          font-size: 0.875rem;
          color: var(--charcoal-light);
          font-weight: 500;
        }

        .product-price {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          line-height: 1;
        }

        .product-description {
          color: var(--charcoal-light);
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .selection-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--charcoal);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
          display: block;
        }

        .size-button {
          padding: 0.75rem 1.5rem;
          border: 2px solid var(--champagne);
          background: var(--white);
          border-radius: 0.625rem;
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--charcoal);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          letter-spacing: 0.02em;
        }

        .size-button:hover {
          border-color: var(--gold);
          background: var(--champagne);
        }

        .size-button.selected {
          border-color: var(--gold);
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: var(--charcoal);
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
        }

        .color-button {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: 3px solid var(--champagne);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-button:hover {
          transform: scale(1.1);
          border-color: var(--gold-light);
        }

        .color-button.selected {
          border-color: var(--gold);
          transform: scale(1.15);
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
        }

        .stock-indicator {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.75rem 1.25rem;
          background: var(--champagne);
          border-radius: 0.625rem;
          margin-bottom: 1.5rem;
          border: 1px solid var(--gold-light);
        }

        .stock-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          background: var(--gold);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .stock-dot.out-of-stock {
          background: var(--charcoal-light);
        }

        .stock-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--charcoal);
          letter-spacing: 0.02em;
        }

        .add-to-cart-button {
          flex: 1;
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
          color: var(--ivory);
          border: none;
          padding: 1rem 2rem;
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
          position: relative;
          overflow: hidden;
        }

        .add-to-cart-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .add-to-cart-button:hover::before {
          opacity: 1;
        }

        .add-to-cart-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(26, 26, 26, 0.35);
        }

        .add-to-cart-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .add-to-cart-button:disabled:hover {
          transform: none;
        }

        .add-to-cart-button span,
        .add-to-cart-button svg {
          position: relative;
          z-index: 1;
        }

        .wishlist-button {
          width: 3.5rem;
          height: 3.5rem;
          background: var(--white);
          border: 2px solid var(--champagne);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .wishlist-button:hover {
          border-color: var(--gold);
          background: var(--champagne);
          transform: translateY(-3px);
        }

        .wishlist-button.liked {
          border-color: var(--gold);
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--champagne) 100%);
        }

        .wishlist-button svg {
          width: 1.375rem;
          height: 1.375rem;
          color: var(--charcoal);
          transition: all 0.3s ease;
        }

        .wishlist-button.liked svg {
          fill: var(--gold);
          color: var(--gold);
        }

        .features-section {
          background: var(--white);
          border: 2px solid var(--champagne);
          border-radius: 1rem;
          padding: 2rem;
          margin-top: 2rem;
        }

        .features-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 1.25rem;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: var(--charcoal-light);
          font-size: 0.9375rem;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .feature-item svg {
          color: var(--gold);
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin: 3rem 0;
          padding: 2rem;
          background: linear-gradient(135deg, var(--champagne) 0%, var(--gold-light) 100%);
          border-radius: 1rem;
        }

        .benefit-item {
          text-align: center;
        }

        .benefit-icon-wrapper {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          background: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--gold);
        }

        .benefit-icon {
          width: 2rem;
          height: 2rem;
          color: var(--gold-dark);
        }

        .benefit-title {
          font-weight: 600;
          color: var(--charcoal);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .benefit-description {
          font-size: 0.8125rem;
          color: var(--charcoal-light);
        }

        .reviews-section {
          margin: 4rem 0;
        }

        .section-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 2rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 2rem;
          position: relative;
          padding-bottom: 1rem;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--champagne) 100%);
          border-radius: 2px;
        }

        .review-card {
          background: var(--white);
          border: 2px solid var(--champagne);
          border-radius: 1rem;
          padding: 1.75rem;
          transition: all 0.3s ease;
        }

        .review-card:hover {
          border-color: var(--gold-light);
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.15);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .review-author {
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 0.25rem;
        }

        .review-date {
          font-size: 0.8125rem;
          color: var(--charcoal-light);
        }

        .verified-badge {
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--champagne) 100%);
          color: var(--charcoal);
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: 1px solid var(--gold);
        }

        .review-comment {
          color: var(--charcoal-light);
          line-height: 1.7;
          font-size: 0.9375rem;
        }

        .added-notification {
          position: fixed;
          top: 6rem;
          right: 2rem;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: var(--charcoal);
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
          z-index: 1000;
          animation: slide-in-right 0.3s ease-out;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          border: 2px solid var(--white);
        }

        @keyframes slide-in-right {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .product-title {
            font-size: 2rem;
          }

          .product-price {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="product-detail-page min-h-screen">
        <Navbar />
        
        {showAddedNotification && (
          <div className="added-notification">
            <Check className="h-5 w-5" strokeWidth={2.5} />
            <span>Added to cart successfully!</span>
          </div>
        )}
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <button onClick={() => navigate(-1)} className="back-button mb-8">
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            <span>Back</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="image-gallery-main">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail-button ${selectedImage === index ? 'active' : ''}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <p className="product-category">{product.category}</p>
              <h1 className="product-title">{product.name}</h1>
              
              {/* Rating */}
              <div className="rating-container">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`star-icon ${i < Math.floor(product.rating) ? 'filled' : 'empty'}`}
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <p className="product-price">
                ${product.price.toFixed(2)}
              </p>

              <p className="product-description">
                {product.description}
              </p>

              {/* Size Selection */}
              {product.sizes && (
                <div className="mb-6">
                  <label className="selection-label">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && (
                <div className="mb-6">
                  <label className="selection-label">
                    Select Color
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`color-button ${selectedColor === color.name ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {selectedColor === color.name && (
                          <Check className="h-5 w-5 text-white" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="stock-indicator">
                <div className={`stock-dot ${!product.inStock ? 'out-of-stock' : ''}`} />
                <span className="stock-text">
                  {product.inStock ? 'In Stock - Ready to Ship' : 'Currently Unavailable'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="add-to-cart-button"
                >
                  <ShoppingCart className="h-5 w-5" strokeWidth={2} />
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={() => toggleWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                  })}
                  className={`wishlist-button ${isLiked ? 'liked' : ''}`}
                >
                  <Heart strokeWidth={2} />
                </button>
              </div>

              {/* Benefits */}
              <div className="benefits-grid">
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper">
                    <Truck className="benefit-icon" strokeWidth={1.5} />
                  </div>
                  <div className="benefit-title">Free Shipping</div>
                  <div className="benefit-description">On orders over $100</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper">
                    <Shield className="benefit-icon" strokeWidth={1.5} />
                  </div>
                  <div className="benefit-title">Secure Payment</div>
                  <div className="benefit-description">100% protected</div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon-wrapper">
                    <RefreshCw className="benefit-icon" strokeWidth={1.5} />
                  </div>
                  <div className="benefit-title">Easy Returns</div>
                  <div className="benefit-description">30-day guarantee</div>
                </div>
              </div>

              {/* Features */}
              <div className="features-section">
                <h3 className="features-title">Key Features</h3>
                <div>
                  {product.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <Check className="h-5 w-5" strokeWidth={2} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2 className="section-title">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div>
                      <p className="review-author">{review.author}</p>
                      <p className="review-date">{review.date}</p>
                    </div>
                    {review.verified && (
                      <span className="verified-badge">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="rating-stars mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`star-icon ${i < review.rating ? 'filled' : 'empty'}`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="section-title">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    image={relatedProduct.image}
                    name={relatedProduct.name}
                    price={relatedProduct.price}
                    category={relatedProduct.category}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
