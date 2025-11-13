import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, X } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Start adding products you love to your wishlist
              </p>
              <Link to="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card key={item.id} className="group overflow-hidden">
                  <Link to={`/product/${item.id}`}>
                    <div className="relative overflow-hidden bg-secondary aspect-square">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(item.id);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      {item.category}
                    </p>
                    <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                    <p className="text-lg font-bold text-primary mb-3">
                      ${item.price.toFixed(2)}
                    </p>
                    
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
