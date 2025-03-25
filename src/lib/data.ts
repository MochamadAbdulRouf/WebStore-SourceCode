
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Minimal Desk Lamp",
    description: "A sleek, adjustable desk lamp with wireless charging capability and touch controls. Perfect for your workspace with 3 color temperature modes.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "lighting"
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description: "Premium ergonomic chair with breathable mesh back, adjustable lumbar support, and smooth-rolling casters. Designed for all-day comfort.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "furniture"
  },
  {
    id: "3",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with active noise cancellation, water resistance, and 24-hour battery life with the charging case.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "electronics"
  },
  {
    id: "4",
    name: "Smart Water Bottle",
    description: "Temperature-sensing water bottle with LED indicators to remind you to stay hydrated. Connects to your phone via Bluetooth.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "accessories"
  },
  {
    id: "5",
    name: "Minimalist Wall Clock",
    description: "Simple, elegant wall clock with silent movement and a clean face design. Available in brushed aluminum, black, or white.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "home decor"
  },
  {
    id: "6",
    name: "Ceramic Plant Pot Set",
    description: "Set of 3 minimalist ceramic plant pots in varying sizes. Perfect for succulents and small indoor plants.",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "home decor"
  },
  {
    id: "7",
    name: "Portable Bluetooth Speaker",
    description: "Compact yet powerful Bluetooth speaker with 360° sound and 12-hour battery life. Waterproof and drop-resistant.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "electronics"
  },
  {
    id: "8",
    name: "Leather Notebook",
    description: "Premium leather-bound notebook with 192 pages of acid-free paper. Includes bookmark ribbon and elastic closure.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "stationery"
  }
];

export const categories = [
  { id: "all", name: "All Products" },
  { id: "electronics", name: "Electronics" },
  { id: "furniture", name: "Furniture" },
  { id: "lighting", name: "Lighting" },
  { id: "accessories", name: "Accessories" },
  { id: "home decor", name: "Home Decor" },
  { id: "stationery", name: "Stationery" }
];

export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 4);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "all") return products;
  return products.filter(product => product.category === category);
};
