import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "shop-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    initializeCart();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const userId = session?.user?.id || null;
      setCurrentUserId(userId);
      
      if (event === 'SIGNED_IN' && userId) {
        await loadAndMergeCart(userId, items);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const initializeCart = async () => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const localCart: CartItem[] = stored ? JSON.parse(stored) : [];
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setCurrentUserId(user.id);
      await loadAndMergeCart(user.id, localCart);
    } else {
      setItems(localCart);
    }
  };

  const loadAndMergeCart = async (userId: string, localCart: CartItem[]) => {
    try {
      const { data: dbCartItems } = await supabase
        .from('user_carts')
        .select('product_id, quantity, products(id, name, price, category, product_images(image_url, is_primary))')
        .eq('user_id', userId);

      const dbCart: CartItem[] = (dbCartItems || [])
        .filter(item => item.products)
        .map(item => ({
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          category: item.products.category,
          image: item.products.product_images?.find(img => img.is_primary)?.image_url || '',
          quantity: item.quantity,
        }));

      const merged = mergeCart(localCart, dbCart);
      setItems(merged);
      await syncCartToDatabase(userId, merged);
    } catch (error) {
      console.error('Cart sync error:', error);
    }
  };

  const mergeCart = (cart1: CartItem[], cart2: CartItem[]): CartItem[] => {
    const merged = new Map<string, CartItem>();
    cart1.forEach(item => merged.set(item.id, { ...item }));
    cart2.forEach(item => {
      const existing = merged.get(item.id);
      if (existing) {
        existing.quantity = Math.max(existing.quantity, item.quantity);
      } else {
        merged.set(item.id, { ...item });
      }
    });
    return Array.from(merged.values());
  };

  const syncCartToDatabase = async (userId: string, cartItems: CartItem[]) => {
    try {
      await supabase.from('user_carts').delete().eq('user_id', userId);
      if (cartItems.length > 0) {
        const dbCartItems = cartItems.map(item => ({
          user_id: userId,
          product_id: item.id,
          quantity: item.quantity,
        }));
        await supabase.from('user_carts').insert(dbCartItems);
      }
    } catch (error) {
      console.error('Database sync error:', error);
    }
  };

  const persistCart = async (newItems: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    if (currentUserId) await syncCartToDatabase(currentUserId, newItems);
  };

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const newItems = existing
        ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { ...item, quantity: 1 }];
      persistCart(newItems);
      toast({ title: "Added to cart", description: `${item.name} added` });
      return newItems;
    });
  };

  const removeFromCart = async (id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id);
      persistCart(newItems);
      toast({ title: "Removed from cart" });
      return newItems;
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setItems((prev) => {
      const newItems = prev.map((item) => (item.id === id ? { ...item, quantity } : item));
      persistCart(newItems);
      return newItems;
    });
  };

  const clearCart = async () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    if (currentUserId) {
      await supabase.from('user_carts').delete().eq('user_id', currentUserId);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// IMPORTANT: This export must be present for Navbar.tsx to import useCart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
