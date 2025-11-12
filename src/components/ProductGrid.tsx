import ProductCard from "./ProductCard";
import productWatch from "@/assets/product-watch.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBackpack from "@/assets/product-backpack.jpg";

const products = [
  {
    id: 1,
    name: "Classic Timepiece",
    price: 299.99,
    category: "Watches",
    image: productWatch,
  },
  {
    id: 2,
    name: "Urban Sneakers",
    price: 129.99,
    category: "Footwear",
    image: productSneakers,
  },
  {
    id: 3,
    name: "Wireless Audio Pro",
    price: 249.99,
    category: "Electronics",
    image: productHeadphones,
  },
  {
    id: 4,
    name: "Leather Backpack",
    price: 189.99,
    category: "Bags",
    image: productBackpack,
  },
];

const ProductGrid = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked essentials that combine timeless design with modern functionality
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              category={product.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
