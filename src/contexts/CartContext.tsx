import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Product } from "@/lib/data";
import { toast } from "sonner";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "INCREASE_QUANTITY"; productId: string }
  | { type: "DECREASE_QUANTITY"; productId: string }
  | { type: "CLEAR_CART" };

type CartContextType = {
  state: CartState;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  return { totalItems, totalPrice };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      );

      let newItems = [...state.items];
      
      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (action.quantity || 1),
        };
      } else {
        // Item doesn't exist, add new item
        newItems.push({
          product: action.product,
          quantity: action.quantity || 1,
        });
      }

      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.product.id !== action.productId
      );
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case "INCREASE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.product.id === action.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case "DECREASE_QUANTITY": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.productId
      );

      // If quantity would become 0, remove the item entirely
      if (existingItem && existingItem.quantity === 1) {
        return cartReducer(state, { type: "REMOVE_ITEM", productId: action.productId });
      }

      // Otherwise decrease the quantity
      const newItems = state.items.map((item) =>
        item.product.id === action.productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      
      return {
        ...state,
        items: newItems,
        ...calculateTotals(newItems),
      };
    }

    case "CLEAR_CART": {
      return initialState;
    }

    default:
      return state;
  }
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage key for localStorage
const CART_STORAGE_KEY = "store_cart";

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with saved state if available
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    if (typeof window === "undefined") return initialState;
    
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : initialState;
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return initialState;
    }
  });

  // Save to localStorage whenever the cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Cart operations
  const addItem = (product: Product, quantity: number = 1) => {
    dispatch({ type: "ADD_ITEM", product, quantity });
    toast.success(`${product.name} added to cart`);
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", productId });
    toast.info("Item removed from cart");
  };

  const increaseQuantity = (productId: string) => {
    dispatch({ type: "INCREASE_QUANTITY", productId });
  };

  const decreaseQuantity = (productId: string) => {
    dispatch({ type: "DECREASE_QUANTITY", productId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.info("Cart cleared");
  };

  const value = {
    state,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
};
