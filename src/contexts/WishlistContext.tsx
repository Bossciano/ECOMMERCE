import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setItems([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          product_id,
          products (
            id,
            name,
            price,
            category,
            product_images (
              image_url,
              is_primary
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const wishlistItems: WishlistItem[] = (data || [])
        .filter((item) => item.products)
        .map((item) => ({
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          category: item.products.category,
          image: item.products.product_images?.find((img) => img.is_primary)?.image_url || "",
        }));

      setItems(wishlistItems);
    } catch (error: any) {
      console.error("Error loading wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (item: WishlistItem) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("wishlists")
        .insert({
          user_id: user.id,
          product_id: item.id,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already in wishlist",
            description: "This item is already in your wishlist",
          });
          return;
        }
        throw error;
      }

      setItems((prev) => [...prev, item]);
      toast({
        title: "Added to wishlist",
        description: `${item.name} has been added to your wishlist`,
      });
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const removeFromWishlist = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error: any) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
