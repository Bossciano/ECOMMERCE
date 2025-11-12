import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  category: string;
}

const ProductCard = ({ image, name, price, category }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group overflow-hidden border-border hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden bg-secondary aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
        
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? "fill-accent text-accent" : "text-muted-foreground"}`}
          />
        </button>
      </div>
      
      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          {category}
        </p>
        <h3 className="font-semibold text-foreground mb-2">{name}</h3>
        <p className="text-lg font-bold text-primary">${price.toFixed(2)}</p>
      </div>
    </Card>
  );
};

export default ProductCard;
