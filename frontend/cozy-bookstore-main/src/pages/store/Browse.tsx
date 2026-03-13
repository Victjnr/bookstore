import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookCard } from "@/components/store/BookCard";
import { books, genres } from "@/data/books";
import { motion } from "framer-motion";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre") || "All";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let result = books;

    if (selectedGenre !== "All") {
      result = result.filter((b) => b.genre === selectedGenre);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-low":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...result].sort((a, b) => b.price - a.price);
      case "rating":
        return [...result].sort((a, b) => b.rating - a.rating);
      case "title":
        return [...result].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return result;
    }
  }, [query, selectedGenre, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Browse Books</h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} {filtered.length === 1 ? "book" : "books"} found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, authors..."
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
        <div className="hidden sm:flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Genre Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {genres.map((genre) => (
          <Badge
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            className="cursor-pointer transition-colors"
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </Badge>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-serif text-foreground">No books found</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setQuery("");
              setSelectedGenre("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
              : "space-y-4"
          }
        >
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Browse;
