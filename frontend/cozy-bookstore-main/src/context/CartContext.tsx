import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import type { Book } from "@/data/books";
import { cartAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  id: number;
  cart_id: number;
  book_id: string;
  quantity: number;
  book: {
    id: string;
    title: string;
    price: number;
    cover: string;
    author: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => Promise<void>;
  removeFromCart: (bookId: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart from API using cartAPI service
  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartAPI.getCart();
      setItems(data.cart?.items || data.items || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error occurred";
      setError(`Failed to fetch cart: ${errorMsg}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch cart when component mounts
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth initialization
    if (authLoading) return;

    if (isAuthenticated) {
      fetchCart();
    } else {
      // If user is not authenticated, ensure cart is empty and not loading
      setItems([]);
      setLoading(false);
      setError(null);
    }
  }, [fetchCart, isAuthenticated, authLoading]);

  /**
   * Optimistic update: Add item to local state immediately,
   * then sync with server. If server fails, rollback to previous state.
   */
  const addToCart = useCallback(
    async (book: Book) => {
      // Store previous state for rollback
      const previousItems = items;
      
      // Check if book already exists in cart
      const existingItem = items.find((i) => i.book_id === book.id);
      
      // Optimistically update local state
      if (existingItem) {
        setItems((prev) =>
          prev.map((i) =>
            i.book_id === book.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        );
      } else {
        // Create temporary item with generated ID (will be replaced on server response)
        const tempItem: CartItem = {
          id: -1, // Temporary ID
          cart_id: -1,
          book_id: book.id,
          quantity: 1,
          book: {
            id: book.id,
            title: book.title,
            price: book.price,
            cover: book.cover,
            author: book.author || "",
          },
        };
        setItems((prev) => [...prev, tempItem]);
      }

      setError(null);

      try {
        await cartAPI.addToCart(book.id, 1);
        // Refresh cart to get real IDs from server
        await fetchCart();
      } catch (err) {
        // Rollback on failure
        setItems(previousItems);
        const errorMsg = err instanceof Error ? err.message : "Failed to add item";
        setError(`Failed to add item: ${errorMsg}`);
      }
    },
    [items, fetchCart]
  );

  /**
   * Optimistic update: Remove item from local state immediately,
   * then sync with server. If server fails, rollback.
   */
  const removeFromCart = useCallback(
    async (bookId: string) => {
      const item = items.find((i) => i.book_id === bookId);
      if (!item) {
        setError("Item not found in cart");
        return;
      }

      // Store previous state for rollback
      const previousItems = items;

      // Optimistically remove item from local state
      setItems((prev) => prev.filter((i) => i.book_id !== bookId));
      setError(null);

      try {
        await cartAPI.removeFromCart(item.id.toString());
      } catch (err) {
        // Rollback on failure
        setItems(previousItems);
        const errorMsg = err instanceof Error ? err.message : "Failed to remove item";
        setError(`Failed to remove item: ${errorMsg}`);
      }
    },
    [items]
  );

  /**
   * Optimistic update: Update quantity in local state immediately,
   * then sync with server. If server fails, rollback.
   */
  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      // Store previous state for rollback
      const previousItems = items;

      // Optimistically update local state
      if (quantity <= 0) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
        );
      }
      setError(null);

      try {
        await cartAPI.updateCartItem(itemId.toString(), quantity);
      } catch (err) {
        // Rollback on failure
        setItems(previousItems);
        const errorMsg = err instanceof Error ? err.message : "Failed to update cart";
        setError(`Failed to update quantity: ${errorMsg}`);
      }
    },
    [items]
  );

  /**
   * Clear cart using cartAPI service
   */
  const clearCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await cartAPI.clearCart();
      setItems([]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to clear cart";
      setError(`Failed to clear cart: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize computed values to prevent unnecessary re-renders in consuming components
  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.book.price * i.quantity, 0),
    [items]
  );

  // Memoize the context value to prevent unnecessary re-renders
  // This is critical: if the object reference changes on every render,
  // all consumers will re-render even if the data hasn't changed
  const contextValue = useMemo<CartContextType>(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      loading,
      fetchCart,
      error,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, loading, fetchCart, error]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
