
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-white border border-border/40 transition-all duration-300",
        featured ? "shadow-md hover:shadow-lg" : "hover:shadow-md",
        "card-hover"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden aspect-square">
        <div className="w-full h-full overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              "image-fade-in",
              imageLoaded && "image-loaded",
              isHovered && "scale-105"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover Overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 transition-opacity duration-300",
              isHovered && "opacity-100"
            )}
          >
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/80 hover:bg-white shadow-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
          {product.category}
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          
          <div className="flex items-center space-x-2">
            <Link to={`/product/${product.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => addItem(product)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
