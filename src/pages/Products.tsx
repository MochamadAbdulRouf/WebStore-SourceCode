
import React, { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/lib/data";
import { cn } from "@/lib/utils";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filter products when category changes
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      if (selectedCategory === "all") {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(
          products.filter((product) => product.category === selectedCategory)
        );
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              All Products
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of premium, carefully crafted products for your home and lifestyle.
            </p>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "rounded-full text-sm",
                  selectedCategory === category.id && "animate-scale-in"
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Skeleton loading state
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-accent/30 rounded-xl aspect-[3/4] animate-pulse"
                />
              ))
            ) : filteredProducts.length === 0 ? (
              // No products found state
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try selecting a different category or check back later.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory("all")}
                >
                  View All Products
                </Button>
              </div>
            ) : (
              // Product grid
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </main>
      
      {/* Footer (simplified) */}
      <footer className="bg-muted/30 py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SimpleStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
