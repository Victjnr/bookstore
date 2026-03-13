import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function StoreFooter() {
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-serif font-bold text-foreground">Rail of Hope</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your curated online bookstore. Discover literary treasures from around the world.
            </p>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/store/browse" className="hover:text-foreground transition-colors">Browse All</Link></li>
              <li><Link to="/store/browse?genre=Fiction" className="hover:text-foreground transition-colors">Fiction</Link></li>
              <li><Link to="/store/browse?genre=Non-Fiction" className="hover:text-foreground transition-colors">Non-Fiction</Link></li>
              <li><Link to="/store/browse?sort=new" className="hover:text-foreground transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-foreground transition-colors">Create Account</Link></li>
              <li><Link to="/store/cart" className="hover:text-foreground transition-colors">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Returns</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Contact Us</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2026 Rail of Hope. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
