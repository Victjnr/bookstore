import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import type { Book } from "@/data/books";
import { motion } from "framer-motion";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
        <Link to={`/store/book/${book.id}`}>
          <div className="aspect-[3/4] overflow-hidden relative">
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {book.originalPrice && (
              <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                Sale
              </Badge>
            )}
            {!book.inStock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <Badge variant="secondary" className="text-sm">Out of Stock</Badge>
              </div>
            )}
          </div>
        </Link>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{book.genre}</p>
          <Link to={`/store/book/${book.id}`}>
            <h3 className="font-serif font-semibold text-foreground leading-tight hover:text-primary transition-colors line-clamp-1">
              {book.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-0.5">{book.author}</p>
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-3.5 w-3.5 text-accent fill-accent" />
            <span className="text-xs font-medium text-foreground">{book.rating}</span>
            <span className="text-xs text-muted-foreground">({book.reviews.toLocaleString()})</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">${book.price.toFixed(2)}</span>
              {book.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${book.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              disabled={!book.inStock}
              onClick={(e) => {
                e.preventDefault();
                addToCart(book);
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
