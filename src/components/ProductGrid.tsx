import ProductCard from "./ProductCard";
import { Product } from "@/data/products";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <section className="py-20 bg-[#faf8f4]">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3b2f2f] mb-4">
            Featured Products
          </h2>

          {/* Champagne Accent */}
          <div className="mx-auto mb-4 h-[2px] w-20 bg-[#c2a46d]/70 rounded-full" />

          <p className="text-[#6b5c4d] max-w-2xl mx-auto">
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
                category={product.category}
                index={index} // you can keep this if ProductCard uses it
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#6b5c4d] text-lg">
              No products found matching your filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
