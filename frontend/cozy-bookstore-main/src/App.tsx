import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StoreLayout from "./layouts/StoreLayout";
import StoreHome from "./pages/store/Home";
import Browse from "./pages/store/Browse";
import BookDetail from "./pages/store/BookDetail";
import Cart from "./pages/store/Cart";
import NotFound from "./pages/NotFound";
import Books from "./pages/Books";
import Authors from "./pages/Authors";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

/**
 * Inner App component that uses AuthContext
 * This must be wrapped by AuthProvider in the outer component
 */
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<StoreLayout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/store" element={<StoreLayout />}>
              <Route index element={<StoreHome />} />
              <Route path="browse" element={<Browse />} />
              <Route path="book/:id" element={<BookDetail />} />
              <Route path="cart" element={<Cart />} />
            </Route>
            <Route path="/welcome" element={<Index />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="books" element={<Books />} />
              <Route path="authors" element={<Authors />} />
              <Route path="orders" element={<Orders />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="inventory" element={<Inventory />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
