import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, Headphones, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/store/BookCard";
import { useBooksFromAPI } from "@/hooks/useBooksFromAPI";
import { useState, useEffect } from "react";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over $35" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected" },
  { icon: Headphones, title: "24/7 Support", desc: "We're here to help" },
  { image: "/books/rail_of_hope.jpeg", title: "Wide Selection", desc: "Over 10,000 titles" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const StoreHome = () => {
  const { books, loading, error } = useBooksFromAPI();
  const [featured, setFeatured] = useState<typeof books>([]);
  const [bestsellers, setBestsellers] = useState<typeof books>([]);

  useEffect(() => {
    if (books && books.length > 0) {
      // Get first 4 books as featured
      setFeatured(books.slice(0, 4));
      // Get books with highest rating as bestsellers
      const sorted = [...books].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setBestsellers(sorted.slice(0, 4));
    }
  }, [books]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="text-sm font-medium text-accent uppercase tracking-widest">
              New Season Collection
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mt-3 leading-tight">
              Discover Your Next Great Read
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-lg">
              Explore the vast collection of carefully curated books across every genre
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/store/browse">
                <Button size="lg" className="text-base px-8">
                  Browse Collection
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* <Link to="/store/browse?sort=best">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Bestsellers
                </Button>
              </Link> */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {f.icon ? (
                    <f.icon className="h-5 w-5 text-primary" />
                  ) : (
                    <img src={f.image} alt={f.title} className="h-5 w-5 rounded object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Featured Books</h2>
            <p className="text-muted-foreground mt-1">Hand-picked selections for you</p>
          </div>
          <Link to="/store/browse">
            <Button variant="ghost" className="text-primary">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-lg h-80" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No books available yet</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {featured.map((book) => (
              <motion.div key={book.id} variants={item}>
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">Join Our Reading Community</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-md mx-auto">
            Get personalized recommendations, exclusive deals, and early access to new releases.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="mt-6 text-base px-8">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Bestsellers */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12"> */}
        {/* <div className="flex items-center justify-between mb-8"> */}
          {/* <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Bestsellers</h2>
            <p className="text-muted-foreground mt-1">Most loved by our readers</p>
          </div>
          <Link to="/store/browse?sort=best">
            <Button variant="ghost" className="text-primary">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div> */}
        {/* <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {bestsellers.map((book) => (
            <motion.div key={book.id} variants={item}>
              <BookCard book={book} />
            </motion.div>
        //   ))}
        // </motion.div> */}
      {/* </section> */}
    </div>
  );
};

export default StoreHome;
