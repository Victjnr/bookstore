<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users and books
        $users = User::take(5)->get();
        $books = Book::all();

        if ($users->isEmpty() || $books->isEmpty()) {
            $this->command->info('Please seed Users and Books first.');
            return;
        }

        // Create sample orders
        $statuses = ['paid', 'shipped', 'pending', 'delivered', 'cancelled'];

        foreach ($users as $user) {
            // Create 2-4 orders per user
            for ($i = 0; $i < rand(2, 4); $i++) {
                $orderItems = [];
                $totalCents = 0;

                // Add 1-3 books per order
                $selectedBooks = $books->random(rand(1, 3));
                foreach ($selectedBooks as $book) {
                    $quantity = rand(1, 3);
                    $priceCents = $book->price_cents;
                    $itemTotal = $priceCents * $quantity;

                    $orderItems[] = [
                        'book_id' => $book->id,
                        'quantity' => $quantity,
                        'price_cents' => $priceCents,
                    ];

                    $totalCents += $itemTotal;
                }

                // Create the order
                $order = Order::create([
                    'user_id' => $user->id,
                    'total_cents' => $totalCents,
                    'status' => $statuses[array_rand($statuses)],
                    'payment_method' => ['card', 'paypal'][array_rand(['card', 'paypal'])],
                    'shipping_address' => "{$user->name}, 123 Main St, City, State 12345",
                    'shipped_at' => rand(0, 1) ? now()->subDays(rand(1, 10)) : null,
                    'delivered_at' => rand(0, 1) ? now()->subDays(rand(1, 5)) : null,
                ]);

                // Create order items
                foreach ($orderItems as $itemData) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        ...$itemData,
                    ]);
                }
            }
        }

        $this->command->info('Orders seeded successfully!');
    }
}
