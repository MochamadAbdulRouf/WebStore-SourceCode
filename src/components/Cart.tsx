
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export function Cart() {
  const { state, removeItem, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  
  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-muted/50 rounded-full p-6 mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/products">
          <Button>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {/* Cart Header */}
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-semibold">
          Shopping Cart ({state.totalItems} {state.totalItems === 1 ? "item" : "items"})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCart}
          className="text-sm"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Cart
        </Button>
      </div>

      {/* Cart Items */}
      <div className="py-4 space-y-4">
        {state.items.map((item) => (
          <div
            key={item.product.id}
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between",
              "p-4 rounded-lg bg-accent/50 animate-fade-in"
            )}
          >
            {/* Product Image & Info */}
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-white">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="ml-4">
                <Link
                  to={`/product/${item.product.id}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {item.product.name}
                </Link>
                <div className="text-sm text-muted-foreground">
                  ${item.product.price.toFixed(2)} each
                </div>
              </div>
            </div>

            {/* Quantity Controls & Price */}
            <div className="flex items-center w-full sm:w-auto justify-between">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => decreaseQuantity(item.product.id)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="w-8 text-center">{item.quantity}</span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => increaseQuantity(item.product.id)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-center ml-6">
                <div className="font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.product.id)}
                  className="ml-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="pt-6 pb-8">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span className="font-medium">${state.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2 text-sm text-muted-foreground">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between mb-6 text-sm text-muted-foreground">
          <span>Tax</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span>${state.totalPrice.toFixed(2)}</span>
        </div>
        <Link to="/checkout">
          <Button className="w-full">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
