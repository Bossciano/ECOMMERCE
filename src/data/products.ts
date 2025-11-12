import productWatch from "@/assets/product-watch.jpg";
import productSneakers from "@/assets/product-sneakers.jpg";
import productHeadphones from "@/assets/product-headphones.jpg";
import productBackpack from "@/assets/product-backpack.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  sizes?: string[];
  colors?: { name: string; value: string }[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Timepiece",
    price: 299.99,
    category: "Watches",
    image: productWatch,
    images: [productWatch, productWatch, productWatch],
    description: "Elevate your style with our Classic Timepiece. This sophisticated watch combines timeless design with modern precision. Featuring a stainless steel case, sapphire crystal glass, and a genuine leather strap, it's the perfect accessory for any occasion.",
    features: [
      "Swiss quartz movement for accuracy",
      "Water resistant up to 50 meters",
      "Scratch-resistant sapphire crystal",
      "Genuine Italian leather strap",
      "3-year manufacturer warranty"
    ],
    colors: [
      { name: "Silver", value: "#C0C0C0" },
      { name: "Gold", value: "#FFD700" },
      { name: "Rose Gold", value: "#B76E79" }
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 127,
    reviews: [
      {
        id: "r1",
        author: "Michael Chen",
        rating: 5,
        date: "2024-01-15",
        comment: "Absolutely stunning watch! The craftsmanship is exceptional and it looks even better in person. The leather strap is comfortable and the watch face is the perfect size.",
        verified: true
      },
      {
        id: "r2",
        author: "Sarah Johnson",
        rating: 4,
        date: "2024-01-10",
        comment: "Great quality watch for the price. The only minor issue is that the leather strap took a few days to break in, but now it's very comfortable.",
        verified: true
      },
      {
        id: "r3",
        author: "David Williams",
        rating: 5,
        date: "2024-01-05",
        comment: "This is my second purchase from this brand. The watch keeps perfect time and looks incredibly elegant. Highly recommended!",
        verified: true
      }
    ]
  },
  {
    id: "2",
    name: "Urban Sneakers",
    price: 129.99,
    category: "Footwear",
    image: productSneakers,
    images: [productSneakers, productSneakers, productSneakers],
    description: "Step into comfort and style with our Urban Sneakers. Designed for the modern lifestyle, these sneakers feature premium materials, superior cushioning, and a sleek design that pairs perfectly with any outfit.",
    features: [
      "Premium leather and mesh upper",
      "Memory foam cushioned insole",
      "Durable rubber outsole with traction",
      "Breathable lining for all-day comfort",
      "Stylish design for casual or athletic wear"
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
      { name: "Navy", value: "#1E3A5F" }
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    reviews: [
      {
        id: "r4",
        author: "Emma Davis",
        rating: 5,
        date: "2024-01-20",
        comment: "Most comfortable sneakers I've ever owned! Perfect for walking around the city all day. True to size and great quality.",
        verified: true
      },
      {
        id: "r5",
        author: "James Wilson",
        rating: 4,
        date: "2024-01-12",
        comment: "Really solid sneakers. The cushioning is excellent and they look great with jeans or shorts. Worth every penny.",
        verified: true
      }
    ]
  },
  {
    id: "3",
    name: "Wireless Audio Pro",
    price: 249.99,
    category: "Electronics",
    image: productHeadphones,
    images: [productHeadphones, productHeadphones, productHeadphones],
    description: "Immerse yourself in premium sound quality with our Wireless Audio Pro headphones. Featuring active noise cancellation, 40-hour battery life, and premium audio drivers, these headphones deliver an unparalleled listening experience.",
    features: [
      "Active noise cancellation technology",
      "Premium 40mm audio drivers",
      "40-hour battery life with ANC on",
      "Comfortable over-ear design with memory foam",
      "Built-in microphone for calls",
      "Bluetooth 5.0 connectivity"
    ],
    colors: [
      { name: "Matte Black", value: "#2C2C2C" },
      { name: "Silver", value: "#C0C0C0" },
      { name: "Midnight Blue", value: "#003366" }
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 203,
    reviews: [
      {
        id: "r6",
        author: "Alex Turner",
        rating: 5,
        date: "2024-01-18",
        comment: "The sound quality is phenomenal! The noise cancellation works incredibly well on flights. Battery life is exactly as advertised.",
        verified: true
      },
      {
        id: "r7",
        author: "Lisa Martinez",
        rating: 5,
        date: "2024-01-14",
        comment: "Best headphones I've ever owned. Crystal clear audio, comfortable for long sessions, and the battery lasts forever. 10/10!",
        verified: true
      },
      {
        id: "r8",
        author: "Ryan Thompson",
        rating: 4,
        date: "2024-01-08",
        comment: "Great headphones overall. The only minor complaint is that they're a bit heavy, but the comfort padding makes up for it.",
        verified: true
      }
    ]
  },
  {
    id: "4",
    name: "Leather Backpack",
    price: 189.99,
    category: "Bags",
    image: productBackpack,
    images: [productBackpack, productBackpack, productBackpack],
    description: "Carry your essentials in style with our premium Leather Backpack. Handcrafted from genuine leather, this backpack features multiple compartments, a padded laptop sleeve, and a timeless design that's perfect for work or travel.",
    features: [
      "Genuine full-grain leather construction",
      "Padded laptop compartment (fits up to 15\")",
      "Multiple organizational pockets",
      "Adjustable padded shoulder straps",
      "Durable YKK zippers",
      "Water-resistant treatment"
    ],
    colors: [
      { name: "Cognac Brown", value: "#8B4513" },
      { name: "Black", value: "#000000" },
      { name: "Dark Gray", value: "#4A4A4A" }
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    reviews: [
      {
        id: "r9",
        author: "Chris Anderson",
        rating: 5,
        date: "2024-01-16",
        comment: "This backpack is worth every dollar. The leather quality is exceptional and it has plenty of space for my laptop and daily essentials.",
        verified: true
      },
      {
        id: "r10",
        author: "Jennifer Lee",
        rating: 4,
        date: "2024-01-11",
        comment: "Beautiful backpack with great craftsmanship. It's a bit stiff at first but will break in nicely. Very happy with my purchase!",
        verified: true
      }
    ]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (productId: string, category: string, limit: number = 4): Product[] => {
  return products
    .filter(product => product.id !== productId && product.category === category)
    .slice(0, limit);
};
