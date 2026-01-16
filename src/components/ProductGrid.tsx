import ProductCard from "./ProductCard";
import { Product } from "@/data/products";
import { motion } from "framer-motion";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <section className="py-20 bg-[#faf8f4]">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#3b2f2f] mb-4">
            Featured Products
          </h2>

          {/* Champagne Accent */}
          <div className="mx-auto mb-4 h-[2px] w-20 bg-[#c2a46d]/70 rounded-full" />

          <p className="text-[#6b5c4d] max-w-2xl mx-auto">
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"} found
          </p>
        </motion.div>

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
                index={index} // 🔥 sync stagger
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-[#6b5c4d] text-lg">
              No products found matching your filters.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
