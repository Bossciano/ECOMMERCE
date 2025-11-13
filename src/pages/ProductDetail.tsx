import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Star, ShoppingCart, Heart, ArrowLeft, Check } from "lucide-react";
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
  
  const isLiked = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Back to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
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
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-secondary rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-foreground font-medium">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && (
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md transition-colors ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
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
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Select Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-primary scale-110"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check className="h-5 w-5 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-primary" : "bg-destructive"}`} />
              <span className="text-sm text-foreground">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleWishlist({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: product.category,
                })}
                className={isLiked ? "border-accent" : ""}
              >
                <Heart
                  className={`h-5 w-5 ${isLiked ? "fill-accent text-accent" : ""}`}
                />
              </Button>
            </div>

            <Separator className="mb-6" />

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{review.author}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "fill-accent text-accent" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-foreground">{review.comment}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">You May Also Like</h2>
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
  );
};

export default ProductDetail;
