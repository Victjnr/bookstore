<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Get all books
     */
    public function index()
    {
        $books = Book::all()->map(function ($book) {
            return [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'price' => $book->price_cents / 100,
                'originalPrice' => $book->original_price_cents ? $book->original_price_cents / 100 : null,
                'cover' => $book->cover_image,
                'rating' => $book->rating,
                'reviews' => $book->reviews,
                'genre' => $book->genre,
                'description' => $book->description,
                'pages' => $book->pages,
                'published' => $book->published,
                'isbn' => $book->isbn,
                'inStock' => $book->in_stock,
            ];
        });

        return response()->json([
            'success' => true,
            'books' => $books,
        ]);
    }

    /**
     * Get single book
     */
    public function show(string $id)
    {
        $book = Book::find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Book not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'book' => [
                'id' => $book->id,
                'title' => $book->title,
                'author' => $book->author,
                'price' => $book->price_cents / 100,
                'originalPrice' => $book->original_price_cents ? $book->original_price_cents / 100 : null,
                'cover' => $book->cover_image,
                'rating' => $book->rating,
                'reviews' => $book->reviews,
                'genre' => $book->genre,
                'description' => $book->description,
                'pages' => $book->pages,
                'published' => $book->published,
                'isbn' => $book->isbn,
                'inStock' => $book->in_stock,
            ],
        ]);
    }

    /**
     * Search books
     */
    public function search(Request $request)
    {
        $query = $request->query('q', '');

        if (strlen($query) < 2) {
            return response()->json([
                'success' => false,
                'message' => 'Search query must be at least 2 characters',
            ], 422);
        }

        $books = Book::where('title', 'like', "%{$query}%")
            ->orWhere('author', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'price' => $book->price_cents / 100,
                    'cover' => $book->cover_image,
                    'rating' => $book->rating,
                    'reviews' => $book->reviews,
                    'genre' => $book->genre,
                ];
            });

        return response()->json([
            'success' => true,
            'books' => $books,
        ]);
    }

    /**
     * Get books by genre
     */
    public function byGenre(string $genre)
    {
        $books = Book::where('genre', $genre)
            ->get()
            ->map(function ($book) {
                return [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'price' => $book->price_cents / 100,
                    'cover' => $book->cover_image,
                    'rating' => $book->rating,
                    'reviews' => $book->reviews,
                    'genre' => $book->genre,
                ];
            });

        return response()->json([
            'success' => true,
            'books' => $books,
        ]);
    }
}
