<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Seeder;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key constraints during seeding
        \DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // Clear existing books
        Book::truncate();

        // Re-enable foreign key constraints
        \DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Sample books from frontend
        $books = [
            [
                'title' => 'A Rail of Hope',
                'author' => 'Yvonne Tsumbirani',
                'price_cents' => 1000, // $10.00
                'original_price_cents' => 1299, // $12.99
                'cover_image' => '/books/a promise of a better future.jpeg',
                'rating' => 4.8,
                'reviews' => 2341,
                'genre' => 'Non-fiction',
                'description' => 'A powerful story of hope and resilience. Rail of Hope takes you on a journey through life\'s challenges and the moments that define us.',
                'pages' => 180,
                'published' => '2024',
                'isbn' => '978-0743273565',
                'in_stock' => true,
            ],
            [
                'title' => 'Walk of Life',
                'author' => 'Yvonne Tsumbirani',
                'price_cents' => 1000, // $10.00
                'original_price_cents' => null,
                'cover_image' => '/books/book 2 walk of life.jpeg',
                'rating' => 4.9,
                'reviews' => 3892,
                'genre' => 'Motivational',
                'description' => 'An inspiring narrative about life\'s journey and personal growth. Walk of Life explores the paths we choose and the destinations we reach.',
                'pages' => 328,
                'published' => '2024',
                'isbn' => '978-0451524935',
                'in_stock' => true,
            ],
            [
                'title' => 'The Voices in Me',
                'author' => 'Yvonne Tsumbirani',
                'price_cents' => 999, // $9.99
                'original_price_cents' => null,
                'cover_image' => '/books/the voices in me.jpeg',
                'rating' => 5.0,
                'reviews' => 3120,
                'genre' => 'Self-Help',
                'description' => 'An introspective exploration of the internal dialogue we all experience. The Voices in Me helps you understand and embrace your inner world.',
                'pages' => 432,
                'published' => '2024',
                'isbn' => '978-0141439518',
                'in_stock' => true,
            ],
        ];

        foreach ($books as $book) {
            Book::create($book);
        }
    }
}
