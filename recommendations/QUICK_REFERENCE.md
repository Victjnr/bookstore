# Quick Reference Guide - Using the New Cart System

## 🚀 Quick Start

### 1. Access Cart in Your Component
```typescript
import { useCart } from "@/context/CartContext";

export function MyComponent() {
  const { items, totalItems, totalPrice, error, addToCart } = useCart();
  
  return (
    <button onClick={() => addToCart(book)}>
      Add to Cart ({totalItems})
    </button>
  );
}
```

### 2. Display Errors
```typescript
const { error } = useCart();

{error && (
  <div className="alert alert-error">
    {error}
  </div>
)}
```

---

## 📋 useCart() Hook API

### Properties
```typescript
interface CartContextType {
  items: CartItem[];           // Array of cart items with full book details
  totalItems: number;          // Sum of all quantities
  totalPrice: number;          // Sum of (price × quantity) for all items
  loading: boolean;            // True while fetching cart from server
  error: string | null;        // Error message if operation failed
}
```

### Methods
```typescript
interface CartContextType {
  // Add item to cart (optimistic update)
  addToCart: (book: Book) => Promise<void>;
  
  // Remove item by book ID (optimistic update)
  removeFromCart: (bookId: string) => Promise<void>;
  
  // Update quantity of cart item by item ID
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  
  // Clear entire cart
  clearCart: () => Promise<void>;
  
  // Manually refresh cart from server
  fetchCart: () => Promise<void>;
}
```

---

## 📦 CartItem Structure

```typescript
interface CartItem {
  id: number;           // Database ID - use this for updates/deletes
  cart_id: number;      // Reference to user's cart
  book_id: string;      // Book identifier
  quantity: number;     // How many of this book
  book: {               // Full book details
    id: string;
    title: string;
    price: number;      // Unit price in dollars
    cover: string;      // Image URL
    author: string;
  };
}
```

---

## 💡 Usage Examples

### Add to Cart
```typescript
import { useCart } from "@/context/CartContext";
import { books } from "@/data/books";

function BookCard({ bookId }: { bookId: string }) {
  const { addToCart } = useCart();
  const book = books.find(b => b.id === bookId);
  
  return (
    <button 
      onClick={() => addToCart(book)}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Add to Cart
    </button>
  );
}
```

### Display Cart Items
```typescript
function CartPage() {
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id} className="border p-4">
          <h3>{item.book.title}</h3>
          <p>${item.book.price.toFixed(2)}</p>
          
          <div className="flex gap-2">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
            <button 
              onClick={() => removeFromCart(item.book_id)}
              className="ml-auto text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      
      <div className="mt-4 text-xl font-bold">
        Total: ${totalPrice.toFixed(2)}
      </div>
    </div>
  );
}
```

### Handle Loading and Errors
```typescript
function Cart() {
  const { items, loading, error } = useCart();
  
  if (loading) {
    return <div className="spinner">Loading cart...</div>;
  }
  
  if (error) {
    return (
      <div className="alert alert-error">
        <strong>Error:</strong> {error}
        <button onClick={() => {/* retry */}}>Retry</button>
      </div>
    );
  }
  
  if (items.length === 0) {
    return <div>Your cart is empty</div>;
  }
  
  return <CartItems items={items} />;
}
```

---

## 🔑 Key Points

### ⚡ Optimistic Updates
- When you add/remove/update items, the UI updates **instantly** (60ms)
- The API call happens in the background
- If it fails, the state **rolls back** automatically
- No "loading" state needed for better UX

### 🔄 Reactive Cart
- Cart automatically syncs when user logs in/out
- Different users have isolated carts
- Token changes → cart updates automatically

### 📡 API Endpoints Used
```
GET    /api/cart              - Fetch user's cart
POST   /api/cart              - Add item to cart
PUT    /api/cart/{id}         - Update item quantity
DELETE /api/cart/{id}         - Remove item from cart
POST   /api/cart/clear        - Clear entire cart
```

### ✅ Error Handling
All operations (add, remove, update, clear) set `error` state on failure:
```typescript
const { error, addToCart } = useCart();

// If addToCart fails, error will be set
await addToCart(book);
if (error) {
  console.log("Failed:", error); // "Failed to add item: Network error"
}
```

---

## 🚨 Common Mistakes

### ❌ Don't do this:
```typescript
// Wrong: token not reactive
const token = localStorage.getItem("authToken");
<CartProvider token={token}>

// Wrong: reading authToken directly
const handleLogin = () => {
  localStorage.setItem("authToken", token);
  // Cart doesn't update until page refresh!
};

// Wrong: ignoring errors
const { addToCart } = useCart();
await addToCart(book); // Error is silent!
```

### ✅ Do this instead:
```typescript
// Right: token from reactive context
const { token } = useAuth();
<CartProvider token={token}>

// Right: using AuthContext
const { login } = useAuth();
const handleLogin = () => {
  login(token, user); // Triggers cart update immediately
};

// Right: displaying errors
const { addToCart, error } = useCart();
await addToCart(book);
if (error) {
  showErrorMessage(error);
}
```

---

## 🧪 Testing

### Test that optimistic update works
```typescript
test('optimistic update', async () => {
  const { result } = renderHook(() => useCart());
  const initialCount = result.current.items.length;
  
  act(() => {
    result.current.addToCart(mockBook);
  });
  
  // Item should be in cart immediately (optimistic)
  expect(result.current.items.length).toBe(initialCount + 1);
});
```

### Test that rollback works on error
```typescript
test('rollback on error', async () => {
  global.fetch = jest.fn(() => 
    Promise.reject(new Error('Network error'))
  );
  
  const { result } = renderHook(() => useCart());
  const initialCount = result.current.items.length;
  
  await act(async () => {
    await result.current.addToCart(mockBook);
  });
  
  // Should rollback to initial state
  expect(result.current.items.length).toBe(initialCount);
  expect(result.current.error).toContain('Network error');
});
```

---

## 📞 Support

### What if cart doesn't update when I login?
1. Check that `App.tsx` wraps `<AuthProvider>` around `<CartProvider>`
2. Make sure `token` is passed to `CartProvider`
3. Check browser DevTools Network tab - is `/api/cart` request being made?

### What if I see network errors?
1. Verify backend is running on `http://localhost:8000`
2. Check `.env.local` has correct `VITE_API_URL`
3. Check CORS is configured in Laravel (`config/cors.php`)

### What if errors aren't displaying?
1. Add error display to component:
```typescript
const { error } = useCart();
{error && <Alert>{error}</Alert>}
```

---

## 🔗 Related Files

- `src/context/CartContext.tsx` - Cart state management
- `src/context/AuthContext.tsx` - Token/user state management
- `.env.local` - API URL configuration
- `CART_REFACTORING.md` - Detailed documentation
- `BEFORE_AFTER_COMPARISON.md` - What changed and why
