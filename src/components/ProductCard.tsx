import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  price: number;
  category: string;
}

const ProductCard = ({ id, image, name, price, category }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(id);

  return (
    <Card className="group overflow-hidden rounded-2xl border border-[#e6dccb] bg-[#faf8f4] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${id}`}>
        {/* Image */}
        <div className="relative aspect-square bg-[#f3eee6] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-[#faf8f4]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="bg-[#3b2f2f] hover:bg-[#2a211f] text-[#faf8f4]"
              onClick={(e) => {
                e.preventDefault();
                addToCart({ id, name, price, image, category });
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist({ id, name, price, image, category });
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-[#faf8f4]/90 hover:bg-[#faf8f4]"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isLiked
                  ? "fill-[#c2a46d] text-[#c2a46d]"
                  : "text-[#6b5c4d]"
              }`}
            />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[#6b5c4d] mb-1">
          {category}
        </p>

        <h3 className="font-semibold text-[#3b2f2f] mb-2">
          {name}
        </h3>

        <p className="text-lg font-bold text-[#c2a46d]">
          ₦{price.toFixed(2)}
        </p>
      </div>
    </Card>
  );
};

export default ProductCard;
