import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
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
          product_images (
            image_url,
            is_primary
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
      } else {
        // Transform data to match Product type
        const transformedProducts = data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          description: p.description,
          inStock: p.stock_quantity > 0,
          rating: p.rating || 0,
          image: p.product_images?.find(img => img.is_primary)?.image_url || '',
          images: p.product_images?.map(img => img.image_url) || []
        }));
        
        setProducts(transformedProducts);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p>Loading products...</p>
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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
                category={product.category}
              />
            ))}
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
