import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ArrowLeft, Truck, ShieldCheck, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookCard } from "@/components/store/BookCard";
import { useCart } from "@/context/CartContext";
import { books } from "@/data/books";

const BookDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-serif font-bold text-foreground">Book not found</h1>
        <Link to="/store/browse">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse
          </Button>
        </Link>
      </div>
    );
  }

  const related = books
    .filter((b) => b.genre === book.genre && b.id !== book.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/store/browse"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Browse
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
      >
        {/* Cover */}
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted max-w-md mx-auto md:mx-0 w-full">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <Badge variant="outline" className="w-fit mb-3">{book.genre}</Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            {book.title}
          </h1>
          <p className="text-lg text-muted-foreground mt-1">by {book.author}</p>

          <div className="flex items-center gap-2 mt-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(book.rating)
                      ? "text-accent fill-accent"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">{book.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({book.reviews.toLocaleString()} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-3xl font-bold text-foreground">
              ${book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
            {book.originalPrice && (
              <Badge className="bg-accent text-accent-foreground">
                {Math.round((1 - book.price / book.originalPrice) * 100)}% off
              </Badge>
            )}
          </div>

          <Separator className="my-6" />

          <p className="text-muted-foreground leading-relaxed">{book.description}</p>

          <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
            <div>
              <p className="text-muted-foreground">Pages</p>
              <p className="font-medium text-foreground">{book.pages}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Published</p>
              <p className="font-medium text-foreground">{book.published}</p>
            </div>
            <div>
              <p className="text-muted-foreground">ISBN</p>
              <p className="font-medium text-foreground text-xs mt-0.5">{book.isbn}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              size="lg"
              className="flex-1 text-base"
              disabled={!book.inStock}
              onClick={() => addToCart(book)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {book.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          <div className="flex flex-col gap-2 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Free shipping on orders over $35
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> 30-day return policy
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> {book.inStock ? "In stock — ships within 24h" : "Currently unavailable"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetail;
