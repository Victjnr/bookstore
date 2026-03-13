import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="p-4 rounded-2xl bg-primary/10">
            <BookOpen className="w-12 h-12 text-primary" />
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-serif font-bold text-foreground mb-4 leading-tight">
          Rail of Hope
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          Your curated online bookstore. Discover, browse, and order from thousands of literary treasures.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/store">
            <Button size="lg" className="text-base px-8">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="text-base px-8">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
          <Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link>
          <span>·</span>
          <Link to="/signup" className="hover:text-foreground transition-colors">Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
