import React, { createContext, useContext, useState, useCallback } from "react";
import type { Book } from "@/data/books";

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((book: Book) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) {
        return prev.map((i) =>
          i.book.id === book.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((bookId: string) => {
    setItems((prev) => prev.filter((i) => i.book.id !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.book.id !== bookId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.book.id === bookId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.book.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
