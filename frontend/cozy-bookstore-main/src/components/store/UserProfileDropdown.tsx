import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Heart, Clock, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function UserProfileDropdown() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover:bg-muted"
      >
        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for small screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={
                "bg-background border border-border z-50 " +
                "fixed inset-x-0 top-14 max-h-[calc(100vh-3.5rem)] overflow-auto rounded-t-lg md:absolute md:inset-auto md:right-0 md:top-full md:mt-0 md:translate-y-2 md:transform md:w-72 md:rounded-lg md:max-h-full md:overflow-visible md:shadow-md"
              }
            >
              {/* Mobile header with close button */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border md:hidden">
                <div className="text-sm font-medium">Account</div>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            {/* User Info Header */}
            <div className="px-4 py-4 border-b border-border bg-background">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="px-4 py-3 border-b border-border bg-background grid grid-cols-2 gap-3">
              <div className="bg-muted/10 rounded-md p-2 text-center md:p-3">
                <p className="text-xs text-muted-foreground mb-1">Orders</p>
                <p className="text-lg font-semibold text-foreground">0</p>
              </div>
              <div className="bg-muted/10 rounded-md p-2 text-center md:p-3">
                <p className="text-xs text-muted-foreground mb-1">Wishlist</p>
                <p className="text-lg font-semibold text-foreground">0</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 bg-background">
              {/* Profile Option */}
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-foreground hover:bg-muted/40 md:hover:bg-muted transition-colors text-left md:px-3 md:py-2 md:gap-2"
              >
                <User className="h-4 w-4 text-muted-foreground md:text-foreground" />
                <div>
                  <p className="font-medium">My Profile</p>
                  <p className="text-xs text-muted-foreground">View and edit profile</p>
                </div>
              </button>

              {/* Wishlist Option */}
              <button
                onClick={() => {
                  navigate("/wishlist");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-foreground hover:bg-muted/40 md:hover:bg-muted transition-colors text-left md:px-3 md:py-2 md:gap-2"
              >
                <Heart className="h-4 w-4 text-muted-foreground md:text-foreground" />
                <div>
                  <p className="font-medium">Wishlist</p>
                  <p className="text-xs text-muted-foreground">Your saved books</p>
                </div>
              </button>

              {/* Order History Option */}
              <button
                onClick={() => {
                  navigate("/orders");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-foreground hover:bg-muted/40 md:hover:bg-muted transition-colors text-left md:px-3 md:py-2 md:gap-2"
              >
                <Clock className="h-4 w-4 text-muted-foreground md:text-foreground" />
                <div>
                  <p className="font-medium">Order History</p>
                  <p className="text-xs text-muted-foreground">Track your orders</p>
                </div>
              </button>

              {/* Settings Option */}
              <button
                onClick={() => {
                  navigate("/settings");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-foreground hover:bg-muted/40 md:hover:bg-muted transition-colors text-left border-b border-border md:px-3 md:py-2 md:gap-2"
              >
                <Settings className="h-4 w-4 text-muted-foreground md:text-foreground" />
                <div>
                  <p className="font-medium">Settings</p>
                  <p className="text-xs text-muted-foreground">Account preferences</p>
                </div>
              </button>
            </div>

            {/* Logout Button */}
            <div className="px-4 py-3">
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center gap-2 md:py-2 md:rounded-md"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
