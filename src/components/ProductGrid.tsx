import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  stock_quantity: number;
  rating: number | null;
  is_active: boolean;
  product_images: Array<{
    image_url: string;
    is_primary: boolean;
  }> | null;
}

interface ProductGridProps {
  products?: Product[];
}

const ProductGrid = ({ products: propsProducts }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>(propsProducts || []);
  const [loading, setLoading] = useState(!propsProducts);

  useEffect(() => {
    // Only fetch if products weren't provided via props
    if (!propsProducts) {
      fetchProducts();
    }
  }, [propsProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          category,
          description,
          stock_quantity,
          rating,
          is_active,
          product_images (
            image_url,
            is_primary
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error("Error in fetchProducts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center bg-[#faf8f4]">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-200">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-[#faf8f4]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3b2f2f] mb-4">
            Featured Products
          </h2>
          <div className="mx-auto mb-4 h-[2px] w-20 bg-[#c2a46d]/70 rounded-full" />
          <p className="text-[#6b5c4d] max-w-2xl mx-auto">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const primaryImage = product.product_images?.find(img => img.is_primary);
              const imageUrl = primaryImage?.image_url || product.product_images?.[0]?.image_url || '/placeholder.svg';
              
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={imageUrl}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#6b5c4d] text-lg">No products found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
