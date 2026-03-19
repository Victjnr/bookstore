import { useState, useEffect } from 'react';
import { booksAPI } from '@/services/api';
import type { Book } from '@/data/books';

export function useBooksFromAPI() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await booksAPI.getAllBooks();
        
        // Handle both array and nested response formats
        const booksData = Array.isArray(response) ? response : response.books || [];
        setBooks(booksData);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch books';
        setError(errorMsg);
        console.error('Failed to load books:', err);
        // Don't fall back to hardcoded - let the error show
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return { books, loading, error };
}
