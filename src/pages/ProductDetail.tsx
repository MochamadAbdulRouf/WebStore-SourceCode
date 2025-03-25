
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { getProductById, getProductsByCategory, Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const currentProduct = getProductById(id);
      setProduct(currentProduct);

      // Reset state when product changes
      setQuantity(1);
      setIsImageLoaded(false);
      
      // Get related products
      if (currentProduct) {
        const related = getProductsByCategory(currentProduct.category)
          .filter((p) => p.id !== currentProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the product you're looking for.
            </p>
            <Link to="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground">
                  Products
                </Link>
              </li>
              <li className="text-muted-foreground">/</li>
              <li className="text-foreground font-medium truncate max-w-[200px]">
                {product.name}
              </li>
            </ol>
          </nav>
          
          {/* Back Button (Mobile) */}
          <div className="block sm:hidden mb-6">
            <Link to="/products">
              <Button variant="ghost" size="sm" className="group pl-0">
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Products
              </Button>
            </Link>
          </div>
          
          {/* Product Detail */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Product Image */}
            <div className="bg-accent/20 rounded-xl overflow-hidden aspect-square relative">
              <div className={cn(
                "absolute inset-0 bg-accent/30",
                isImageLoaded ? "opacity-0" : "opacity-100",
                "transition-opacity duration-300"
              )} />
              <img
                src={product.image}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover",
                  isImageLoaded ? "opacity-100" : "opacity-0",
                  "transition-opacity duration-500"
                )}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex-1">
                <div className="mb-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
                
                <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                
                <div className="text-2xl font-semibold mb-6">
                  ${product.price.toFixed(2)}
                </div>
                
                <div className="prose max-w-none mb-8">
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="mt-auto">
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm font-medium">Quantity:</span>
                  
                  <div className="flex border border-input rounded-md">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-none"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <div className="flex items-center justify-center w-12 h-10 text-center">
                      {quantity}
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={increaseQuantity}
                      className="h-10 w-10 rounded-none"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
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

export default ProductDetail;
